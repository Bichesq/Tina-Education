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
      return "bg-blue-100 text-blue-800";
    case "EBOOK":
      return "bg-blue-100 text-blue-800";
    case "AUDIOBOOK":
      return "bg-gray-100 text-gray-800";
    case "JOURNAL":
      return "bg-blue-100 text-blue-800";
    case "ARTICLE":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getGradientBackground(type: Pub_type): string {
  switch (type) {
    case "BOOK":
      return "from-blue-500 to-blue-700";
    case "EBOOK":
      return "from-blue-600 to-blue-800";
    case "AUDIOBOOK":
      return "from-gray-600 to-gray-800";
    case "JOURNAL":
      return "from-blue-600 to-blue-800";
    case "ARTICLE":
      return "from-gray-600 to-gray-800";
    default:
      return "from-gray-500 to-gray-700";
  }
}

export default function RepositoryCard({ publication }: RepositoryCardProps) {
  const gradientClass = getGradientBackground(publication.type);

  return (
    <Link href={`/repository/${publication.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        {/* Cover Image - Book-like aspect ratio */}
        <div
          className={`aspect-[3/4] bg-gradient-to-br ${gradientClass} relative`}
        >
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
        </div>

        {/* Content - Similar to book card layout */}
        <div className="p-4 space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-900 transition-colors">
            {publication.title}
          </h3>

          {/* Author */}
          <p className="text-blue-600 text-sm font-medium">
            {publication.user.name || "Unknown Author"}
          </p>

          {/* Price/Status - Using publication date as a substitute */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Free</span>
            
          </div>

          {/* Format */}
          <div className="flex items-center justify-between text-sm">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getPublicationTypeColor(publication.type)}`}
            >
              {publication.type === "EBOOK"
                ? "Digital"
                : publication.type.charAt(0) +
                  publication.type.slice(1).toLowerCase()}
            </span>

            {publication.content && (
              <span className="text-blue-600 text-xs">+1 other format</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
