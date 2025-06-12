import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { Pub_type } from "@prisma/client";

// GET - Get user's wishlist
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        publication: {
          include: {
            user: {
              select: { name: true, email: true },
            },
            genre: {
              include: {
                parent: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      wishlistItems: wishlistItems.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        publication: {
          ...item.publication,
          createdAt: item.publication.createdAt.toISOString(),
          updatedAt: item.publication.updatedAt.toISOString(),
        },
      })),
    });
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { publicationId, selectedType } = await request.json();

    if (!publicationId || !selectedType) {
      return NextResponse.json(
        { error: "Publication ID and selected type are required" },
        { status: 400 }
      );
    }

    // Check if publication exists
    const publication = await prisma.publication.findUnique({
      where: { id: publicationId },
    });

    if (!publication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      );
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_publicationId_selectedType: {
          userId: session.user.id,
          publicationId,
          selectedType: selectedType as Pub_type,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "Item already in wishlist" },
        { status: 409 }
      );
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        publicationId,
        selectedType: selectedType as Pub_type,
      },
      include: {
        publication: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      ...wishlistItem,
      createdAt: wishlistItem.createdAt.toISOString(),
      updatedAt: wishlistItem.updatedAt.toISOString(),
      publication: {
        ...wishlistItem.publication,
        createdAt: wishlistItem.publication.createdAt.toISOString(),
        updatedAt: wishlistItem.publication.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to add to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: Request) {
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

    // Remove from wishlist
    const deletedItem = await prisma.wishlistItem.delete({
      where: {
        userId_publicationId_selectedType: {
          userId: session.user.id,
          publicationId,
          selectedType: selectedType as Pub_type,
        },
      },
    });

    return NextResponse.json({
      message: "Item removed from wishlist",
      deletedItem: {
        ...deletedItem,
        createdAt: deletedItem.createdAt.toISOString(),
        updatedAt: deletedItem.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to remove from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
