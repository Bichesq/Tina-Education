"use client";

import Link from "next/link";
import { FaBell } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function NotificationBell() {
  const { data: session, status } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/auth/notifications");
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unreadCount || 0);
        } else {
          console.warn("Failed to fetch notification count:", response.status);
          // Keep previous count on error
        }
      } catch (error) {
        // Silently handle network errors to avoid console spam
        if (error instanceof TypeError && error.message.includes("fetch")) {
          // Network error - keep previous count
          return;
        }
        console.error("Failed to fetch notification count:", error);
      } finally {
        // Loading state removed
      }
    };

    fetchUnreadCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [session?.user?.id]);

  // Wait for session to load
  if (status === "loading") {
    return <div className="w-6 h-6 animate-pulse bg-gray-200 rounded"></div>;
  }

  // No session means user is not logged in
  if (status === "unauthenticated" || !session?.user?.id) {
    return null;
  }

  return (
    <Link href="/dashboard/notifications" className="relative">
      <FaBell
        size={24}
        className="text-gray-600 hover:text-blue-600 transition-colors"
      />
      {/* Show notification count badge when there are unread notifications */}
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
