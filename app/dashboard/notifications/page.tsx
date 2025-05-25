import { auth } from "@/auth";
import NotificationItem from "../../components/NotificationItem";
import { prisma } from "../../../prisma";
import { Suspense } from "react";

async function NotificationsList() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50, // Show more notifications
    }),
    prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    }),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {unreadCount} unread
          </span>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
          <p className="text-gray-500">You'll see notifications here when there's activity on your manuscripts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id} 
              notification={{
                ...notification,
                createdAt: notification.createdAt.toISOString(),
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Suspense fallback={<NotificationsLoading />}>
        <NotificationsList />
      </Suspense>
    </div>
  );
}
