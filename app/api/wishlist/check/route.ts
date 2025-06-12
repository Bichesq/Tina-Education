import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../../prisma";
import { Pub_type } from "@prisma/client";

// GET - Check if item is in wishlist
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const publicationId = searchParams.get("publicationId");
    const selectedType = searchParams.get("selectedType");

    if (!publicationId || !selectedType) {
      return NextResponse.json(
        { error: "Publication ID and selected type are required" },
        { status: 400 }
      );
    }

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_publicationId_selectedType: {
          userId: session.user.id,
          publicationId,
          selectedType: selectedType as Pub_type,
        },
      },
    });

    return NextResponse.json({
      isInWishlist: !!wishlistItem,
      wishlistItem: wishlistItem ? {
        ...wishlistItem,
        createdAt: wishlistItem.createdAt.toISOString(),
        updatedAt: wishlistItem.updatedAt.toISOString(),
      } : null,
    });
  } catch (error) {
    console.error("Failed to check wishlist:", error);
    return NextResponse.json(
      { error: "Failed to check wishlist" },
      { status: 500 }
    );
  }
}
