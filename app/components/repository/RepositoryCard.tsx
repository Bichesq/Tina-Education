import Link from "next/link";
import Image from "next/image";
import { Pub_type } from "@prisma/client";

interface Publication {
  id: string;
  title: string;
  abstract: string | null;
  content: string | null;
  keywords: string | null;
  cover: string | null;
  type: Pub_type;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface RepositoryCardProps {
  publication: Publication;
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

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export default function RepositoryCard({ publication }: RepositoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Cover Image or Placeholder */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 relative">
        {publication.cover ? (
          <Image
            src={publication.cover}
            alt={publication.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl text-white opacity-80">
              {getPublicationTypeIcon(publication.type)}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPublicationTypeColor(publication.type)}`}>
            {publication.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {publication.title}
        </h3>

        <div className="flex items-center text-sm text-gray-400 mb-3">
          <span>By {publication.user.name || "Unknown Author"}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(publication.createdAt)}</span>
        </div>

        {publication.abstract && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {truncateText(publication.abstract, 150)}
          </p>
        )}

        {publication.keywords && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {publication.keywords.split(',').slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-400 text-xs rounded-full"
                >
                  {keyword.trim()}
                </span>
              ))}
              {publication.keywords.split(',').length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-400 text-xs rounded-full">
                  +{publication.keywords.split(',').length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            href={`/repository/${publication.id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
          >
            View Details
          </Link>

          {publication.content && (
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
