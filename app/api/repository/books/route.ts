import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause for books and ebooks
    const where: {
      type: { in: string[] };
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        abstract?: { contains: string; mode: "insensitive" };
        keywords?: { contains: string; mode: "insensitive" };
        user?: { name?: { contains: string; mode: "insensitive" } };
      }>;
    } = {
      type: {
        in: ["BOOK", "EBOOK", "AUDIOBOOK"]
      }
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { abstract: { contains: search, mode: "insensitive" } },
        { keywords: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch books with pagination
    const [books, totalCount] = await Promise.all([
      prisma.publication.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.publication.count({ where })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      books: books.map(book => ({
        ...book,
        createdAt: book.createdAt.toISOString(),
        updatedAt: book.updatedAt.toISOString(),
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
