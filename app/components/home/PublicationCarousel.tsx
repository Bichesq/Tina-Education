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
      return "from-blue-600 to-blue-800";
    case "articles":
      return "from-gray-600 to-gray-800";
    default:
      return "from-gray-500 to-gray-700";
  }
}

export default function PublicationCarousel({
  title,
  type,
  publications,
}: PublicationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(3); // Start at 3 to show first real item (after 3 clones)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Show up to 6 publications at a time
  const visiblePublications = publications.slice(0, 6);
  const totalSlides = visiblePublications.length;

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || totalSlides === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    if (totalSlides <= 1) return;

    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    if (totalSlides <= 1) return;

    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index + 3); // Add 3 because we start at index 3 (after clones)
  };

  // Handle infinite scroll transitions
  useEffect(() => {
    if (totalSlides <= 1) return;

    if (currentIndex <= 2) {
      // If we're in the first 3 clones, jump to the corresponding real items at the end
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(totalSlides + currentIndex);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    } else if (currentIndex >= totalSlides + 3) {
      // If we're in the last 3 clones, jump to the corresponding real items at the beginning
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex - totalSlides);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
  }, [currentIndex, totalSlides]);

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

  const gradientClass = getGradientColor(type);

  // Create extended array for infinite scroll - add enough clones for seamless circular view
  const extendedPublications =
    totalSlides > 0
      ? [
          // Add clones at the beginning (last 3 items)
          visiblePublications[totalSlides - 3] || visiblePublications[0],
          visiblePublications[totalSlides - 2] || visiblePublications[0],
          visiblePublications[totalSlides - 1],
          // Original items
          ...visiblePublications,
          // Add clones at the end (first 3 items)
          visiblePublications[0],
          visiblePublications[1] || visiblePublications[0],
          visiblePublications[2] || visiblePublications[0],
        ]
      : [];

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
          className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
          style={{
            transform: `translateX(-${currentIndex * (100 / 3)}%)`,
          }}
        >
          {extendedPublications.map((publication, index) => {
            // Determine if this is the active (center) card
            const isActive = index === currentIndex;
            return (
              <div
                key={`${publication.id}-${index}`}
                className="w-1/3 flex-shrink-0 px-2"
              >
                <div
                  className={`flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 h-72 ${
                    isActive
                      ? "scale-105 z-10 shadow-lg"
                      : "scale-95 opacity-75"
                  }`}
                >
                  {/* Left side - Cover Image */}
                  <div
                    className={`w-48 h-full bg-gradient-to-br ${gradientClass} relative flex-shrink-0`}
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
                        <span className="text-4xl text-white opacity-80">
                          {getPublicationTypeIcon(publication.type)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right side - Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      {/* Quote/Abstract */}
                      <blockquote className="text-sm text-gray-700 italic mb-3 leading-relaxed line-clamp-3">
                        &quot;
                        {publication.abstract
                          ? publication.abstract.substring(0, 100) + "..."
                          : "Gives us hope, humour and guidance at a time when all are in short supply"}
                        &quot;
                      </blockquote>

                      {/* Author */}
                      <p className="text-gray-400 text-sm mb-3">
                        {publication.user.name || "Timothy Snyder"}
                      </p>

                      {/* Title */}
                      <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {publication.title}
                      </h4>

                      {/* Subtitle/Author again */}
                      <p className="text-gray-400 text-sm mb-4">
                        {publication.user.name || "Rutger Bregman"}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div>
                      <Link
                        href={`/repository/${publication.id}`}
                        className="inline-block px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        READ NOW
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {visiblePublications.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator - Now positioned below the carousel */}
      {visiblePublications.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {visiblePublications.map((_, index) => {
            // Calculate which real item is currently active (subtract 3 for the clones at beginning)
            const activeRealIndex = (currentIndex - 3) % totalSlides;
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === activeRealIndex
                    ? "bg-gray-900"
                    : "bg-gray-600 bg-opacity-50"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
