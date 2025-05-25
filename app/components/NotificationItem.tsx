"use client";

import { markNotificationAsRead } from "@/actions/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  relatedId: string | null;
  createdAt: string;
}

export default function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);
      }
      
      // Navigate based on notification type
      if (notification.type === "MANUSCRIPT_SUBMISSION" && notification.relatedId) {
        router.push(`/manuscripts/${notification.relatedId}`);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to handle notification click:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "MANUSCRIPT_SUBMISSION":
        return "📝";
      case "REVIEW_COMPLETED":
        return "✅";
      case "REVIEW_REQUESTED":
        return "👀";
      default:
        return "📢";
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
        !notification.isRead 
          ? "bg-blue-50 border-blue-200 hover:bg-blue-100" 
          : "bg-white border-gray-200 hover:bg-gray-50"
      } ${isLoading ? "opacity-50" : ""}`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium truncate ${!notification.isRead ? "text-blue-900" : "text-gray-900"}`}>
              {notification.title}
            </h3>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-2">{formatDate(notification.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
