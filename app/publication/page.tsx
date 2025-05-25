"use client";
import { useState } from "react";
import Link from "next/link";

type Publication = {
  id: string;
  title: string;
  type: "book" | "journal" | "article";
  status: "published" | "draft" | "under review" | "archived";
  date: string;
  views: number;
  downloads: number;
  coverImage?: string;
  lastEdited?: string;
  reviewsPending?: number;
};

export default function MyPublications() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const publications: Publication[] = [
    {
      id: "1",
      title: "Modern Teaching Methodologies",
      type: "book",
      status: "published",
      date: "Mar 15, 2025",
      views: 786,
      downloads: 245,
      coverImage: "/covers/teaching-methods.jpg",
    },
    {
      id: "2",
      title: "Digital Learning Platforms: A Comprehensive Guide",
      type: "journal",
      status: "under review",
      date: "Mar 10, 2025",
      views: 120,
      downloads: 45,
      coverImage: "/covers/digital-learning.jpg",
      reviewsPending: 2,
    },
    {
      id: "3",
      title: "Curriculum Development Strategies for the 21st Century",
      type: "article",
      status: "draft",
      date: "Mar 8, 2025",
      views: 0,
      downloads: 0,
      lastEdited: "2d ago",
    },
    {
      id: "4",
      title: "Assessment Techniques in Primary Education",
      type: "article",
      status: "published",
      date: "Feb 28, 2025",
      views: 458,
      downloads: 187,
      coverImage: "/covers/assessment.jpg",
    },
    {
      id: "5",
      title: "The Psychology of Learning",
      type: "book",
      status: "published",
      date: "Feb 15, 2025",
      views: 1024,
      downloads: 512,
      coverImage: "/covers/psychology-learning.jpg",
    },
    {
      id: "6",
      title: "Innovative Classroom Technologies",
      type: "journal",
      status: "archived",
      date: "Jan 30, 2025",
      views: 320,
      downloads: 98,
      coverImage: "/covers/classroom-tech.jpg",
    },
  ];

  const filteredPublications = publications.filter((pub) => {
    if (activeFilter === "all") return true;
    return pub.status === activeFilter;
  });

  const sortedPublications = [...filteredPublications].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "views") {
      return b.views - a.views;
    } else if (sortBy === "downloads") {
      return b.downloads - a.downloads;
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return { bg: "bg-green-100", text: "text-green-600" };
      case "draft":
        return { bg: "bg-amber-100", text: "text-amber-600" };
      case "under review":
        return { bg: "bg-blue-100", text: "text-blue-600" };
      case "archived":
        return { bg: "bg-gray-100", text: "text-gray-600" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600" };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "book":
        return "📘";
      case "journal":
        return "📖";
      case "article":
        return "📄";
      default:
        return "📑";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar - same as dashboard */}
      <div className="flex pt-20 min-h-screen">
        <aside className="fixed w-64 bg-white shadow-md h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="py-5">
            <ul>
              <li className="mb-1">
                <Link
                  href="/dashboard"
                  className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                >
                  <span className="mr-3 text-lg">📊</span>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  href="/publications"
                  className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900 bg-blue-50 text-blue-900 border-l-3 border-blue-900"
                >
                  <span className="mr-3 text-lg">📚</span>
                  <span>My Publications</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  href="/drafts"
                  className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                >
                  <span className="mr-3 text-lg">📝</span>
                  <span>Drafts</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  href="/review"
                  className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                >
                  <span className="mr-3 text-lg">📋</span>
                  <span>Reviews</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  href="/analytics"
                  className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                >
                  <span className="mr-3 text-lg">📈</span>
                  <span>Analytics</span>
                </Link>
              </li>
            </ul>

            <div className="mt-5 pt-5 border-t border-gray-200">
              <h3 className="px-5 mb-4 text-gray-500 text-sm uppercase">
                Collaboration
              </h3>
              <ul>
                <li className="mb-1">
                  <Link
                    href="/coauthors"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">👥</span>
                    <span>Co-authors</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/messages"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">💬</span>
                    <span>Messages</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/notifications"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">🔔</span>
                    <span>Notifications</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-200">
              <h3 className="px-5 mb-4 text-gray-500 text-sm uppercase">
                Resources
              </h3>
              <ul>
                <li className="mb-1">
                  <Link
                    href="/library"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">📕</span>
                    <span>My Library</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/tools"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">🧰</span>
                    <span>Writing Tools</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/calendar"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">📅</span>
                    <span>Calendar</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/settings"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">⚙️</span>
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-64 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              My Publications
            </h1>
            <div className="flex gap-4">
              <button className="px-5 py-2 bg-white text-blue-900 border border-blue-900 rounded">
                Import Content
              </button>
              <Link
                href="/manuscripts"
                className="px-5 py-2 bg-blue-900 text-white rounded"
              >
                Create New
              </Link>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl mb-4">
                📚
              </div>
              <h3 className="text-2xl text-gray-400 font-bold mb-1">
                {publications.length}
              </h3>
              <p className="text-gray-600 text-sm">Total Publications</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl mb-4">
                👁️
              </div>
              <h3 className="text-2xl text-gray-400 font-bold mb-1">
                {publications.reduce((sum, pub) => sum + pub.views, 0)}
              </h3>
              <p className="text-gray-600 text-sm">Total Views</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl mb-4">
                ⬇️
              </div>
              <h3 className="text-2xl text-gray-400 font-bold mb-1">
                {publications.reduce((sum, pub) => sum + pub.downloads, 0)}
              </h3>
              <p className="text-gray-600 text-sm">Total Downloads</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl mb-4">
                📝
              </div>
              <h3 className="text-2xl text-gray-400 font-bold mb-1">
                {
                  publications.filter((pub) => pub.status === "under review")
                    .length
                }
              </h3>
              <p className="text-gray-600 text-sm">Under Review</p>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="bg-white rounded-lg shadow-sm p-5 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeFilter === "all"
                      ? "bg-blue-900 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  All Publications
                </button>
                <button
                  onClick={() => setActiveFilter("published")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeFilter === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Published
                </button>
                <button
                  onClick={() => setActiveFilter("draft")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeFilter === "draft"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Drafts
                </button>
                <button
                  onClick={() => setActiveFilter("under review")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeFilter === "under review"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Under Review
                </button>
                <button
                  onClick={() => setActiveFilter("archived")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeFilter === "archived"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Archived
                </button>
              </div>

              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm text-gray-600">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                >
                  <option value="recent">Most Recent</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="views">Most Views</option>
                  <option value="downloads">Most Downloads</option>
                </select>
              </div>
            </div>
          </div>

          {/* Publications List */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {activeFilter === "all"
                  ? "All Publications"
                  : activeFilter.charAt(0).toUpperCase() +
                    activeFilter.slice(1)}{" "}
                ({filteredPublications.length})
              </h2>
            </div>

            {sortedPublications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-10 text-center">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No publications found
                </h3>
                <p className="text-gray-500 mb-4">
                  {activeFilter === "all"
                    ? "You haven't created any publications yet."
                    : `You don't have any ${activeFilter} publications.`}
                </p>
                <Link
                  href="/manuscripts"
                  className="inline-block px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                >
                  Create your first publication
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {sortedPublications.map((publication) => (
                  <div
                    key={publication.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row"
                  >
                    {publication.coverImage ? (
                      <div className="md:w-1/4 h-48 bg-gray-200 relative">
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              getStatusColor(publication.status).bg
                            } ${getStatusColor(publication.status).text}`}
                          >
                            {publication.status.charAt(0).toUpperCase() +
                              publication.status.slice(1)}
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-1 bg-black bg-opacity-50 text-white rounded text-xs">
                            {getTypeIcon(publication.type)} {publication.type}
                          </span>
                        </div>
                        {/* In a real app, you would use next/image */}
                        <img
                          src={publication.coverImage}
                          alt={publication.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="md:w-1/4 h-48 bg-gray-100 flex items-center justify-center relative">
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              getStatusColor(publication.status).bg
                            } ${getStatusColor(publication.status).text}`}
                          >
                            {publication.status.charAt(0).toUpperCase() +
                              publication.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-5xl text-gray-400">
                          {getTypeIcon(publication.type)}
                        </div>
                      </div>
                    )}

                    <div className="md:w-3/4 p-5 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-2">
                          {publication.title}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                          <span>
                            <span className="font-medium">Created:</span>{" "}
                            {publication.date}
                          </span>
                          {publication.lastEdited && (
                            <span>
                              <span className="font-medium">Last edited:</span>{" "}
                              {publication.lastEdited}
                            </span>
                          )}
                          {publication.views > 0 && (
                            <span>
                              <span className="font-medium">Views:</span>{" "}
                              {publication.views.toLocaleString()}
                            </span>
                          )}
                          {publication.downloads > 0 && (
                            <span>
                              <span className="font-medium">Downloads:</span>{" "}
                              {publication.downloads.toLocaleString()}
                            </span>
                          )}
                          {publication.reviewsPending && (
                            <span>
                              <span className="font-medium">
                                Reviews pending:
                              </span>{" "}
                              {publication.reviewsPending}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                        {publication.status === "published" && (
                          <>
                            <Link
                              href={`/publications/${publication.id}/edit`}
                              className="px-4 py-2 bg-white text-blue-900 border border-blue-900 rounded text-sm font-medium hover:bg-blue-50"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/publications/${publication.id}`}
                              className="px-4 py-2 bg-white text-blue-900 border border-blue-900 rounded text-sm font-medium hover:bg-blue-50"
                            >
                              View
                            </Link>
                            <Link
                              href={`/analytics/${publication.id}`}
                              className="px-4 py-2 bg-white text-blue-900 border border-blue-900 rounded text-sm font-medium hover:bg-blue-50"
                            >
                              View Stats
                            </Link>
                            <button className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100">
                              Share
                            </button>
                          </>
                        )}

                        {publication.status === "draft" && (
                          <>
                            <Link
                              href={`/drafts/${publication.id}`}
                              className="px-4 py-2 bg-blue-900 text-white rounded text-sm font-medium hover:bg-blue-800"
                            >
                              Continue Editing
                            </Link>
                            <button className="px-4 py-2 bg-white text-blue-900 border border-blue-900 rounded text-sm font-medium hover:bg-blue-50">
                              Preview
                            </button>
                            <button className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100">
                              Submit for Review
                            </button>
                          </>
                        )}

                        {publication.status === "under review" && (
                          <>
                            <Link
                              href={`/review/${publication.id}`}
                              className="px-4 py-2 bg-blue-900 text-white rounded text-sm font-medium hover:bg-blue-800"
                            >
                              Check Status
                            </Link>
                            <button className="px-4 py-2 bg-white text-blue-900 border border-blue-900 rounded text-sm font-medium hover:bg-blue-50">
                              View Comments
                            </button>
                            <button className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100">
                              Withdraw Submission
                            </button>
                          </>
                        )}

                        {publication.status === "archived" && (
                          <>
                            <button className="px-4 py-2 bg-blue-900 text-white rounded text-sm font-medium hover:bg-blue-800">
                              Restore
                            </button>
                            <button className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded text-sm font-medium hover:bg-red-50">
                              Delete Permanently
                            </button>
                          </>
                        )}

                        <div className="ml-auto">
                          <button className="p-2 text-gray-500 hover:text-gray-700">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination - would be dynamic in a real app */}
          {sortedPublications.length > 0 && (
            <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-5">
              <div className="text-sm text-gray-600">
                Showing 1 to {sortedPublications.length} of{" "}
                {sortedPublications.length} entries
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded text-sm font-medium hover:bg-gray-200 disabled:opacity-50">
                  Previous
                </button>
                <button className="px-4 py-2 bg-blue-900 text-white rounded text-sm font-medium hover:bg-blue-800">
                  1
                </button>
                <button className="px-4 py-2 bg-white text-blue-900 border border-blue-900 rounded text-sm font-medium hover:bg-blue-50">
                  2
                </button>
                <button className="px-4 py-2 bg-white text-blue-900 border border-blue-900 rounded text-sm font-medium hover:bg-blue-50">
                  3
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded text-sm font-medium hover:bg-gray-200">
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
