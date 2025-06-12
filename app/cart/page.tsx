"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { HiOutlineTrash, HiOutlineHeart } from "react-icons/hi";

// Sample cart items data - this would come from a cart context/state management
const initialCartItems = [
  {
    id: "1",
    publicationId: "pub1",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    type: "EBOOK",
    price: 2500,
    quantity: 1,
    cover: "/images/book-placeholder.jpg",
  },
  {
    id: "2",
    publicationId: "pub2",
    title: "Gone Girl",
    author: "Gillian Flynn",
    type: "BOOK",
    price: 3000,
    quantity: 2,
    cover: "/images/book-placeholder.jpg",
  },
  {
    id: "3",
    publicationId: "pub3",
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    type: "AUDIOBOOK",
    price: 3500,
    quantity: 1,
    cover: "/images/book-placeholder.jpg",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const moveToWishlist = (id: string) => {
    // Implementation for moving to wishlist
    removeItem(id);
    // Add to wishlist logic here
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "BOOK": return "Printed Copy";
      case "EBOOK": return "eBook";
      case "AUDIOBOOK": return "Audio book";
      default: return type;
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cartItems.some(item => item.type === "BOOK") ? 500 : 0; // Shipping only for physical books
  const total = subtotal + shipping;

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
          <span>Shopping Cart</span>
        </nav>
      </div>

      {/* Cart Content */}
      <div className="px-10 py-10">
        <h1 className="text-3xl font-bold text-black mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-black mb-4">Your cart is empty</h2>
            <p className="text-gray-700 mb-8">Add some books to get started!</p>
            <Link
              href="/books"
              className="px-8 py-3 text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#0c0a46" }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column (2/3) */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex gap-6">
                      {/* Book Cover */}
                      <div className="w-24 h-36 flex-shrink-0">
                        {item.cover ? (
                          <Image
                            src={item.cover}
                            alt={item.title}
                            width={96}
                            height={144}
                            className="w-full h-full object-cover border border-gray-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 border border-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No Cover</span>
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-black mb-1">
                              <Link href={`/repository/${item.publicationId}`} className="hover:underline">
                                {item.title}
                              </Link>
                            </h3>
                            <p className="text-gray-700 mb-2">By {item.author}</p>
                            <p className="text-sm text-gray-600">{getTypeLabel(item.type)}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <HiOutlineTrash size={20} />
                          </button>
                        </div>

                        {/* Quantity and Price Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-700">Quantity:</span>
                            <div className="flex items-center bg-gray-300 border border-blue-300">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-6 flex items-center justify-center border-r border-blue-300 text-gray-800 hover:bg-gray-400"
                              >
                                -
                              </button>
                              <div className="w-10 h-6 text-sm flex items-center justify-center border-r border-blue-300 text-gray-800">
                                {item.quantity}
                              </div>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-6 text-sm flex items-center justify-center text-gray-800 hover:bg-gray-400"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => moveToWishlist(item.id)}
                              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              <HiOutlineHeart size={16} />
                              <span className="text-sm">Move to Wishlist</span>
                            </button>
                            <div className="text-right">
                              <p className="text-lg font-bold text-black">
                                {(item.price * item.quantity).toLocaleString()}frs
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-gray-600">
                                  {item.price.toLocaleString()}frs each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-8">
                <Link
                  href="/books"
                  className="text-blue-600 hover:underline text-lg"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary - Right Column (1/3) */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>{subtotal.toLocaleString()}frs</span>
                  </div>
                  
                  {shipping > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span>{shipping.toLocaleString()}frs</span>
                    </div>
                  )}
                  
                  <hr className="border-gray-300" />
                  
                  <div className="flex justify-between text-lg font-bold text-black">
                    <span>Total</span>
                    <span>{total.toLocaleString()}frs</span>
                  </div>
                </div>

                <button
                  className="w-full py-3 text-white text-lg font-medium rounded-lg hover:opacity-90 transition-opacity mb-4"
                  style={{ backgroundColor: "#0c0a46" }}
                >
                  Proceed to Checkout
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Secure checkout with</p>
                  <div className="flex justify-center gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">SSL</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">256-bit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
