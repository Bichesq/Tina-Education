"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pub_type } from "@prisma/client";

interface Publication {
  id: string;
  title: string;
  abstract: string | null;
  cover: string | null;
  type: Pub_type;
  createdAt: Date;
  user: {
    name: string | null;
  };
}

interface PublicationCarouselProps {
  title: string;
  type: "books" | "journals" | "articles";
  publications: Publication[];
}

// Removed unused function getPublicationTypeColor

function getPublicationTypeIcon(type: Pub_type): string {
  switch (type) {
    case "BOOK":
      return "📚";
    case "EBOOK":
      return "📱";
    case "AUDIOBOOK":
      return "🎧";
    case "JOURNAL":
      return "📄";
    case "ARTICLE":
      return "📝";
    default:
      return "📄";
  }
}

function getGradientColor(type: "books" | "journals" | "articles"): string {
  switch (type) {
    case "books":
      return "from-blue-500 to-blue-700";
    case "journals":
      return "from-green-500 to-green-700";
    case "articles":
      return "from-purple-500 to-purple-700";
    default:
      return "from-gray-500 to-gray-700";
  }
}

export default function PublicationCarousel({ title, type, publications }: PublicationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || publications.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 >= publications.length ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, publications.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= publications.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? publications.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (publications.length === 0) {
    return (
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-400">No publications available</p>
        </div>
      </div>
    );
  }

  // Show up to 6 publications at a time
  const visiblePublications = publications.slice(0, 6);
  const gradientClass = getGradientColor(type);

  return (
    <div
      className="mb-16"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <Link
          href={`/${type}`}
          className="text-blue-900 hover:text-blue-700 font-medium text-sm"
        >
          View All →
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {visiblePublications.map((publication) => (
            <div key={publication.id} className="w-full flex-shrink-0">
              <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 mx-2">
                {/* Left side - Cover Image */}
                <div className={`w-48 h-64 bg-gradient-to-br ${gradientClass} relative flex-shrink-0`}>
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

                {/* Right side - Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Quote/Review */}
                    <blockquote className="text-lg text-gray-700 italic mb-4 leading-relaxed">
                      &quot;{publication.abstract ?
                        publication.abstract.substring(0, 120) + "..." :
                        "Discover insights and knowledge that will enhance your understanding and perspective."
                      }&quot;
                    </blockquote>

                    {/* Author */}
                    <p className="text-gray-400 mb-4">
                      {publication.user.name || "Unknown Author"}
                    </p>

                    {/* Title */}
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      {publication.title}
                    </h4>

                    {/* Subtitle/Author again */}
                    <p className="text-gray-400 mb-6">
                      {publication.user.name || "Unknown Author"}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div>
                    <Link
                      href={`/repository/${publication.id}`}
                      className="inline-block px-6 py-3 bg-gray-600 text-white font-medium rounded hover:bg-gray-700 transition-colors"
                    >
                      READ NOW
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {visiblePublications.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {visiblePublications.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {visiblePublications.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
