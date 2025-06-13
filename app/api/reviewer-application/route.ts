import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { motivation, expertise, experience, qualifications, availability } = data;

    // Validation
    if (!motivation?.trim()) {
      return NextResponse.json(
        { error: "Motivation is required" },
        { status: 400 }
      );
    }

    if (!expertise?.trim()) {
      return NextResponse.json(
        { error: "Areas of expertise are required" },
        { status: 400 }
      );
    }

    if (!qualifications?.trim()) {
      return NextResponse.json(
        { error: "Qualifications are required" },
        { status: 400 }
      );
    }

    // Check if user is already a reviewer or admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "REVIEWER" || user.role === "ADMIN") {
      return NextResponse.json(
        { error: "You are already a reviewer or admin" },
        { status: 400 }
      );
    }

    // Check if user has already applied
    const existingApplication = await prisma.reviewerApplication.findUnique({
      where: { userId: session.user.id },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already submitted an application" },
        { status: 400 }
      );
    }

    // Create the application
    const application = await prisma.reviewerApplication.create({
      data: {
        userId: session.user.id,
        motivation: motivation.trim(),
        expertise: expertise.trim(),
        experience: experience?.trim() || "",
        qualifications: qualifications.trim(),
        availability: availability?.trim() || "",
        status: "PENDING",
      },
    });

    // Create notification for admins
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, email: true, name: true },
    });

    // Create notifications for all admins
    const notificationPromises = admins.map((admin) =>
      prisma.notification.create({
        data: {
          userId: admin.id,
          title: "New Reviewer Application",
          message: `${user.name || user.email} has submitted a reviewer application`,
          type: "REVIEWER_APPLICATION",
          relatedId: application.id,
        },
      })
    );

    await Promise.all(notificationPromises);

    // Send email notifications to admins
    if (process.env.RESEND_API_KEY && admins.length > 0) {
      const emailPromises = admins.map((admin) =>
        resend.emails.send({
          from: "Tina Education <noreply@tinaeducation.org>",
          to: admin.email,
          subject: "New Reviewer Application Submitted",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1e40af; margin: 0;">📝 New Reviewer Application</h2>
              </div>
              
              <p>Dear ${admin.name || "Administrator"},</p>
              
              <p>A new reviewer application has been submitted and requires your review.</p>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #374151;">Applicant Information:</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${user.name || "Not provided"}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                <p style="margin: 5px 0;"><strong>Application ID:</strong> ${application.id}</p>
              </div>
              
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #92400e;">Areas of Expertise:</h4>
                <p style="margin: 0; color: #92400e;">${expertise.substring(0, 200)}${expertise.length > 200 ? "..." : ""}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/admin"
                   style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Review Application
                </a>
              </div>
              
              <p>Please log in to the admin dashboard to review the complete application and make a decision.</p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #64748b; font-size: 14px;">
                Best regards,<br>
                Tina Education System<br>
                <small>This is an automated notification.</small>
              </p>
            </div>
          `,
        })
      );

      try {
        await Promise.all(emailPromises);
        console.log(`✅ Email notifications sent to ${admins.length} admins`);
      } catch (emailError) {
        console.error("Failed to send email notifications:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      message: "Application submitted successfully",
      application: {
        id: application.id,
        status: application.status,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error("Failed to submit reviewer application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
