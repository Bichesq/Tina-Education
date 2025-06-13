import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import Link from "next/link";
import { Suspense } from "react";
import ReviewStats from "../../components/reviews/ReviewStats";
import ReviewActions from "../../components/reviews/ReviewActions";

async function getReviews(userId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { reviewer_id: userId },
      orderBy: { createdAt: "desc" },
      include: {
        manuscript: {
          select: {
            title: true,
            abstract: true,
            type: true,
            keywords: true,
            createdAt: true,
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    return reviews;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
}

function getStatusInfo(status: string) {
  switch (status) {
    case "PENDING":
      return {
        label: "Pending Assignment",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏳",
        description: "Awaiting your response to assignment",
      };
    case "ACCEPTED":
      return {
        label: "Assignment Accepted",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "✅",
        description: "You accepted this review assignment",
      };
    case "DECLINED":
      return {
        label: "Assignment Declined",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "❌",
        description: "You declined this review assignment",
      };
    case "IN_REVIEW":
      return {
        label: "In Review",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "📖",
        description: "Currently reviewing the manuscript",
      };
    case "REVIEW_SUBMITTED":
      return {
        label: "Review Submitted",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "📤",
        description: "Review completed and submitted",
      };
    default:
      return {
        label: "Unknown",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "❓",
        description: "Status unknown",
      };
  }
}

function getTypeInfo(type: string) {
  switch (type) {
    case "JOURNAL":
      return {
        icon: "📄",
        label: "Journal Article",
        color: "bg-blue-50 text-blue-700",
      };
    case "ARTICLE":
      return {
        icon: "📝",
        label: "Article",
        color: "bg-green-50 text-green-700",
      };
    case "BOOK":
      return {
        icon: "📚",
        label: "Book",
        color: "bg-purple-50 text-purple-700",
      };
    case "EBOOK":
      return {
        icon: "💻",
        label: "E-book",
        color: "bg-orange-50 text-orange-700",
      };
    case "AUDIOBOOK":
      return {
        icon: "🎧",
        label: "Audiobook",
        color: "bg-indigo-50 text-indigo-700",
      };
    default:
      return {
        icon: "📄",
        label: "Document",
        color: "bg-gray-50 text-gray-700",
      };
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getDaysAgo(date: Date) {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

async function ReviewsList() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">Please log in to view your reviews.</p>
      </div>
    );
  }

  // Check if user is a reviewer
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "REVIEWER" && user?.role !== "ADMIN") {
    // Check if user has already applied to be a reviewer
    const existingApplication = await prisma.reviewerApplication.findUnique({
      where: { userId: session.user.id },
    });

    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📖</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Become a Reviewer
        </h3>
        <p className="text-gray-500 mb-6">
          You are not currently assigned as a reviewer. Apply to become a
          reviewer and help evaluate manuscripts in your area of expertise.
        </p>

        {existingApplication ? (
          <div className="mb-6">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                existingApplication.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : existingApplication.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : existingApplication.status === "UNDER_REVIEW"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
              }`}
            >
              {existingApplication.status === "PENDING" &&
                "⏳ Application Pending"}
              {existingApplication.status === "APPROVED" &&
                "✅ Application Approved"}
              {existingApplication.status === "UNDER_REVIEW" &&
                "🔍 Under Review"}
              {existingApplication.status === "REJECTED" &&
                "❌ Application Rejected"}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {existingApplication.status === "PENDING" &&
                "Your application is being reviewed by administrators."}
              {existingApplication.status === "APPROVED" &&
                "Your application has been approved! Your reviewer role will be activated soon."}
              {existingApplication.status === "UNDER_REVIEW" &&
                "Your application is currently under detailed review."}
              {existingApplication.status === "REJECTED" &&
                "Your application was not approved. You may apply again after addressing feedback."}
            </p>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!existingApplication && (
            <Link
              href="/reviewer-application"
              className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              📝 Apply to be a Reviewer
            </Link>
          )}
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const reviews = await getReviews(session.user.id);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Reviews Assigned
        </h3>
        <p className="text-gray-500 mb-6">
          You don&apos;t have any manuscripts assigned for review yet. Check
          back later for new assignments.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const status = getStatusInfo(review.status);
        const type = getTypeInfo(review.manuscript.type);
        const daysAgo = getDaysAgo(review.createdAt);

        return (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {review.manuscript.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}
                  >
                    {status.icon} {status.label}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className={`px-2 py-1 rounded ${type.color}`}>
                    {type.icon} {type.label}
                  </span>
                  <span>By {review.manuscript.user.name}</span>
                  <span>•</span>
                  <span>Assigned {formatDate(review.createdAt)}</span>
                  <span>•</span>
                  <span>{status.description}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Assigned</div>
                <div className="text-sm font-medium text-gray-700">
                  {daysAgo} days ago
                </div>
              </div>
            </div>

            {review.manuscript.abstract && (
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed line-clamp-2">
                  {review.manuscript.abstract}
                </p>
              </div>
            )}

            {review.manuscript.keywords && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {review.manuscript.keywords
                    .split(",")
                    .slice(0, 5)
                    .map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  {review.manuscript.keywords.split(",").length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-sm">
                      +{review.manuscript.keywords.split(",").length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {review.feedback && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Your Review:</h4>
                <p className="text-gray-700 text-sm">{review.feedback}</p>
                {review.score && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">Score: </span>
                    <span className="font-medium">{review.score}/10</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span>📅</span>
                  <span>Updated {formatDate(review.updatedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📧</span>
                  <span>{review.manuscript.user.email}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {/* Assignment Response Buttons - Only for PENDING */}
                <ReviewActions
                  reviewId={review.id}
                  status={review.status}
                  manuscriptTitle={review.manuscript.title}
                />

                {/* Review Platform Access - Only for ACCEPTED */}
                {review.status === "ACCEPTED" && (
                  <Link
                    href={`/reviews/${review.id}/review`}
                    className="px-3 py-1 bg-blue-900 text-white rounded text-sm hover:bg-blue-800 transition-colors"
                  >
                    📖 Start Review
                  </Link>
                )}

                {/* Continue Review - For IN_REVIEW */}
                {review.status === "IN_REVIEW" && (
                  <Link
                    href={`/reviews/${review.id}/review`}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    📝 Continue Review
                  </Link>
                )}

                <Link
                  href={`/reviews/${review.id}`}
                  className="text-blue-900 hover:text-blue-700 font-medium text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReviewsLoading() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="flex space-x-4 mb-3">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="flex space-x-2 mb-4">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-18"></div>
          </div>
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <div className="flex space-x-6">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex space-x-3">
              <div className="h-4 bg-gray-200 rounded w-12"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="p-8 min-h-full">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Reviews
            </h1>
            <p className="text-gray-600">
              Manage and track your manuscript review assignments
            </p>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border p-4 animate-pulse"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        }
      >
        <ReviewStats />
      </Suspense>

      <Suspense fallback={<ReviewsLoading />}>
        <ReviewsList />
      </Suspense>
    </div>
  );
}
