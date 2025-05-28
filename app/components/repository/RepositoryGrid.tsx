"use client";

import { useState, useEffect, useCallback } from "react";
import RepositoryCard from "./RepositoryCard";
import RepositoryFilters from "./RepositoryFilters";
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

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

interface RepositoryGridProps {
  apiEndpoint: string;
  title: string;
  description: string;
  emptyStateMessage: string;
  emptyStateIcon: string;
}

export default function RepositoryGrid({
  apiEndpoint,
  title,
  description,
  emptyStateMessage,
  emptyStateIcon
}: RepositoryGridProps) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1
  });

  const fetchPublications = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: filters.page.toString(),
        limit: "12"
      });

      const response = await fetch(`${apiEndpoint}?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch publications");
      }

      const data = await response.json();
      const publicationsKey = apiEndpoint.includes('books') ? 'books' :
                             apiEndpoint.includes('journals') ? 'journals' :
                             apiEndpoint.includes('articles') ? 'articles' : 'publications';

      setPublications(data[publicationsKey] || []);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPublications([]);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, filters]);

  useEffect(() => {
    fetchPublications();
  }, [filters, fetchPublications]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && publications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto w-[90%] max-w-7xl py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading publications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto w-[90%] max-w-7xl py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-xl text-gray-400">{description}</p>
          {pagination && (
            <p className="text-sm text-gray-400 mt-2">
              Showing {pagination.totalCount} {pagination.totalCount === 1 ? 'publication' : 'publications'}
            </p>
          )}
        </div>

        {/* Filters */}
        <RepositoryFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Publications</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchPublications}
              className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && publications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{emptyStateIcon}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Publications Found</h3>
            <p className="text-gray-400">{emptyStateMessage}</p>
          </div>
        )}

        {/* Publications Grid */}
        {!error && publications.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {publications.map((publication) => (
                <RepositoryCard key={publication.id} publication={publication} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-lg ${
                      page === pagination.currentPage
                        ? "bg-blue-900 text-white border-blue-900"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
