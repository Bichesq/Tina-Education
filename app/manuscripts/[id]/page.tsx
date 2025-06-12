import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { notFound, redirect } from "next/navigation";
import ManuscriptViewer from "../../components/reviews/ManuscriptViewer";
import Link from "next/link";

interface ManuscriptPageProps {
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
      return null;
    }

    // Check if user has permission to view this manuscript
    // Author can always view their own manuscript
    // Reviewers can view manuscripts assigned to them
    // Admins can view any manuscript
    const session = await auth();
    const isAuthor = manuscript.author_id === userId;
    const isReviewer = manuscript.reviews.some(review => review.reviewer_id === userId);
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAuthor && !isReviewer && !isAdmin) {
      return null;
    }

    return manuscript;
  } catch (error) {
    console.error("Error fetching manuscript:", error);
    return null;
  }
}

export default async function ManuscriptPage({ params }: ManuscriptPageProps) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/manuscripts"
                className="text-gray-500 hover:text-gray-700 flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Manuscripts</span>
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">
                Manuscript Details
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {manuscript.author_id === session.user.id && (
                <Link
                  href={`/manuscripts/${manuscript.id}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium text-sm"
                >
                  Edit Manuscript
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manuscript Viewer */}
      <div className="flex-1">
        <ManuscriptViewer manuscript={manuscript} />
      </div>
    </div>
  );
}
