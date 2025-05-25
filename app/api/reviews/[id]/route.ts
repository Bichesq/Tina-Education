import { auth } from "@/auth";
import { prisma } from "../../../../prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, reason } = await request.json();
    const { id: reviewId } = await params;

    // Validate action - for assignment response
    if (!["ACCEPT_ASSIGNMENT", "DECLINE_ASSIGNMENT"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Get the review with manuscript and author details
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        manuscript: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if the current user is the assigned reviewer
    if (review.reviewer_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if review assignment is still pending
    if (review.status !== "PENDING") {
      return NextResponse.json(
        { error: "Review assignment has already been responded to" },
        { status: 400 }
      );
    }

    // Determine new status based on action (using updated enum values)
    const newStatus = action === "ACCEPT_ASSIGNMENT" ? "ACCEPTED" : "DECLINED";

    // Update the review assignment
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        status: newStatus,
        feedback: reason || null,
        updatedAt: new Date(),
      },
    });

    const actionText = action === "ACCEPT_ASSIGNMENT" ? "accepted" : "declined";
    console.log(
      `📝 Review assignment ${actionText} by ${session.user.name}: ${review.manuscript.title}`
    );

    // Create notification for manuscript author
    const notification = await prisma.notification.create({
      data: {
        userId: review.manuscript.user.id,
        title: `Reviewer ${action === "ACCEPT_ASSIGNMENT" ? "Accepted" : "Declined"} Assignment`,
        message: `${review.user.name} has ${actionText} the review assignment for "${review.manuscript.title}"`,
        type: `ASSIGNMENT_${action === "ACCEPT_ASSIGNMENT" ? "ACCEPTED" : "DECLINED"}`,
        relatedId: review.manuscript.id,
      },
    });

    console.log(
      `✅ Notification created for author: ${review.manuscript.user.email}`
    );

    // Send email notification to manuscript author
    try {
      const isAccepted = action === "ACCEPT_ASSIGNMENT";
      const emailResult = await resend.emails.send({
        from: "ARRS System <onboarding@resend.dev>",
        to: review.manuscript.user.email!,
        subject: `Reviewer ${isAccepted ? "Accepted" : "Declined"} Assignment: "${review.manuscript.title}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: ${isAccepted ? "#f0f9ff" : "#fef2f2"}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: ${isAccepted ? "#1e40af" : "#dc2626"}; margin: 0;">
                ${isAccepted ? "✅" : "❌"} Review Assignment ${isAccepted ? "Accepted" : "Declined"}
              </h2>
            </div>

            <p>Hello <strong>${review.manuscript.user.name}</strong>,</p>

            <p>We have an update regarding the review assignment for your manuscript:</p>

            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #334155;">📄 Assignment Details</h3>
              <p style="margin: 5px 0;"><strong>Title:</strong> ${review.manuscript.title}</p>
              <p style="margin: 5px 0;"><strong>Reviewer:</strong> ${review.user.name}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${isAccepted ? "#16a34a" : "#dc2626"}; font-weight: bold;">${isAccepted ? "ACCEPTED" : "DECLINED"}</span></p>
            </div>

            ${
              reason
                ? `
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #334155;">💬 ${isAccepted ? "Reviewer Note" : "Decline Reason"}</h3>
                <p style="margin: 0; line-height: 1.6;">${reason}</p>
              </div>
            `
                : ""
            }

            ${
              isAccepted
                ? `<p><strong>Next Steps:</strong> The reviewer will now begin the review process. You will be notified when the review is completed.</p>`
                : `<p><strong>Next Steps:</strong> We will assign another reviewer to your manuscript. You will be notified when a new reviewer accepts the assignment.</p>`
            }

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/manuscripts"
                 style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View My Manuscripts
              </a>
            </div>

            <p>Thank you for using the Academic Review Request System.</p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            <p style="color: #64748b; font-size: 14px;">
              Best regards,<br>
              Academic Review Request System (ARRS)<br>
              <small>This is an automated notification.</small>
            </p>
          </div>
        `,
      });

      console.log(
        `✅ Email sent to author: ${review.manuscript.user.email}`,
        emailResult
      );
    } catch (emailError) {
      console.error(`❌ Failed to send email to author:`, emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      review: updatedReview,
      message: `Assignment ${actionText} successfully`,
    });
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
