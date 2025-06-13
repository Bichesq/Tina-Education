import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        affiliation: true,
        expertise: true,
        phone: true,
        website: true,
        orcid: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { name, bio, affiliation, expertise, phone, website, orcid } = data;

    // Validate ORCID format if provided
    if (orcid && orcid.trim() !== "") {
      const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
      if (!orcidRegex.test(orcid.trim())) {
        return NextResponse.json(
          { error: "Invalid ORCID format. Please use format: 0000-0000-0000-0000" },
          { status: 400 }
        );
      }
    }

    // Validate website URL if provided
    if (website && website.trim() !== "") {
      try {
        new URL(website);
      } catch {
        return NextResponse.json(
          { error: "Invalid website URL format" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name?.trim() || null,
        bio: bio?.trim() || null,
        affiliation: affiliation?.trim() || null,
        expertise: expertise?.trim() || null,
        phone: phone?.trim() || null,
        website: website?.trim() || null,
        orcid: orcid?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        affiliation: true,
        expertise: true,
        phone: true,
        website: true,
        orcid: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
