import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import Link from "next/link";
import { Suspense } from "react";
import PublicationStats from "../../components/publications/PublicationStats";

async function getPublications(userId: string) {
  try {
    const publications = await prisma.publication.findMany({
      where: { author_id: userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return publications;
  } catch (error) {
    console.error("Failed to fetch publications:", error);
    return [];
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function getPublicationTypeIcon(type: string) {
  switch (type) {
    case 'JOURNAL':
      return '📄';
    case 'ARTICLE':
      return '📝';
    case 'BOOK':
      return '📚';
    case 'EBOOK':
      return '💻';
    case 'AUDIOBOOK':
      return '🎧';
    default:
      return '📝';
  }
}

function getPublicationTypeColor(type: string) {
  switch (type) {
    case 'JOURNAL':
      return 'bg-blue-100 text-blue-800';
    case 'ARTICLE':
      return 'bg-green-100 text-green-800';
    case 'BOOK':
      return 'bg-purple-100 text-purple-800';
    case 'EBOOK':
      return 'bg-orange-100 text-orange-800';
    case 'AUDIOBOOK':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

async function PublicationsList() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-500">Please log in to view your publications.</p>
      </div>
    );
  }

  const publications = await getPublications(session.user.id);

  if (publications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Publications Yet</h3>
        <p className="text-gray-500 mb-6">
          You haven't published any work yet. Start by creating and submitting your first manuscript.
        </p>
        <Link
          href="/manuscripts/new"
          className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
        >
          Create New Manuscript
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {publications.map((publication) => (
        <div
          key={publication.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {getPublicationTypeIcon(publication.type)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {publication.title}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span>By {publication.user.name}</span>
                  <span>•</span>
                  <span>{formatDate(publication.createdAt)}</span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPublicationTypeColor(publication.type)}`}>
              {publication.type}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">
              {publication.abstract}
            </p>
          </div>

          {publication.keywords && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {publication.keywords.split(',').map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span>👁️</span>
                <span>0 views</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>⬇️</span>
                <span>0 downloads</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>💬</span>
                <span>0 citations</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/publications/${publication.id}/edit`}
                className="text-blue-900 hover:text-blue-700 font-medium text-sm"
              >
                Edit
              </Link>
              <Link
                href={`/publications/${publication.id}`}
                className="text-blue-900 hover:text-blue-700 font-medium text-sm"
              >
                View Details
              </Link>
              {publication.doi && (
                <a
                  href={`https://doi.org/${publication.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-900 hover:text-blue-700 font-medium text-sm"
                >
                  DOI
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PublicationsLoading() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="flex space-x-2 mb-4">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-18"></div>
          </div>
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <div className="flex space-x-6">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-18"></div>
            </div>
            <div className="flex space-x-3">
              <div className="h-4 bg-gray-200 rounded w-12"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PublicationsPage() {
  return (
    <div className="p-8 min-h-full">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Publications
            </h1>
            <p className="text-gray-600">
              Manage and view all your published academic work
            </p>
          </div>
          <Link
            href="/manuscripts/new"
            className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            <span className="mr-2">+</span>
            New Manuscript
          </Link>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-8 bg-gray-200 rounded mb-1 w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        }
      >
        <PublicationStats />
      </Suspense>

      <Suspense fallback={<PublicationsLoading />}>
        <PublicationsList />
      </Suspense>
    </div>
  );
}
