import { auth } from "@/auth";
import { prisma } from "../../../../prisma";
import { notFound, redirect } from "next/navigation";
import ManuscriptEditForm from "../../../components/ManuscriptEditForm";

interface EditManuscriptPageProps {
  params: Promise<{ id: string }>;
}

async function getManuscript(id: string, userId: string) {
  try {
    const manuscript = await prisma.manuscript.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!manuscript) {
      return null;
    }

    // Only the author can edit their manuscript
    if (manuscript.author_id !== userId) {
      return null;
    }

    return manuscript;
  } catch (error) {
    console.error("Error fetching manuscript:", error);
    return null;
  }
}

export default async function EditManuscriptPage({ params }: EditManuscriptPageProps) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { id } = await params;
  const manuscript = await getManuscript(id, session.user.id);

  if (!manuscript) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ManuscriptEditForm manuscript={manuscript} />
    </div>
  );
}
