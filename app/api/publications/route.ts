import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { Pub_type } from "@prisma/client";
import { put } from "@vercel/blob";

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
          select: { name: true, email: true },
        },
        genre: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
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

    // Handle FormData for file uploads
    console.log("📝 Processing publication creation request...");
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const abstract = formData.get("abstract") as string;
    const keywords = formData.get("keywords") as string;
    const type = formData.get("type") as string;
    const genreId = formData.get("genreId") as string;
    const cover = formData.get("cover") as string;
    const publicationFile = formData.get("publicationFile") as File | null;

    console.log("📝 Form data received:", {
      title,
      abstract: abstract?.substring(0, 50) + "...",
      keywords,
      type,
      genreId,
      cover,
      hasFile: !!publicationFile,
      fileSize: publicationFile?.size || 0,
    });

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Validate publication type
    const validTypes: Pub_type[] = [
      "JOURNAL",
      "ARTICLE",
      "BOOK",
      "EBOOK",
      "AUDIOBOOK",
    ];
    if (!validTypes.includes(type as Pub_type)) {
      return NextResponse.json(
        { error: "Invalid publication type" },
        { status: 400 }
      );
    }

    // Validate genre if provided
    if (genreId && genreId.trim()) {
      const genreExists = await prisma.genre.findUnique({
        where: { id: genreId },
      });
      if (!genreExists) {
        return NextResponse.json(
          { error: "Invalid genre selected" },
          { status: 400 }
        );
      }
    }

    // Handle file upload if provided
    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (publicationFile && publicationFile.size > 0) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/epub+zip",
        "application/x-mobipocket-ebook",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(publicationFile.type)) {
        return NextResponse.json(
          {
            error:
              "Invalid file type. Please upload PDF, EPUB, MOBI, TXT, DOC, or DOCX files only.",
          },
          { status: 400 }
        );
      }

      // Validate file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (publicationFile.size > maxSize) {
        return NextResponse.json(
          { error: "File size too large. Maximum size is 50MB." },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExtension = publicationFile.name.split(".").pop();
      const uniqueFilename = `publication-${timestamp}-${randomString}.${fileExtension}`;

      try {
        // Upload to Vercel Blob
        const blob = await put(
          `publications/${uniqueFilename}`,
          publicationFile,
          {
            access: "public",
            contentType: publicationFile.type,
          }
        );

        fileUrl = blob.url;
        fileName = publicationFile.name;
        console.log(`✅ Publication file uploaded successfully: ${blob.url}`);
      } catch (uploadError) {
        console.error("❌ File upload failed:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload file" },
          { status: 500 }
        );
      }
    }

    // Create the publication using raw SQL to work around Prisma client issue
    console.log("📝 Creating publication with file data...");

    const publicationId = `pub_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Use raw SQL to insert the publication with new fields
    await prisma.$executeRaw`
      INSERT INTO "Publication" (
        id, title, abstract, keywords, type, "genreId", cover, "fileUrl", "fileName", "author_id", "createdAt", "updatedAt"
      ) VALUES (
        ${publicationId},
        ${title.trim()},
        ${abstract?.trim() || null},
        ${keywords?.trim() || null},
        ${type}::"Pub_type",
        ${(genreId && genreId.trim()) || null},
        ${cover?.trim() || null},
        ${fileUrl},
        ${fileName},
        ${session.user.id},
        NOW(),
        NOW()
      )
    `;

    // Fetch the created publication with relations
    const publication = await prisma.publication.findUnique({
      where: { id: publicationId },
      include: {
        user: {
          select: { name: true, email: true },
        },
        genre: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Publication created successfully",
        publication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Failed to create publication:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      name: error instanceof Error ? error.name : "Unknown error type",
    });
    return NextResponse.json(
      {
        error: "Failed to create publication",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
