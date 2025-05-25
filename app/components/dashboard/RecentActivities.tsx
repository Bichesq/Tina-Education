import { auth } from "@/auth";
import { prisma } from "../../../prisma";

async function getRecentActivities(userId: string) {
  try {
    // Get recent notifications as activities
    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Get recent manuscripts
    const recentManuscripts = await prisma.manuscript.findMany({
      where: { author_id: userId },
      orderBy: { createdAt: "desc" },
      take: 2,
    });

    // Get recent reviews (if user is a reviewer)
    const recentReviews = await prisma.review.findMany({
      where: { reviewer_id: userId },
      orderBy: { createdAt: "desc" },
      take: 2,
      include: {
        manuscript: {
          select: { title: true }
        }
      }
    });

    // Combine and format activities
    const activities = [
      ...notifications.map(notification => ({
        id: notification.id,
        type: 'notification',
        icon: getNotificationIcon(notification.type),
        title: notification.title,
        description: notification.message,
        timestamp: notification.createdAt,
        isRead: notification.isRead
      })),
      ...recentManuscripts.map(manuscript => ({
        id: manuscript.id,
        type: 'manuscript',
        icon: '📝',
        title: 'Manuscript Created',
        description: `Created "${manuscript.title}"`,
        timestamp: manuscript.createdAt,
        isRead: true
      })),
      ...recentReviews.map(review => ({
        id: review.id,
        type: 'review',
        icon: '👀',
        title: 'Review Activity',
        description: `${review.status === 'COMPLETED' ? 'Completed' : 'Started'} review for "${review.manuscript.title}"`,
        timestamp: review.createdAt,
        isRead: true
      }))
    ];

    // Sort by timestamp and take most recent
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

  } catch (error) {
    console.error("Failed to fetch recent activities:", error);
    return [];
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "MANUSCRIPT_SUBMISSION":
      return "📝";
    case "REVIEW_COMPLETED":
      return "✅";
    case "REVIEW_REQUESTED":
      return "👀";
    default:
      return "🔔";
  }
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return date.toLocaleDateString();
}

export default async function RecentActivities() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          Please log in to view your activities.
        </div>
      </div>
    );
  }

  const activities = await getRecentActivities(session.user.id);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activities</h3>
            <p className="text-gray-500">Your activities will appear here as you use the system.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className={`flex items-start space-x-4 ${
                  index < activities.length - 1 ? 'pb-4 border-b border-gray-200' : ''
                }`}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-900 flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      activity.type === 'notification' && !activity.isRead 
                        ? 'text-blue-900' 
                        : 'text-gray-800'
                    }`}>
                      {activity.title}
                    </h4>
                    {activity.type === 'notification' && !activity.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {activity.description}
                  </p>
                  <span className="text-gray-400 text-xs mt-2 block">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
