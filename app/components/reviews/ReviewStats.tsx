import { auth } from "@/auth";
import { prisma } from "../../../prisma";

async function getReviewStats(userId: string) {
  try {
    const [
      totalReviews,
      pendingAssignments,
      acceptedAssignments,
      declinedAssignments,
      inReviewCount,
      submittedReviews,
    ] = await Promise.all([
      // Total reviews assigned to user
      prisma.review.count({
        where: { reviewer_id: userId },
      }),

      // Pending assignment responses
      prisma.review.count({
        where: {
          reviewer_id: userId,
          status: "PENDING",
        },
      }),

      // Accepted assignments
      prisma.review.count({
        where: {
          reviewer_id: userId,
          status: "ACCEPTED",
        },
      }),

      // Declined assignments
      prisma.review.count({
        where: {
          reviewer_id: userId,
          status: "DECLINED",
        },
      }),

      // Currently in review
      prisma.review.count({
        where: {
          reviewer_id: userId,
          status: "IN_REVIEW",
        },
      }),

      // Submitted reviews
      prisma.review.count({
        where: {
          reviewer_id: userId,
          status: "REVIEW_SUBMITTED",
        },
      }),
    ]);

    return {
      totalReviews,
      pendingAssignments,
      acceptedAssignments,
      declinedAssignments,
      inReviewCount,
      submittedReviews,
    };
  } catch (error) {
    console.error("Failed to fetch review stats:", error);
    return {
      totalReviews: 0,
      pendingAssignments: 0,
      acceptedAssignments: 0,
      declinedAssignments: 0,
      inReviewCount: 0,
      submittedReviews: 0,
    };
  }
}

export default async function ReviewStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const stats = await getReviewStats(session.user.id);

  const statItems = [
    {
      label: "Total Assignments",
      value: stats.totalReviews,
      icon: "📋",
      color: "bg-blue-50 text-blue-900",
    },
    {
      label: "Pending Response",
      value: stats.pendingAssignments,
      icon: "⏳",
      color: "bg-yellow-50 text-yellow-900",
    },
    {
      label: "Accepted",
      value: stats.acceptedAssignments,
      icon: "✅",
      color: "bg-green-50 text-green-900",
    },
    {
      label: "In Review",
      value: stats.inReviewCount,
      icon: "📖",
      color: "bg-blue-50 text-blue-900",
    },
    {
      label: "Completed",
      value: stats.submittedReviews,
      icon: "📤",
      color: "bg-purple-50 text-purple-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className={`bg-white rounded-lg shadow-sm border p-4 ${item.color}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl">{item.icon}</div>
            <div className="text-2xl font-bold">
              {item.value}
            </div>
          </div>
          <div className="text-sm font-medium">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
