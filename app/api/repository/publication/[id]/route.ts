import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const publication = await prisma.publication.findUnique({
      where: { id: params.id },
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
    });

    if (!publication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...publication,
      createdAt: publication.createdAt.toISOString(),
      updatedAt: publication.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch publication:", error);
    return NextResponse.json(
      { error: "Failed to fetch publication" },
      { status: 500 }
    );
  }
}
