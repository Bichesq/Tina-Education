import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";

export async function GET() {
  try {
    // Fetch all genres with their hierarchy
    const genres = await prisma.genre.findMany({
      include: {
        parent: true,
        children: true
      },
      orderBy: [
        { parentId: 'asc' },
        { name: 'asc' }
      ]
    });

    // Organize genres into parent-child structure
    const parentGenres = genres.filter(genre => !genre.parentId);
    const childGenres = genres.filter(genre => genre.parentId);

    const organizedGenres = parentGenres.map(parent => ({
      ...parent,
      children: childGenres.filter(child => child.parentId === parent.id)
    }));

    return NextResponse.json({
      genres: organizedGenres,
      allGenres: genres
    });
  } catch (error) {
    console.error("Failed to fetch genres:", error);
    return NextResponse.json(
      { error: "Failed to fetch genres" },
      { status: 500 }
    );
  }
}
