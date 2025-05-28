import { notFound } from "next/navigation";
import { prisma } from "../../../prisma";
import Link from "next/link";
import { Pub_type } from "@prisma/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPublication(id: string) {
  try {
    const publication = await prisma.publication.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return publication;
  } catch (error) {
    console.error("Failed to fetch publication:", error);
    return null;
  }
}

function getPublicationTypeIcon(type: Pub_type): string {
  switch (type) {
    case "BOOK":
      return "📚";
    case "EBOOK":
      return "💻";
    case "AUDIOBOOK":
      return "🎧";
    case "JOURNAL":
      return "📰";
    case "ARTICLE":
      return "📄";
    default:
      return "📄";
  }
}

function getPublicationTypeColor(type: Pub_type): string {
  switch (type) {
    case "BOOK":
      return "bg-orange-100 text-orange-800";
    case "EBOOK":
      return "bg-blue-100 text-blue-800";
    case "AUDIOBOOK":
      return "bg-purple-100 text-purple-800";
    case "JOURNAL":
      return "bg-green-100 text-green-800";
    case "ARTICLE":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export default async function PublicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const publication = await getPublication(id);

  if (!publication) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto w-[90%] max-w-4xl py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-900">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/repository" className="hover:text-blue-900">Repository</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{publication.title}</li>
          </ol>
        </nav>

        {/* Publication Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">
                  {getPublicationTypeIcon(publication.type)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {publication.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-400">
                    <span>By {publication.user.name || "Unknown Author"}</span>
                    <span>•</span>
                    <span>{formatDate(publication.createdAt)}</span>
                  </div>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPublicationTypeColor(publication.type)}`}>
                {publication.type}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {publication.content && (
                <button className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium">
                  Download Publication
                </button>
              )}
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Share
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Cite
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Abstract */}
            {publication.abstract && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Abstract</h2>
                <p className="text-gray-700 leading-relaxed">
                  {publication.abstract}
                </p>
              </div>
            )}

            {/* Keywords */}
            {publication.keywords && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {publication.keywords.split(',').map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content Preview */}
            {publication.content && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Content Preview</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {publication.content.substring(0, 500)}
                    {publication.content.length > 500 && "..."}
                  </p>
                  {publication.content.length > 500 && (
                    <button className="mt-4 text-blue-900 font-medium hover:underline">
                      Download full content to read more
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Publication Info */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Publication Information</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-400">Author</dt>
                  <dd className="text-gray-900">{publication.user.name || "Unknown Author"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Publication Type</dt>
                  <dd className="text-gray-900">{publication.type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Published Date</dt>
                  <dd className="text-gray-900">{formatDate(publication.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Last Updated</dt>
                  <dd className="text-gray-900">{formatDate(publication.updatedAt)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/repository"
            className="inline-flex items-center px-4 py-2 text-blue-900 hover:text-blue-800 transition-colors"
          >
            ← Back to Repository
          </Link>
        </div>
      </div>
    </div>
  );
}
