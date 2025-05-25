import { auth } from "@/auth";
import { prisma } from "../../../../prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    }),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}
