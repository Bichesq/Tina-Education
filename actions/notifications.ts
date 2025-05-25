"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export async function markNotificationAsRead(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await prisma.notification.updateMany({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: { isRead: true },
    });

    // Revalidate the notifications page and dashboard
    revalidatePath("/dashboard/notifications");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw new Error("Failed to update notification");
  }
}

export async function markAllNotificationsAsRead() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    // Revalidate the notifications page and dashboard
    revalidatePath("/dashboard/notifications");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    throw new Error("Failed to update notifications");
  }
}

export async function getUnreadNotificationCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  try {
    const count = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    });

    return count;
  } catch (error) {
    console.error("Failed to get unread notification count:", error);
    return 0;
  }
}
