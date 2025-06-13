"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import { HiOutlineHeart } from "react-icons/hi";
import { FaHeart } from "react-icons/fa";
import QuantityCounter from "../../components/quantitycounter";
import AuthRequiredButton from "../../components/AuthRequiredButton";
import AuthRequiredLink from "../../components/AuthRequiredLink";

// Sample related books data
const relatedBooks = [
  {
    id: "1",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: "3000frs",
    type: "Hardback",
    cover: "/images/book-placeholder.jpg",
  },
  {
    id: "2",
    title: "Gone Girl",
    author: "Gillian Flynn",
    price: "2500frs",
    type: "Paperback",
    cover: "/images/book-placeholder.jpg",
  },
  {
    id: "3",
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    price: "3500frs",
    type: "eBook",
    cover: "/images/book-placeholder.jpg",
  },
  {
    id: "4",
    title: "Big Little Lies",
    author: "Liane Moriarty",
    price: "2800frs",
    type: "Audiobook",
    cover: "/images/book-placeholder.jpg",
  },
  {
    id: "5",
    title: "The Woman in the Window",
    author: "A.J. Finn",
    price: "3200frs",
    type: "Hardback",
    cover: "/images/book-placeholder.jpg",
  },
  {
    id: "6",
    title: "Sharp Objects",
    author: "Gillian Flynn",
    price: "2700frs",
    type: "Paperback",
    cover: "/images/book-placeholder.jpg",
  },
];

export default function PublicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [publication, setPublication] = useState<{
    id: string;
    title: string;
    abstract?: string;
    content?: string;
    cover?: string;
    type: string;
    user?: { name?: string };
    genre?: {
      name: string;
      slug: string;
      parent?: { name: string; slug: string };
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("BOOK"); // Default to printed copy
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    async function fetchPublication() {
      try {
        const response = await fetch(`/api/repository/publication/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPublication(data);
        }
      } catch (error) {
        console.error("Failed to fetch publication:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPublication();
  }, [id]);

  // Check wishlist status when publication or selectedType changes
  useEffect(() => {
    async function checkWishlistStatus() {
      if (!publication) return;

      try {
        const response = await fetch(
          `/api/wishlist/check?publicationId=${id}&selectedType=${selectedType}`
        );
        if (response.ok) {
          const data = await response.json();
          setIsInWishlist(data.isInWishlist);
        }
      } catch (error) {
        console.error("Failed to check wishlist status:", error);
      }
    }

    checkWishlistStatus();
  }, [id, selectedType, publication]);

  const handleWishlistToggle = async () => {
    if (wishlistLoading) return;

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(
          `/api/wishlist?publicationId=${id}&selectedType=${selectedType}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicationId: id,
            selectedType,
          }),
        });
        if (response.ok) {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Publication not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-18">
      {/* Sub-menu Section */}
      <div
        className="w-full h-18 flex items-center justify-center"
        style={{ backgroundColor: "#f0eded" }}
      >
        <nav className="flex space-x-8">
          <Link href="/books" className="text-black text-xl hover:underline">
            Books
          </Link>
          <Link href="/authors" className="text-black text-xl hover:underline">
            Authors
          </Link>
          <Link href="/journals" className="text-black text-xl hover:underline">
            Journals
          </Link>
        </nav>
      </div>

      {/* Breadcrumb Section */}
      <div className="px-10 py-4 border-b border-blue-500">
        <nav className="text-s text-black">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {publication.genre?.parent && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/books?genre=${publication.genre.parent.slug}`}
                className="hover:underline"
              >
                {publication.genre.parent.name}
              </Link>
            </>
          )}
          {publication.genre && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/books?genre=${publication.genre.slug}`}
                className="hover:underline"
              >
                {publication.genre.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span>{publication.title}</span>
        </nav>
      </div>

      {/* Book Details Section */}
      <div className="px-10 py-10">
        <div className="flex gap-8">
          {/* Left Column - Book Cover (2/5) */}
          <div className="w-2/5">
            <div className="w-full max-w-sm">
              {publication.cover ? (
                <Image
                  src={publication.cover}
                  alt={publication.title}
                  width={270}
                  height={380}
                  className="w-full h-auto border border-gray-300"
                />
              ) : (
                <div className="w-full aspect-[270/380] bg-gray-200 border border-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">
                    No Cover Available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Book Information (3/5) */}
          <div className="w-3/5">
            {/* Book Title */}
            <h1 className="text-2xl font-bold text-black mb-4">
              {publication.title}
            </h1>

            {/* Author Name */}
            <p className="text-xl text-black mb-6">
              By {publication.user?.name || "Unknown Author"}
            </p>

            {/* Separator Line */}
            <hr className="border-blue-500 mb-6" />

            {/* Book Type and Price Rectangles */}
            <div className="flex mt-20  gap-2.5 mb-35">
              <button
                onClick={() => setSelectedType("BOOK")}
                className={`w-30 h-16 border flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  selectedType === "BOOK"
                    ? "border-blue-500 bg-gray-400"
                    : "border-blue-300 bg-gray-300 hover:bg-gray-350"
                }`}
              >
                <div className="text-xs text-gray-800">Printed Copy</div>
                <div className="text-xs text-gray-800 font-bold">3000frs</div>
              </button>
              <button
                onClick={() => setSelectedType("EBOOK")}
                className={`w-30 h-16 border flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  selectedType === "EBOOK"
                    ? "border-blue-500 bg-gray-400"
                    : "border-blue-300 bg-gray-300 hover:bg-gray-350"
                }`}
              >
                <div className="text-xs text-gray-800">eBook</div>
                <div className="text-xs text-gray-800 font-bold">2500frs</div>
              </button>
              <button
                onClick={() => setSelectedType("AUDIOBOOK")}
                className={`w-30 h-16 border flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  selectedType === "AUDIOBOOK"
                    ? "border-blue-500 bg-gray-400"
                    : "border-blue-300 bg-gray-300 hover:bg-gray-350"
                }`}
              >
                <div className="text-xs text-gray-800">Audio book</div>
                <div className="text-xs text-gray-800 font-bold">3500frs</div>
              </button>
            </div>

            {/* Quantity Row */}
            <div className="flex items-center gap-4 mt-20 mb-16">
              <span className="text-xl text-black">Quantity:</span>
              <QuantityCounter />
              {/* Stock indicator - show for digital publications or when in stock */}
              {selectedType === "EBOOK" ||
              selectedType === "AUDIOBOOK" ||
              selectedType === "JOURNAL" ||
              selectedType === "ARTICLE" ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-xl text-black">Available</span>
                </>
              ) : (
                // For physical books, you could add stock logic here
                // For now, showing as available but this could be conditional based on actual stock
                <>
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-xl text-black">In stock</span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <AuthRequiredLink
                href="/cart"
                className="px-8 py-4 w-70 h-11 text-white justify-center flex items-center text-xl hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#0c0a46" }}
              >
                Add to Cart
              </AuthRequiredLink>
              <AuthRequiredButton
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`px-3 py-2 w-70 h-11 border border-blue-300 flex items-center justify-center gap-6 transition-colors ${
                  wishlistLoading
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                <span
                  className={`text-xl ${isInWishlist ? "text-red-500" : "text-gray-700"}`}
                >
                  {isInWishlist ? <FaHeart /> : <HiOutlineHeart />}
                </span>
                <span className="text-xl text-black">
                  {isInWishlist ? "Remove from wishlist" : "Add to wish list"}
                </span>
              </AuthRequiredButton>
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Section */}
      <div className="px-10 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Description Column */}
          <div className="pe-20">
            <h2 className="text-xl text-black font-bold mb-4">Description</h2>
            <p className="text-sm text-black leading-relaxed">
              {publication.abstract ||
                "A captivating mystery novel that will keep you on the edge of your seat. Follow the intricate plot as secrets unfold and characters navigate through unexpected twists and turns."}
            </p>
          </div>

          {/* Book Outline Column */}
          <div className="px-10">
            <h2 className="text-xl text-black font-bold mb-4">Book Outline</h2>
            <p className="text-sm text-black leading-relaxed">
              {publication.content
                ? publication.content.substring(0, 200) + "..."
                : "Chapter 1: The Beginning\nChapter 2: The Mystery Unfolds\nChapter 3: Clues and Revelations\nChapter 4: The Truth Emerges\nChapter 5: Resolution"}
            </p>
          </div>

          {/* Product Details Column */}
          <div className="ps-30">
            <h2 className="text-xl text-black font-bold mb-4">
              Product Details
            </h2>
            <div className="text-sm text-black space-y-2">
              <div className="flex justify-between">
                <span>Published:</span>
                <span>01 Feb 2024</span>
              </div>
              <div className="flex justify-between">
                <span>Genre:</span>
                <span>{publication.genre?.name || "Mystery"}</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span>{publication.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Edition:</span>
                <span>1st</span>
              </div>
              <div className="flex justify-between">
                <span>Extent:</span>
                <span>320</span>
              </div>
              <div className="flex justify-between">
                <span>ISBN:</span>
                <span>xxxxxxxxxxxxx</span>
              </div>
              <div className="flex justify-between">
                <span>Imprint:</span>
                <span>Tina Publishing</span>
              </div>
              <div className="flex justify-between">
                <span>Dimension:</span>
                <span>320x153</span>
              </div>
              <div className="flex justify-between">
                <span>Publisher:</span>
                <span>Tina Publishing</span>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-black mt-8" />
      </div>

      {/* About the Contributor Section */}
      <div className="px-10 py-8 text-center">
        <h2 className="text-2xl text-black font-bold mb-6">
          About the Contributor
        </h2>
        <div className="flex flex-col items-center">
          <div className="w-80 h-96 bg-gray-200 border border-gray-300 mb-4 flex items-center justify-center">
            <span className="text-gray-500">Contributor Image</span>
          </div>
          <h3 className="text-xl text-black font-semibold mb-4">
            {publication.user?.name || "Unknown Author"}
          </h3>
          <p className="text-md text-black max-w-2xl leading-relaxed">
            An accomplished author with years of experience in writing
            compelling narratives. Known for creating intricate plots and
            memorable characters that resonate with readers worldwide.
          </p>
        </div>
      </div>

      {/* Related Titles Section */}
      <div className="px-10 py-8">
        <h2 className="text-2xl text-black font-bold mb-6 text-left">
          Related Titles
        </h2>
        <div className="grid grid-cols-6 gap-4">
          {relatedBooks.map((book) => (
            <div key={book.id} className="flex flex-col">
              <div className="w-full aspect-[159/256] bg-gray-200 border border-gray-300 mb-2 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Book Cover</span>
              </div>
              <h3 className="text-md text-black font-bold mb-1 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-black mb-1">{book.author}</p>
              <p className="text-sm text-black font-bold mb-1">{book.price}</p>
              <p className="text-sm text-black">{book.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
