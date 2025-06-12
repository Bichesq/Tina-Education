"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const publicationTypes = [
  { value: "BOOK", label: "Book", icon: "📚" },
  { value: "EBOOK", label: "eBook", icon: "💻" },
  { value: "AUDIOBOOK", label: "Audiobook", icon: "🎧" },
  { value: "JOURNAL", label: "Journal", icon: "📰" },
  { value: "ARTICLE", label: "Article", icon: "📄" },
];

export default function NewPublicationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [genres, setGenres] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    type: "BOOK",
    genreId: "",
    cover: "",
  });

  // Fetch genres on component mount
  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch("/api/genres");
        if (response.ok) {
          const data = await response.json();
          setGenres(data.genres || []);
        }
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    }
    fetchGenres();
  }, []);

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign in required
          </h2>
          <p className="text-gray-600 mb-8">
            You need to be signed in to add publications to your library.
          </p>
          <Link
            href="/auth/signin?callbackUrl=/publications/new"
            className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/publications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          genreId: formData.genreId || null,
        }),
      });

      if (response.ok) {
        router.push("/dashboard/publications");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to create publication");
      }
    } catch (error) {
      console.error("Failed to create publication:", error);
      alert("Failed to create publication. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard/publications"
              className="text-blue-900 hover:text-blue-700 font-medium"
            >
              ← Back to Publications
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Publication
          </h1>
          <p className="text-gray-600">
            Add an already published work to your library
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                placeholder="Enter the publication title"
              />
            </div>

            {/* Publication Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Publication Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {publicationTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.type === type.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-2">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Genre */}
            <div>
              <label htmlFor="genreId" className="block text-sm font-medium text-gray-700 mb-2">
                Genre (Optional)
              </label>
              <select
                id="genreId"
                name="genreId"
                value={formData.genreId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              >
                <option value="">Select a genre</option>
                {genres.map((genre: any) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.parent ? `${genre.parent.name} > ` : ""}{genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Abstract */}
            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
                Abstract/Description
              </label>
              <textarea
                id="abstract"
                name="abstract"
                rows={4}
                value={formData.abstract}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                placeholder="Brief description or abstract of the publication"
              />
            </div>

            {/* Keywords */}
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                placeholder="Enter keywords separated by commas"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple keywords with commas
              </p>
            </div>

            {/* Cover Image URL */}
            <div>
              <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL (Optional)
              </label>
              <input
                type="url"
                id="cover"
                name="cover"
                value={formData.cover}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                placeholder="https://example.com/cover-image.jpg"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/dashboard/publications"
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
                className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Adding..." : "Add Publication"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
