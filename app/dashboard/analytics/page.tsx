import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { Suspense } from "react";

async function AnalyticsData() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">Please log in to view your analytics.</p>
      </div>
    );
  }

  // Get user's manuscripts and reviews data
  const [manuscripts, reviews, publications] = await Promise.all([
    prisma.manuscript.findMany({
      where: { author_id: session.user.id },
      include: { reviews: true },
    }),
    prisma.review.findMany({
      where: { reviewer_id: session.user.id },
      include: { manuscript: true },
    }),
    prisma.publication.findMany({
      where: { author_id: session.user.id },
    }),
  ]);

  // Calculate statistics
  const totalManuscripts = manuscripts.length;
  const totalReviews = reviews.length;
  const totalPublications = publications.length;

  const manuscriptsByStatus = manuscripts.reduce((acc, manuscript) => {
    acc[manuscript.status] = (acc[manuscript.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const reviewsByStatus = reviews.reduce((acc, review) => {
    acc[review.status] = (acc[review.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const publicationsByType = publications.reduce((acc, publication) => {
    acc[publication.type] = (acc[publication.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate average review time (mock data for now)
  const avgReviewTime = reviews.length > 0 ? "14 days" : "N/A";

  // Recent activity (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentManuscripts = manuscripts.filter(
    (m) => m.createdAt >= thirtyDaysAgo
  ).length;
  const recentReviews = reviews.filter(
    (r) => r.createdAt >= thirtyDaysAgo
  ).length;

  const stats = [
    {
      title: "Total Manuscripts",
      value: totalManuscripts,
      icon: "📝",
      color: "bg-blue-100 text-blue-800",
      change: `+${recentManuscripts} this month`,
    },
    {
      title: "Reviews Completed",
      value: totalReviews,
      icon: "📋",
      color: "bg-green-100 text-green-800",
      change: `+${recentReviews} this month`,
    },
    {
      title: "Publications",
      value: totalPublications,
      icon: "📚",
      color: "bg-purple-100 text-purple-800",
      change: "Published works",
    },
    {
      title: "Avg Review Time",
      value: avgReviewTime,
      icon: "⏱️",
      color: "bg-orange-100 text-orange-800",
      change: "Average completion",
    },
  ];

  function getStatusColor(status: string) {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-orange-100 text-orange-800";
      case "IN_REVIEW":
        return "bg-blue-100 text-blue-800";
      case "REVIEW_SUBMITTED":
        return "bg-green-100 text-green-800";
      case "DECLINED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manuscript Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Manuscript Status Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(manuscriptsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      status
                    )}`}
                  >
                    {status.replace("_", " ")}
                  </span>
                </div>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Review Status Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(reviewsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      status
                    )}`}
                  >
                    {status.replace("_", " ")}
                  </span>
                </div>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Publication Types */}
      {totalPublications > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Publication Types
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(publicationsByType).map(([type, count]) => (
              <div
                key={type}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl mb-2">
                  {type === "JOURNAL" && "📄"}
                  {type === "ARTICLE" && "📝"}
                  {type === "BOOK" && "📚"}
                  {type === "EBOOK" && "💻"}
                  {type === "AUDIOBOOK" && "🎧"}
                </div>
                <p className="text-sm font-medium text-gray-900">{type}</p>
                <p className="text-lg font-bold text-blue-900">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Timeline Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-500">
            Activity timeline and detailed charts coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsLoading() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="p-8 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Track your academic progress and performance metrics
        </p>
      </div>

      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsData />
      </Suspense>
    </div>
  );
}
