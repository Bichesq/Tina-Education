import { auth } from "@/auth";
import { prisma } from "../../../../prisma";
import { NextResponse } from "next/server";
import { generateAndStorePdf } from "../../../../lib/pdf-service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const {
      title,
      abstract,
      content,
      keywords,
      uploadedFile,
      uploadedFileName,
    } = await request.json();

    // First, check if the manuscript exists and if the user owns it
    const existingManuscript = await prisma.manuscript.findUnique({
      where: { id },
      select: { author_id: true, title: true },
    });

    if (!existingManuscript) {
      return NextResponse.json(
        { error: "Manuscript not found" },
        { status: 404 }
      );
    }

    if (existingManuscript.author_id !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own manuscripts" },
        { status: 403 }
      );
    }

    console.log("📄 Starting manuscript update process...");
    console.log(`📝 Title: ${title}`);
    console.log(`👤 Author: ${session.user?.name}`);

    // Generate new PDF if content has changed
    let pdfUrl: string | null = null;
    try {
      pdfUrl = await generateAndStorePdf(
        content,
        title,
        session.user?.name || "Unknown Author"
      );

      if (!pdfUrl) {
        console.log("⚠️ PDF generation failed, continuing without PDF update");
      }
    } catch (pdfError) {
      console.error("❌ PDF generation error:", pdfError);
      // Continue without updating PDF if generation fails
    }

    // Update manuscript record
    const updateData: {
      title: string;
      abstract: string;
      content: string;
      keywords: string;
      uploadedFile: string | null;
      uploadedFileName: string | null;
      updatedAt: Date;
      pdfFile?: string;
    } = {
      title,
      abstract,
      content,
      keywords,
      uploadedFile: uploadedFile || null,
      uploadedFileName: uploadedFileName || null,
      updatedAt: new Date(),
    };

    // Only update PDF if generation was successful
    if (pdfUrl) {
      updateData.pdfFile = pdfUrl;
    }

    const updatedManuscript = await prisma.manuscript.update({
      where: { id },
      data: updateData,
    });

    console.log("✅ Manuscript updated successfully:", updatedManuscript.id);

    return NextResponse.json({
      success: true,
      message: "Manuscript updated successfully",
      manuscript: updatedManuscript,
    });

  } catch (error) {
    console.error("❌ Manuscript update failed:", error);
    return NextResponse.json(
      { 
        error: "Failed to update manuscript",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const manuscript = await prisma.manuscript.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!manuscript) {
      return NextResponse.json(
        { error: "Manuscript not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to view this manuscript
    const isAuthor = manuscript.author_id === session.user.id;
    const isReviewer = manuscript.reviews.some(review => review.reviewer_id === session.user.id);
    const isAdmin = session.user.role === "ADMIN";

    if (!isAuthor && !isReviewer && !isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to view this manuscript" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      manuscript,
    });

  } catch (error) {
    console.error("❌ Failed to fetch manuscript:", error);
    return NextResponse.json(
      { error: "Failed to fetch manuscript" },
      { status: 500 }
    );
  }
}
