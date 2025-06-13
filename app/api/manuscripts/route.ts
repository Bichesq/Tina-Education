import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { generateAndStorePdf } from "../../../lib/pdf-service";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return (
      console.log("Unauthorized"),
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );

  try {
    const {
      title,
      abstract,
      content,
      keywords,
      uploadedFile,
      uploadedFileName,
      isDraft = false,
    } = await request.json();

    console.log(
      `📄 Starting manuscript ${isDraft ? "draft save" : "submission"} process...`
    );
    console.log(`📝 Title: ${title}`);
    console.log(`👤 Author: ${session.user?.name}`);
    console.log(`📋 Is Draft: ${isDraft}`);

    // Generate and upload PDF to Vercel Blob only if not a draft or if content exists
    let pdfUrl = null;
    if (!isDraft && content) {
      pdfUrl = await generateAndStorePdf(
        content,
        title,
        session.user?.name || "Unknown Author"
      );

      if (!pdfUrl) {
        console.log("❌ Failed to generate PDF");
        return NextResponse.json(
          { error: "Failed to generate PDF" },
          { status: 500 }
        );
      }
    }

    // Create manuscript record with error logging
    let manuscript;
    try {
      manuscript = await prisma.manuscript.create({
        data: {
          author_id: session.user.id,
          title,
          abstract,
          content,
          keywords,
          pdfFile: pdfUrl || "", // Provide empty string if no PDF generated
          uploadedFile: uploadedFile || null,
          uploadedFileName: uploadedFileName || null,
          status: isDraft ? "DRAFT" : "SUBMITTED",
        },
      });
    } catch (prismaError: unknown) {
      console.error("Prisma manuscript.create failed:", prismaError, {
        author_id: session.user.id,
        title,
        abstract,
        content,
        keywords,
        pdfFile: pdfUrl,
        uploadedFile: uploadedFile || null,
        uploadedFileName: uploadedFileName || null,
      });
      return NextResponse.json(
        {
          error: "Failed to create manuscript",
          details:
            prismaError instanceof Error
              ? prismaError.message
              : String(prismaError),
        },
        { status: 500 }
      );
    }

    // Only send notifications and create reviews for submitted manuscripts, not drafts
    if (!isDraft) {
      // Get reviewers
      const reviewers = await prisma.user.findMany({
        where: { role: "REVIEWER" },
      });

      // Send notifications
      console.log(
        `📧 Starting email notifications for ${reviewers.length} reviewers`
      );
      console.log(
        `🔑 Resend API Key configured: ${process.env.RESEND_API_KEY ? "Yes" : "No"}`
      );

      if (!Array.isArray(reviewers) || reviewers.length === 0) {
        console.log("⚠️ No reviewers found. Skipping notifications.");
      } else {
        await Promise.all(
          reviewers.map(async (reviewer, index) => {
            try {
              console.log(
                `📝 Processing reviewer ${index + 1}/${reviewers.length}: ${reviewer.email}`
              );

              // Create review assignment
              const review = await prisma.review.create({
                data: {
                  manuscript_id: manuscript.id,
                  reviewer_id: reviewer.id,
                  content: `Review assignment for manuscript: ${manuscript.title}`,
                  status: "PENDING",
                },
              });
              console.log(
                `✅ Review assignment created for ${reviewer.email}:`,
                review.id
              );

              // Create dashboard notification
              const notification = await prisma.notification.create({
                data: {
                  id: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                  userId: reviewer.id,
                  title: "New Manuscript Submitted",
                  message: `New manuscript "${manuscript.title}" from ${session.user?.name} requires your review`,
                  type: "MANUSCRIPT_SUBMISSION",
                  relatedId: manuscript.id,
                },
              });
              console.log(
                `✅ Dashboard notification created for ${reviewer.email}:`,
                notification.id
              );

              // Send email notification
              const emailResult = await resend.emails.send({
                from: "Tina Education <onboarding@resend.dev>",
                to: reviewer.email!,
                subject: `New Manuscript Review Request: "${manuscript.title}"`,
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #1e40af; margin: 0;">📝 New Manuscript Review Request</h2>
                  </div>

                  <p>Hello <strong>${reviewer.name || "Reviewer"}</strong>,</p>

                  <p>A new manuscript has been submitted and requires your expert review:</p>

                  <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <h3 style="margin: 0 0 10px 0; color: #334155;">📄 Manuscript Details</h3>
                    <p style="margin: 5px 0;"><strong>Title:</strong> ${manuscript.title}</p>
                    <p style="margin: 5px 0;"><strong>Author:</strong> ${session.user?.name}</p>
                    <p style="margin: 5px 0;"><strong>Abstract:</strong> ${manuscript.abstract}</p>
                    <p style="margin: 5px 0;"><strong>Keywords:</strong> ${manuscript.keywords}</p>
                  </div>

                  <p>Please log in to the Tina Education system to access the full manuscript and begin your review.</p>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard"
                       style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      Review Manuscript
                    </a>
                  </div>

                  <p>Thank you for your contribution to the academic review process.</p>

                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                  <p style="color: #64748b; font-size: 14px;">
                    Best regards,<br>
                    Tina Education<br>
                    <small>This is an automated notification from the development environment.</small>
                  </p>
                </div>
              `,
              });
              console.log(
                `✅ Email sent successfully to ${reviewer.email}:`,
                emailResult
              );
            } catch (notifyErr) {
              console.error(
                `❌ Notification/email failed for reviewer ${reviewer.id} (${reviewer.email}):`,
                notifyErr
              );
              // Log more details about the error
              if (notifyErr instanceof Error) {
                console.error(`Error message: ${notifyErr.message}`);
                console.error(`Error stack: ${notifyErr.stack}`);
              }
            }
          })
        );
      }
    } else {
      console.log("📋 Draft saved successfully. No notifications sent.");
    }

    return NextResponse.json({ success: true, manuscript });
  } catch (error) {
    console.error("Unexpected error in manuscript creation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
