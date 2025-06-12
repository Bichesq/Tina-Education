import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { Pub_type } from "@prisma/client";

// GET - Get user's publications
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const publications = await prisma.publication.findMany({
      where: { author_id: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true }
        },
        genre: {
          select: { 
            id: true, 
            name: true, 
            slug: true,
            parent: {
              select: { id: true, name: true, slug: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ publications });
  } catch (error) {
    console.error("Failed to fetch publications:", error);
    return NextResponse.json(
      { error: "Failed to fetch publications" },
      { status: 500 }
    );
  }
}

// POST - Create new publication
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, abstract, keywords, type, genreId, cover } = body;

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Validate publication type
    const validTypes: Pub_type[] = ["JOURNAL", "ARTICLE", "BOOK", "EBOOK", "AUDIOBOOK"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid publication type" },
        { status: 400 }
      );
    }

    // Validate genre if provided
    if (genreId) {
      const genreExists = await prisma.genre.findUnique({
        where: { id: genreId }
      });
      if (!genreExists) {
        return NextResponse.json(
          { error: "Invalid genre selected" },
          { status: 400 }
        );
      }
    }

    // Create the publication
    const publication = await prisma.publication.create({
      data: {
        title: title.trim(),
        abstract: abstract?.trim() || null,
        keywords: keywords?.trim() || null,
        type: type as Pub_type,
        genreId: genreId || null,
        cover: cover?.trim() || null,
        author_id: session.user.id,
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        genre: {
          select: { 
            id: true, 
            name: true, 
            slug: true,
            parent: {
              select: { id: true, name: true, slug: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Publication created successfully",
      publication 
    }, { status: 201 });

  } catch (error) {
    console.error("Failed to create publication:", error);
    return NextResponse.json(
      { error: "Failed to create publication" },
      { status: 500 }
    );
  }
}
