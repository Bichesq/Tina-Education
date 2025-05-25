"use client";

import Link from "next/link";
import { FaBell } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function NotificationBell() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/auth/notifications");
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnreadCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [session?.user?.id]);

  if (!session?.user?.id) return null;

  return (
    <Link href="/dashboard/notifications" className="relative">
      <FaBell
        size={24}
        className="text-gray-600 hover:text-blue-600 transition-colors"
      />
      {!isLoading && unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
