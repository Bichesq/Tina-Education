import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { Suspense } from "react";
import Link from "next/link";

async function CollaboratorsList() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">Please log in to view your collaborators.</p>
      </div>
    );
  }

  // Get users who have reviewed this user's manuscripts (potential collaborators)
  const reviewers = await prisma.user.findMany({
    where: {
      review: {
        some: {
          manuscript: {
            author_id: session.user.id,
          },
        },
      },
    },
    include: {
      review: {
        where: {
          manuscript: {
            author_id: session.user.id,
          },
        },
        include: {
          manuscript: {
            select: { title: true, id: true },
          },
        },
      },
    },
  });

  // Get users whose manuscripts this user has reviewed
  const collaboratedAuthors = await prisma.user.findMany({
    where: {
      manuscripts: {
        some: {
          reviews: {
            some: {
              reviewer_id: session.user.id,
            },
          },
        },
      },
    },
    include: {
      manuscripts: {
        where: {
          reviews: {
            some: {
              reviewer_id: session.user.id,
            },
          },
        },
        select: { title: true, id: true },
      },
    },
  });

  // Combine and deduplicate collaborators
  const allCollaborators = new Map();

  reviewers.forEach((reviewer) => {
    if (reviewer.id !== session.user.id) {
      allCollaborators.set(reviewer.id, {
        ...reviewer,
        relationship: "Reviewer",
        manuscripts: reviewer.review.map((r) => r.manuscript),
      });
    }
  });

  collaboratedAuthors.forEach((author) => {
    if (author.id !== session.user.id) {
      const existing = allCollaborators.get(author.id);
      if (existing) {
        allCollaborators.set(author.id, {
          ...existing,
          relationship: "Mutual Collaborator",
          manuscripts: [...existing.manuscripts, ...author.manuscripts],
        });
      } else {
        allCollaborators.set(author.id, {
          ...author,
          relationship: "Author",
          manuscripts: author.manuscripts,
        });
      }
    }
  });

  const collaborators = Array.from(allCollaborators.values());

  if (collaborators.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Collaborators Yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start collaborating by submitting manuscripts for review or reviewing others' work.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/manuscripts/new"
            className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Submit Manuscript
          </Link>
          <Link
            href="/dashboard/reviews"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Review Manuscripts
          </Link>
        </div>
      </div>
    );
  }

  function getRelationshipColor(relationship: string) {
    switch (relationship) {
      case "Reviewer":
        return "bg-blue-100 text-blue-800";
      case "Author":
        return "bg-green-100 text-green-800";
      case "Mutual Collaborator":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getRelationshipIcon(relationship: string) {
    switch (relationship) {
      case "Reviewer":
        return "👨‍🔬";
      case "Author":
        return "👨‍💼";
      case "Mutual Collaborator":
        return "🤝";
      default:
        return "👤";
    }
  }

  return (
    <div className="space-y-6">
      {collaborators.map((collaborator) => (
        <div
          key={collaborator.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                {collaborator.image ? (
                  <img
                    src={collaborator.image}
                    alt={collaborator.name || "User"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl">
                    {getRelationshipIcon(collaborator.relationship)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {collaborator.name || "Anonymous User"}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(
                      collaborator.relationship
                    )}`}
                  >
                    {collaborator.relationship}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{collaborator.email}</p>
                
                {collaborator.manuscripts && collaborator.manuscripts.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Collaborated on:
                    </p>
                    <div className="space-y-1">
                      {collaborator.manuscripts.slice(0, 3).map((manuscript: any) => (
                        <Link
                          key={manuscript.id}
                          href={`/manuscripts/${manuscript.id}`}
                          className="block text-sm text-blue-900 hover:text-blue-700 hover:underline"
                        >
                          • {manuscript.title}
                        </Link>
                      ))}
                      {collaborator.manuscripts.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{collaborator.manuscripts.length - 3} more manuscripts
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="text-blue-900 hover:text-blue-700 font-medium text-sm">
                Message
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors">
                View Profile
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CollaboratorsLoading() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                  <div className="h-3 bg-gray-200 rounded w-36"></div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CollaboratorsPage() {
  return (
    <div className="p-8 min-h-full">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Co-authors</h1>
            <p className="text-gray-600">
              Connect with reviewers and authors you've collaborated with
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Collaborators are automatically identified based on review activities.
              Direct collaboration features coming soon.
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<CollaboratorsLoading />}>
        <CollaboratorsList />
      </Suspense>
    </div>
  );
}
