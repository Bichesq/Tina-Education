import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../../../../prisma";
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
    const { role } = await request.json();

    if (!["USER", "REVIEWER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Get the target user
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent changing own role
    if (targetUser.id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      );
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: targetUser.id,
        title: `Role Updated to ${role}`,
        message: `Your account role has been updated to ${role.toLowerCase()} by an administrator.`,
        type: "ROLE_UPDATE",
        relatedId: targetUser.id,
      },
    });

    // Send email notification to user
    if (process.env.RESEND_API_KEY) {
      try {


        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin: 0;">🔄 Account Role Updated</h2>
            </div>
            
            <p>Dear ${targetUser.name || "User"},</p>
            
            <p>Your account role has been updated by an administrator.</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Role Change Details:</h3>
              <p style="margin: 5px 0;"><strong>Previous Role:</strong> ${targetUser.role}</p>
              <p style="margin: 5px 0;"><strong>New Role:</strong> ${role}</p>
              <p style="margin: 5px 0;"><strong>Updated By:</strong> ${admin.name || "Administrator"}</p>
            </div>
            
            ${role === "REVIEWER" ? `
              <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #1e40af;">Reviewer Access Granted:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                  <li>You can now review manuscripts</li>
                  <li>Access the reviewer dashboard</li>
                  <li>Receive review assignments</li>
                </ul>
              </div>
            ` : role === "ADMIN" ? `
              <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #dc2626;">Administrator Access Granted:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #dc2626;">
                  <li>Full system administration access</li>
                  <li>User and role management</li>
                  <li>Review application approval</li>
                  <li>System statistics and monitoring</li>
                </ul>
              </div>
            ` : `
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #374151;">Standard User Access:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                  <li>Submit manuscripts for review</li>
                  <li>Access personal dashboard</li>
                  <li>Manage publications</li>
                </ul>
              </div>
            `}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard"
                 style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Access Dashboard
              </a>
            </div>
            
            <p>If you have any questions about this change, please contact the administrator.</p>
            
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
          to: targetUser.email,
          subject: `Account Role Updated to ${role} - Tina Education`,
          html: emailContent,
        });

        console.log(`✅ Role change email sent to: ${targetUser.email}`);
      } catch (emailError) {
        console.error("Failed to send role change email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      message: `User role updated to ${role} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Failed to update user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
