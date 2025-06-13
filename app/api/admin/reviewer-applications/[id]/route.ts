import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../../../prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, name: true },
    });

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const { action } = await request.json();

    if (!["APPROVE", "REJECT", "UNDER_REVIEW"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Get the application with user details
    const application = await prisma.reviewerApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Update application status
    const newStatus = action === "APPROVE" ? "APPROVED" : action === "REJECT" ? "REJECTED" : "UNDER_REVIEW";
    
    const updatedApplication = await prisma.reviewerApplication.update({
      where: { id },
      data: {
        status: newStatus,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        adminNotes: `${action.toLowerCase()} by ${admin.name || session.user.email}`,
      },
    });

    // If approved, update user role to REVIEWER
    if (action === "APPROVE") {
      await prisma.user.update({
        where: { id: application.userId },
        data: { role: "REVIEWER" },
      });
    }

    // Create notification for the applicant
    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: `Reviewer Application ${action === "APPROVE" ? "Approved" : action === "REJECT" ? "Rejected" : "Under Review"}`,
        message: action === "APPROVE" 
          ? "Congratulations! Your reviewer application has been approved. You now have reviewer access."
          : action === "REJECT"
          ? "Your reviewer application has been reviewed. Please check your email for details."
          : "Your reviewer application is currently under detailed review.",
        type: "REVIEWER_APPLICATION_UPDATE",
        relatedId: application.id,
      },
    });

    // Send email notification to applicant
    if (process.env.RESEND_API_KEY) {
      try {
        const emailSubject = action === "APPROVE" 
          ? "Reviewer Application Approved - Welcome to Tina Education"
          : action === "REJECT"
          ? "Reviewer Application Update - Tina Education"
          : "Reviewer Application Under Review - Tina Education";

        const emailContent = action === "APPROVE" 
          ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1e40af; margin: 0;">🎉 Congratulations! Your Application is Approved</h2>
              </div>
              
              <p>Dear ${application.user.name || "Reviewer"},</p>
              
              <p>We are pleased to inform you that your reviewer application has been <strong>approved</strong>!</p>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #374151;">What's Next:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                  <li>You now have reviewer access to the system</li>
                  <li>You will start receiving manuscript review assignments</li>
                  <li>Please review our reviewer guidelines and best practices</li>
                  <li>Maintain confidentiality and provide constructive feedback</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/reviews"
                   style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Access Reviewer Dashboard
                </a>
              </div>
              
              <p>Thank you for joining our community of expert reviewers. Your expertise and insights will help maintain the quality of academic publications.</p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #64748b; font-size: 14px;">
                Best regards,<br>
                Tina Education Team<br>
                <small>This is an automated notification.</small>
              </p>
            </div>
          `
          : action === "REJECT"
          ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #dc2626; margin: 0;">📋 Reviewer Application Update</h2>
              </div>
              
              <p>Dear ${application.user.name || "Applicant"},</p>
              
              <p>Thank you for your interest in becoming a reviewer for Tina Education. After careful consideration, we are unable to approve your reviewer application at this time.</p>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #374151;">Next Steps:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                  <li>You may reapply in the future as your qualifications develop</li>
                  <li>Consider gaining more experience in your field of expertise</li>
                  <li>Continue contributing to the academic community</li>
                </ul>
              </div>
              
              <p>We appreciate your interest in contributing to the peer review process and encourage you to continue your academic pursuits.</p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #64748b; font-size: 14px;">
                Best regards,<br>
                Tina Education Team<br>
                <small>This is an automated notification.</small>
              </p>
            </div>
          `
          : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1e40af; margin: 0;">🔍 Application Under Review</h2>
              </div>
              
              <p>Dear ${application.user.name || "Applicant"},</p>
              
              <p>Your reviewer application is currently under detailed review by our administrative team.</p>
              
              <p>We will notify you of our decision soon. Thank you for your patience.</p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #64748b; font-size: 14px;">
                Best regards,<br>
                Tina Education Team<br>
                <small>This is an automated notification.</small>
              </p>
            </div>
          `;

        await resend.emails.send({
          from: "Tina Education <noreply@tinaeducation.org>",
          to: application.user.email,
          subject: emailSubject,
          html: emailContent,
        });

        console.log(`✅ Email sent to applicant: ${application.user.email}`);
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      message: `Application ${action.toLowerCase()}d successfully`,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Failed to update reviewer application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
