import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import Link from "next/link";
import { Manuscript, ReviewStatus } from "@prisma/client";

type ManuscriptWithReviews = Manuscript & {
  reviews: {
    status: ReviewStatus;
  }[];
};

async function getRecentManuscripts(
  userId: string
): Promise<ManuscriptWithReviews[]> {
  try {
    const manuscripts = await prisma.manuscript.findMany({
      where: { author_id: userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        user: {
          select: { name: true },
        },
        reviews: {
          select: { status: true },
        },
      },
    });

    return manuscripts;
  } catch (error) {
    console.error("Failed to fetch recent manuscripts:", error);
    return [];
  }
}

function getStatusInfo(manuscript: ManuscriptWithReviews) {
  const pendingReviews = manuscript.reviews.filter(
    (r) => r.status === "PENDING"
  ).length;
  const completedReviews = manuscript.reviews.filter(
    (r) => r.status === "REVIEW_SUBMITTED"
  ).length;

  if (manuscript.status === "PUBLISHED") {
    return {
      label: "Published",
      color: "bg-green-100 text-green-600",
      info: `${completedReviews} reviews completed`,
    };
  } else if (manuscript.status === "UNDER_REVIEW") {
    return {
      label: "Under Review",
      color: "bg-blue-100 text-blue-600",
      info: `${pendingReviews} reviews pending`,
    };
  } else {
    return {
      label: "Draft",
      color: "bg-amber-100 text-amber-600",
      info: "Not submitted for review",
    };
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export default async function RecentPublications() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">Recent Publications</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          Please log in to view your publications.
        </div>
      </div>
    );
  }

  const manuscripts = await getRecentManuscripts(session.user.id);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800">Recent Publications</h2>
        <Link href="/manuscripts" className="text-blue-900 font-medium hover:underline">
          View All
        </Link>
      </div>

      {manuscripts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No manuscripts yet</h3>
          <p className="text-gray-500 mb-4">Start by creating your first manuscript.</p>
          <Link
            href="/manuscripts"
            className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Create New Manuscript
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {manuscripts.map((manuscript) => {
            const status = getStatusInfo(manuscript);
            return (
              <div key={manuscript.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-700 relative">
                  <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                    {manuscript.title}
                  </h3>
                  <div className="flex justify-between text-gray-600 text-sm mb-4">
                    <span>{formatDate(manuscript.createdAt)}</span>
                    <span>{status.info}</span>
                  </div>
                  <div className="flex justify-between">
                    <Link
                      href={`/manuscripts/${manuscript.id}/edit`}
                      className="text-blue-900 font-medium text-sm hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/manuscripts/${manuscript.id}`}
                      className="text-blue-900 font-medium text-sm hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
