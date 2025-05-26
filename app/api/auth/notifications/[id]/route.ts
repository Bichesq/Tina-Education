import { auth } from "@/auth";
import { prisma } from "../../../../../prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = await context.params;

  await prisma.notification.updateMany({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}
