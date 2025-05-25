import { auth } from "@/auth";
import { prisma } from "../../../../prisma";
import { notFound, redirect } from "next/navigation";
import ReviewInterface from "../../../components/reviews/ReviewInterface";

async function getReviewData(reviewId: string, userId: string) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        manuscript: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        user: {
          select: { name: true, email: true },
        },
        messages: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!review) {
      return null;
    }

    // Check if the current user is the assigned reviewer
    if (review.reviewer_id !== userId) {
      return null;
    }

    // Check if review is in a state that allows reviewing
    if (!["ACCEPTED", "IN_REVIEW"].includes(review.status)) {
      return null;
    }

    return review;
  } catch (error) {
    console.error("Failed to fetch review data:", error);
    return null;
  }
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { id } = await params;
  const review = await getReviewData(id, session.user.id);

  if (!review) {
    notFound();
  }

  // Update review status to IN_REVIEW if it's ACCEPTED and this is the first time accessing
  if (review.status === "ACCEPTED") {
    await prisma.review.update({
      where: { id },
      data: {
        status: "IN_REVIEW",
        updatedAt: new Date(),
      },
    });
    review.status = "IN_REVIEW";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewInterface review={review} />
    </div>
  );
}
