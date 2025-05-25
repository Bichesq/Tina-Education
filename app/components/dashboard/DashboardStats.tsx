import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import StatsCard from "./StatsCard";

async function getDashboardStats(userId: string) {
  try {
    const [
      totalManuscripts,
      totalPublications,
      pendingReviews,
      totalNotifications,
      unreadNotifications
    ] = await Promise.all([
      // Total manuscripts by user
      prisma.manuscript.count({
        where: { author_id: userId }
      }),
      
      // Total publications by user
      prisma.publication.count({
        where: { author_id: userId }
      }),
      
      // Pending reviews assigned to user (if they're a reviewer)
      prisma.review.count({
        where: {
          reviewer_id: userId,
          status: "PENDING"
        }
      }),
      
      // Total notifications
      prisma.notification.count({
        where: { userId: userId }
      }),
      
      // Unread notifications
      prisma.notification.count({
        where: {
          userId: userId,
          isRead: false
        }
      })
    ]);

    // Calculate some derived stats
    const totalViews = totalPublications * 150; // Placeholder calculation
    const totalDownloads = totalPublications * 45; // Placeholder calculation

    return {
      totalManuscripts,
      totalPublications,
      totalViews,
      totalDownloads,
      pendingReviews,
      totalNotifications,
      unreadNotifications
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalManuscripts: 0,
      totalPublications: 0,
      totalViews: 0,
      totalDownloads: 0,
      pendingReviews: 0,
      totalNotifications: 0,
      unreadNotifications: 0
    };
  }
}

export default async function DashboardStats() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[...Array(4)].map((_, i) => (
          <StatsCard
            key={i}
            icon="📊"
            title="Loading..."
            value="--"
            loading={true}
          />
        ))}
      </div>
    );
  }

  const stats = await getDashboardStats(session.user.id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <StatsCard
        icon="📚"
        title="Total Publications"
        value={stats.totalPublications}
        trend={{ value: 12, isPositive: true }}
      />
      
      <StatsCard
        icon="👁️"
        title="Total Views"
        value={stats.totalViews.toLocaleString()}
        trend={{ value: 8, isPositive: true }}
      />
      
      <StatsCard
        icon="⬇️"
        title="Downloads"
        value={stats.totalDownloads}
        trend={{ value: 15, isPositive: true }}
      />
      
      <StatsCard
        icon="📝"
        title="Pending Reviews"
        value={stats.pendingReviews}
        trend={stats.pendingReviews > 0 ? { value: 5, isPositive: false } : undefined}
      />
    </div>
  );
}
