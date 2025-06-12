"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { HiOutlineTrash, HiOutlineShoppingCart } from "react-icons/hi";
import { FaHeart } from "react-icons/fa";

interface WishlistItem {
  id: string;
  selectedType: string;
  createdAt: string;
  publication: {
    id: string;
    title: string;
    abstract?: string;
    cover?: string;
    user: {
      name: string;
    };
    genre?: {
      name: string;
    };
  };
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const response = await fetch("/api/wishlist");
        if (response.ok) {
          const data = await response.json();
          setWishlistItems(data.wishlistItems);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (publicationId: string, selectedType: string) => {
    try {
      const response = await fetch(
        `/api/wishlist?publicationId=${publicationId}&selectedType=${selectedType}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setWishlistItems(items =>
          items.filter(item => 
            !(item.publication.id === publicationId && item.selectedType === selectedType)
          )
        );
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "BOOK": return "Printed Copy";
      case "EBOOK": return "eBook";
      case "AUDIOBOOK": return "Audio book";
      case "JOURNAL": return "Journal";
      case "ARTICLE": return "Article";
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
          <span className="mx-2">/</span>
          <span>Wishlist</span>
        </nav>
      </div>

      {/* Wishlist Content */}
      <div className="px-10 py-10">
        <div className="flex items-center gap-3 mb-8">
          <FaHeart className="text-red-500 text-3xl" />
          <h1 className="text-3xl font-bold text-black">My Wishlist</h1>
          <span className="text-gray-600 text-xl">({wishlistItems.length} items)</span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-bold text-black mb-4">Your wishlist is empty</h2>
            <p className="text-gray-700 mb-8">Save books you're interested in for later!</p>
            <Link
              href="/books"
              className="px-8 py-3 text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#0c0a46" }}
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Book Cover */}
                <div className="w-full aspect-[3/4] mb-4">
                  {item.publication.cover ? (
                    <Image
                      src={item.publication.cover}
                      alt={item.publication.title}
                      width={200}
                      height={267}
                      className="w-full h-full object-cover border border-gray-300 rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Cover</span>
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-black line-clamp-2">
                    <Link 
                      href={`/repository/${item.publication.id}`} 
                      className="hover:underline"
                    >
                      {item.publication.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-700 text-sm">
                    By {item.publication.user.name}
                  </p>
                  
                  {item.publication.genre && (
                    <p className="text-gray-600 text-xs">
                      {item.publication.genre.name}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {getTypeLabel(item.selectedType)}
                    </span>
                  </div>

                  {item.publication.abstract && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {item.publication.abstract}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/repository/${item.publication.id}`}
                    className="flex-1 px-3 py-2 text-white text-sm text-center rounded hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#0c0a46" }}
                  >
                    <HiOutlineShoppingCart className="inline mr-1" />
                    View Details
                  </Link>
                  
                  <button
                    onClick={() => removeFromWishlist(item.publication.id, item.selectedType)}
                    className="px-3 py-2 text-red-500 border border-red-300 rounded hover:bg-red-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <HiOutlineTrash />
                  </button>
                </div>

                {/* Added Date */}
                <p className="text-xs text-gray-500 mt-2">
                  Added {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/books"
              className="text-blue-600 hover:underline text-lg"
            >
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
