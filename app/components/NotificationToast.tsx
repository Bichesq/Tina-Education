"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

export default function NotificationToast() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Function to add a new toast notification
  const addNotification = (notification: Omit<ToastNotification, "id">) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const newNotification = { ...notification, id };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Poll for new notifications (in a real app, you'd use WebSockets or Server-Sent Events)
  useEffect(() => {
    if (!session?.user?.id) return;

    const checkForNewNotifications = async () => {
      try {
        const response = await fetch("/api/auth/notifications");
        if (response.ok) {
          const data = await response.json();
          // This is a simple implementation - in production you'd want to track which notifications are new
          // and only show toasts for truly new ones
        } else {
          console.warn(
            "Failed to fetch notifications:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        // Silently handle network errors to avoid spamming console
        // Only log if it's not a network connectivity issue
        if (error instanceof TypeError && error.message.includes("fetch")) {
          // Network error - don't log to avoid spam
          return;
        }
        console.error("Failed to check for notifications:", error);
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkForNewNotifications, 30000);

    return () => clearInterval(interval);
  }, [session?.user?.id]);

  // Expose the addNotification function globally for other components to use
  useEffect(() => {
    (window as any).showNotificationToast = addNotification;

    return () => {
      delete (window as any).showNotificationToast;
    };
  }, []);

  const getToastStyles = (type: ToastNotification["type"]) => {
    const baseStyles = "p-4 rounded-lg shadow-lg border-l-4 max-w-sm";

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 border-green-400 text-green-800`;
      case "error":
        return `${baseStyles} bg-red-50 border-red-400 text-red-800`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800`;
      case "info":
      default:
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800`;
    }
  };

  const getIcon = (type: ToastNotification["type"]) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "ℹ️";
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getToastStyles(notification.type)} animate-slide-in-right`}
        >
          <div className="flex items-start">
            <span className="text-lg mr-3">{getIcon(notification.type)}</span>
            <div className="flex-1">
              <h4 className="font-medium">{notification.title}</h4>
              <p className="text-sm mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-3 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
