import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { Suspense } from "react";
import Link from "next/link";

async function LibraryContent() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">Please log in to view your library.</p>
      </div>
    );
  }

  // Get user's publications and manuscripts
  const [publications, manuscripts] = await Promise.all([
    prisma.publication.findMany({
      where: { author_id: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.manuscript.findMany({
      where: {
        author_id: session.user.id,
        status: "ACCEPTED",
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const allItems = [
    ...publications.map((p) => ({ ...p, itemType: "publication" })),
    ...manuscripts.map((m) => ({ ...m, itemType: "manuscript" })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (allItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📕</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Your Library is Empty
        </h3>
        <p className="text-gray-500 mb-6">
          Published works and accepted manuscripts will appear here.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/publications/new"
            className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Add Publication
          </Link>
          <Link
            href="/manuscripts/new"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Create Manuscript
          </Link>
        </div>
      </div>
    );
  }

  function getTypeInfo(type: string) {
    switch (type) {
      case "JOURNAL":
        return {
          icon: "📄",
          label: "Journal Article",
          color: "bg-blue-50 text-blue-700",
        };
      case "ARTICLE":
        return {
          icon: "📝",
          label: "Article",
          color: "bg-green-50 text-green-700",
        };
      case "BOOK":
        return {
          icon: "📚",
          label: "Book",
          color: "bg-purple-50 text-purple-700",
        };
      case "EBOOK":
        return {
          icon: "💻",
          label: "E-book",
          color: "bg-orange-50 text-orange-700",
        };
      case "AUDIOBOOK":
        return {
          icon: "🎧",
          label: "Audiobook",
          color: "bg-indigo-50 text-indigo-700",
        };
      default:
        return {
          icon: "📄",
          label: "Document",
          color: "bg-gray-50 text-gray-700",
        };
    }
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  // Group items by type (for future filtering functionality)
  // const groupedItems = allItems.reduce((acc, item) => {
  //   const type = item.itemType;
  //   if (!acc[type]) {
  //     acc[type] = [];
  //   }
  //   acc[type].push(item);
  //   return acc;
  // }, {} as Record<string, Array<typeof allItems[0]>>);

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Publications</p>
              <p className="text-2xl font-bold text-gray-900">
                {publications.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Accepted Manuscripts
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {manuscripts.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-800">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {allItems.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 text-purple-800">
              <span className="text-2xl">📖</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
            All Items
          </button>
          <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Publications
          </button>
          <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Manuscripts
          </button>
        </nav>
      </div>

      {/* Library Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allItems.map((item) => {
          const typeInfo = getTypeInfo(item.type);
          const isPublication = item.itemType === "publication";

          return (
            <div
              key={`${item.itemType}-${item.id}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}
                >
                  {typeInfo.icon} {typeInfo.label}
                </span>
                <span className="text-xs text-gray-500">
                  {isPublication ? "Published" : "Accepted"}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>

              {item.abstract && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.abstract}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{formatDate(item.createdAt)}</span>
                <div className="flex space-x-2">
                  <Link
                    href={
                      isPublication
                        ? `/publications/${item.id}`
                        : `/manuscripts/${item.id}`
                    }
                    className="text-blue-900 hover:text-blue-700 font-medium"
                  >
                    View
                  </Link>
                  {isPublication && "cover" in item && item.cover && (
                    <button className="text-blue-900 hover:text-blue-700 font-medium">
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/publications/new"
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <span className="text-2xl mr-3">➕</span>
            <div>
              <p className="font-medium text-gray-900">Add Publication</p>
              <p className="text-sm text-gray-500">
                Upload a new published work
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/manuscripts"
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <span className="text-2xl mr-3">📝</span>
            <div>
              <p className="font-medium text-gray-900">View Manuscripts</p>
              <p className="text-sm text-gray-500">Check manuscript status</p>
            </div>
          </Link>

          <button className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
            <span className="text-2xl mr-3">📊</span>
            <div>
              <p className="font-medium text-gray-900">Export Library</p>
              <p className="text-sm text-gray-500">Download bibliography</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function LibraryLoading() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-16 bg-gray-200 rounded w-full mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <div className="p-8 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
        <p className="text-gray-600">
          Your collection of published works and accepted manuscripts
        </p>
      </div>

      <Suspense fallback={<LibraryLoading />}>
        <LibraryContent />
      </Suspense>
    </div>
  );
}
