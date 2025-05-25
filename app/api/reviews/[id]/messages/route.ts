import { auth } from "@/auth";
import { prisma } from "../../../../../prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, sender } = await request.json();
    const { id: reviewId } = await params;

    // Validate input
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    if (!["REVIEWER", "EDITOR", "AUTHOR"].includes(sender)) {
      return NextResponse.json({ error: "Invalid sender type" }, { status: 400 });
    }

    // Get the review to verify access
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        manuscript: {
          select: { author_id: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if user has permission to send messages for this review
    const isReviewer = review.reviewer_id === session.user.id;
    const isAuthor = review.manuscript.author_id === session.user.id;
    const isEditor = session.user.role === "ADMIN"; // Assuming editors have ADMIN role

    if (!isReviewer && !isAuthor && !isEditor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify sender matches user role
    if (sender === "REVIEWER" && !isReviewer) {
      return NextResponse.json({ error: "Cannot send as reviewer" }, { status: 403 });
    }
    if (sender === "AUTHOR" && !isAuthor) {
      return NextResponse.json({ error: "Cannot send as author" }, { status: 403 });
    }
    if (sender === "EDITOR" && !isEditor) {
      return NextResponse.json({ error: "Cannot send as editor" }, { status: 403 });
    }

    // Create the message
    const message = await prisma.reviewMessage.create({
      data: {
        content: content.trim(),
        sender,
        reviewId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // Create notifications for other participants
    const notificationPromises = [];

    if (sender !== "REVIEWER" && isReviewer) {
      notificationPromises.push(
        prisma.notification.create({
          data: {
            userId: review.reviewer_id,
            title: "New Review Message",
            message: `New message from ${sender.toLowerCase()} about review`,
            type: "REVIEW_MESSAGE",
            relatedId: reviewId,
          },
        })
      );
    }

    if (sender !== "AUTHOR" && isAuthor) {
      notificationPromises.push(
        prisma.notification.create({
          data: {
            userId: review.manuscript.author_id,
            title: "New Review Message",
            message: `New message from ${sender.toLowerCase()} about your manuscript review`,
            type: "REVIEW_MESSAGE",
            relatedId: reviewId,
          },
        })
      );
    }

    // Note: For editors, we'd need to identify who the editor is for this review
    // This would require additional schema changes to track assigned editors

    await Promise.all(notificationPromises);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      data: message
    });

  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: reviewId } = await params;

    // Get the review to verify access
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        manuscript: {
          select: { author_id: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if user has permission to view messages for this review
    const isReviewer = review.reviewer_id === session.user.id;
    const isAuthor = review.manuscript.author_id === session.user.id;
    const isEditor = session.user.role === "ADMIN";

    if (!isReviewer && !isAuthor && !isEditor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get messages for this review
    const messages = await prisma.reviewMessage.findMany({
      where: { reviewId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
