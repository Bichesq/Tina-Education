import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { Suspense } from "react";
import Link from "next/link";

async function MessagesList() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">Please log in to view your messages.</p>
      </div>
    );
  }

  // Get review messages where user is involved
  const reviewMessages = await prisma.reviewMessage.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        {
          review: {
            OR: [
              { reviewer_id: session.user.id },
              { manuscript: { author_id: session.user.id } },
            ],
          },
        },
      ],
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
      review: {
        include: {
          manuscript: {
            select: { title: true, author_id: true },
          },
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Group messages by review
  const messagesByReview = reviewMessages.reduce(
    (acc, message) => {
      const reviewId = message.reviewId;
      if (!acc[reviewId]) {
        acc[reviewId] = {
          review: message.review,
          messages: [],
        };
      }
      acc[reviewId].messages.push(message);
      return acc;
    },
    {} as Record<
      string,
      {
        review: (typeof reviewMessages)[0]["review"];
        messages: typeof reviewMessages;
      }
    >
  );

  const reviewGroups = Object.values(messagesByReview);

  if (reviewGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Messages Yet
        </h3>
        <p className="text-gray-500 mb-6">
          Messages from review discussions will appear here.
        </p>
        <Link
          href="/dashboard/reviews"
          className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
        >
          View Reviews
        </Link>
      </div>
    );
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function getSenderIcon(sender: string) {
    switch (sender) {
      case "REVIEWER":
        return "👨‍🔬";
      case "EDITOR":
        return "✏️";
      case "AUTHOR":
        return "👨‍💼";
      default:
        return "💬";
    }
  }

  function getSenderColor(sender: string) {
    switch (sender) {
      case "REVIEWER":
        return "bg-blue-100 text-blue-800";
      case "EDITOR":
        return "bg-purple-100 text-purple-800";
      case "AUTHOR":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="space-y-6">
      {reviewGroups.map((group) => (
        <div
          key={group.review.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Review Discussion: {group.review.manuscript.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                Reviewer: {group.review.user.name || group.review.user.email}
              </span>
              <span>•</span>
              <span>{group.messages.length} messages</span>
              <span>•</span>
              <Link
                href={`/dashboard/reviews/${group.review.id}`}
                className="text-blue-900 hover:text-blue-700 font-medium"
              >
                View Review
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {group.messages
              .slice(0, 3)
              .map((message: (typeof reviewMessages)[0]) => (
                <div
                  key={message.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <span className="text-lg">
                      {getSenderIcon(message.sender)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getSenderColor(
                          message.sender
                        )}`}
                      >
                        {message.sender}
                      </span>
                      <span className="text-sm text-gray-500">
                        {message.user.name || message.user.email}
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

            {group.messages.length > 3 && (
              <div className="text-center pt-2">
                <Link
                  href={`/dashboard/reviews/${group.review.id}`}
                  className="text-blue-900 hover:text-blue-700 text-sm font-medium"
                >
                  View all {group.messages.length} messages
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesLoading() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
        >
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="flex space-x-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <div className="p-8 min-h-full">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-600">
              Review discussions and communications
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Currently showing review-related messages.
              General messaging features coming soon.
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<MessagesLoading />}>
        <MessagesList />
      </Suspense>
    </div>
  );
}
