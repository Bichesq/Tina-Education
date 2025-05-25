import { auth } from "@/auth";
import { prisma } from "../../../../../prisma";
import { NextResponse } from "next/server";

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

    // Get the review to verify ownership
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { reviewer_id: true, status: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if the current user is the assigned reviewer
    if (review.reviewer_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if review is in a state that allows updating
    if (!["ACCEPTED", "IN_REVIEW"].includes(review.status)) {
      return NextResponse.json(
        { error: "Review cannot be updated in its current state" },
        { status: 400 }
      );
    }

    // Update the review with the provided data
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
        progressPercentage: data.progressPercentage,
        timeSpent: data.timeSpent,
        status: "IN_REVIEW", // Ensure status is IN_REVIEW when updating
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview
    });

  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
