import { auth } from "@/auth";
import { prisma } from "../../../../../prisma";
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
    const data = await request.json();
    const { id: reviewId } = await params;

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

    // Check if review is in a state that allows submission
    if (!["ACCEPTED", "IN_REVIEW"].includes(review.status)) {
      return NextResponse.json(
        { error: "Review cannot be submitted in its current state" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!data.recommendation || !data.contentEvaluation || !data.publicComments) {
      return NextResponse.json(
        { error: "Missing required fields: recommendation, content evaluation, and public comments are required" },
        { status: 400 }
      );
    }

    // Update the review with final submission data
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        contentEvaluation: data.contentEvaluation,
        styleEvaluation: data.styleEvaluation,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        recommendation: data.recommendation,
        confidentialComments: data.confidentialComments,
        publicComments: data.publicComments,
        overallRating: data.overallRating,
        progressPercentage: 100,
        timeSpent: data.timeSpent,
        status: "REVIEW_SUBMITTED",
        updatedAt: new Date(),
      },
    });

    // Create notification for the manuscript author
    await prisma.notification.create({
      data: {
        userId: review.manuscript.user.id,
        title: "Review Completed",
        message: `Your manuscript "${review.manuscript.title}" has been reviewed. The review is now complete.`,
        type: "REVIEW_COMPLETED",
        relatedId: reviewId,
      },
    });

    // Send email notification to author (if email service is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "noreply@tinaeducation.org",
          to: review.manuscript.user.email,
          subject: `Review Completed: ${review.manuscript.title}`,
          html: `
            <h2>Review Completed</h2>
            <p>Dear ${review.manuscript.user.name},</p>
            <p>The review for your manuscript "<strong>${review.manuscript.title}</strong>" has been completed.</p>
            <p><strong>Reviewer Recommendation:</strong> ${data.recommendation.replace('_', ' ')}</p>
            <p>Please log in to your dashboard to view the detailed review feedback.</p>
            <p>Best regards,<br>Tina Education Review Team</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      review: updatedReview
    });

  } catch (error) {
    console.error("Failed to submit review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
