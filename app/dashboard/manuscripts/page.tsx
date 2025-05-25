import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import Link from "next/link";
import { Suspense } from "react";
import ManuscriptStats from "../../components/manuscripts/ManuscriptStats";

async function getManuscripts(userId: string) {
  try {
    const manuscripts = await prisma.manuscript.findMany({
      where: { author_id: userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        reviews: {
          select: {
            status: true,
            reviewer_id: true,
            createdAt: true,
          },
        },
      },
    });

    return manuscripts;
  } catch (error) {
    console.error("Failed to fetch manuscripts:", error);
    return [];
  }
}

function getStatusInfo(manuscript: any) {
  const pendingReviews = manuscript.reviews.filter(
    (r: any) => r.status === "PENDING"
  ).length;
  const acceptedReviews = manuscript.reviews.filter(
    (r: any) => r.status === "ACCEPTED"
  ).length;
  const rejectedReviews = manuscript.reviews.filter(
    (r: any) => r.status === "REJECTED"
  ).length;

  if (manuscript.status === "ACCEPTED") {
    return {
      label: "Accepted",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: "✅",
      description: `Accepted with ${acceptedReviews} positive reviews`,
    };
  } else if (manuscript.status === "UNDER_REVIEW") {
    return {
      label: "Under Review",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: "👀",
      description: `${pendingReviews} pending, ${acceptedReviews} accepted reviews`,
    };
  } else if (manuscript.status === "REJECTED") {
    return {
      label: "Rejected",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: "❌",
      description: `Rejected after ${rejectedReviews} reviews`,
    };
  } else if (manuscript.status === "SUBMITTED") {
    return {
      label: "Submitted",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: "📤",
      description: "Submitted and awaiting review assignment",
    };
  } else if (manuscript.status === "DRAFT") {
    return {
      label: "Draft",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: "📝",
      description: "Work in progress - not submitted",
    };
  } else {
    return {
      label: "Unknown",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: "⚠️",
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

function getProgressPercentage(manuscript: any) {
  let progress = 0;

  // Basic info (20%)
  if (manuscript.title && manuscript.abstract) progress += 20;

  // Content (40%)
  if (manuscript.content && manuscript.content.length > 100) progress += 40;

  // Keywords and metadata (20%)
  if (manuscript.keywords) progress += 20;

  // Submission status (20%)
  if (manuscript.status !== "DRAFT") progress += 20;

  return Math.min(progress, 100);
}

async function ManuscriptsList() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">Please log in to view your manuscripts.</p>
      </div>
    );
  }

  const manuscripts = await getManuscripts(session.user.id);

  if (manuscripts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Manuscripts Yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start your academic journey by creating your first manuscript.
        </p>
        <Link
          href="/manuscripts/new"
          className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
        >
          <span className="mr-2">+</span>
          Create New Manuscript
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {manuscripts.map((manuscript) => {
        const status = getStatusInfo(manuscript);
        const type = getTypeInfo(manuscript.type);
        const progress = getProgressPercentage(manuscript);

        return (
          <div
            key={manuscript.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {manuscript.title}
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
                  <span>Created {formatDate(manuscript.createdAt)}</span>
                  <span>•</span>
                  <span>{status.description}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Progress</div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {progress}%
                  </span>
                </div>
              </div>
            </div>

            {manuscript.abstract && (
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed line-clamp-2">
                  {manuscript.abstract}
                </p>
              </div>
            )}

            {manuscript.keywords && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {manuscript.keywords
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
                  {manuscript.keywords.split(",").length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-sm">
                      +{manuscript.keywords.split(",").length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span>📊</span>
                  <span>{manuscript.reviews.length} reviews</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📅</span>
                  <span>Updated {formatDate(manuscript.updatedAt)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href={`/manuscripts/${manuscript.id}/edit`}
                  className="text-blue-900 hover:text-blue-700 font-medium text-sm"
                >
                  Edit
                </Link>
                <Link
                  href={`/manuscripts/${manuscript.id}`}
                  className="text-blue-900 hover:text-blue-700 font-medium text-sm"
                >
                  View Details
                </Link>
                {manuscript.status === "DRAFT" && (
                  <Link
                    href={`/manuscripts/${manuscript.id}/submit`}
                    className="px-3 py-1 bg-blue-900 text-white rounded text-sm hover:bg-blue-800 transition-colors"
                  >
                    Submit for Review
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ManuscriptsLoading() {
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
              <div className="h-2 bg-gray-200 rounded w-24"></div>
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

export default function ManuscriptsPage() {
  return (
    <div className="p-8 min-h-full">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Manuscripts
            </h1>
            <p className="text-gray-600">
              Manage your academic manuscripts and track their progress
            </p>
          </div>
          <Link
            href="/manuscripts/new"
            className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            <span className="mr-2">+</span>
            New Manuscript
          </Link>
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
        <ManuscriptStats />
      </Suspense>

      <Suspense fallback={<ManuscriptsLoading />}>
        <ManuscriptsList />
      </Suspense>
    </div>
  );
}
