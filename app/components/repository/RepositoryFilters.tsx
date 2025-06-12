"use client";

import { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

interface Filters {
  search: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  genre?: string;
}

interface RepositoryFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  loading: boolean;
}

export default function RepositoryFilters({
  filters,
  onFilterChange,
  loading
}: RepositoryFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchInput });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    onFilterChange({ sortBy, sortOrder });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFilterChange({
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      genre: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search publications, authors, keywords..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500"
            disabled={loading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              type="submit"
              disabled={loading}
              className="mr-3 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaFilter className="h-4 w-4 " />
            <span>Filters</span>
          </button>

          {(filters.search ||
            filters.sortBy !== "createdAt" ||
            filters.sortOrder !== "desc") && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-400 hover:text-gray-800 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Quick Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-");
              handleSortChange(sortBy, sortOrder);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            disabled={loading}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Field
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  handleSortChange(e.target.value, filters.sortOrder)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                disabled={loading}
              >
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Date Updated</option>
                <option value="title">Title</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleSortChange(filters.sortBy, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                disabled={loading}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.search ||
        filters.sortBy !== "createdAt" ||
        filters.sortOrder !== "desc") && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-400">Active filters:</span>

            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Search: &quot;{filters.search}&quot;
                <button
                  onClick={() => {
                    setSearchInput("");
                    onFilterChange({ search: "" });
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}

            {(filters.sortBy !== "createdAt" ||
              filters.sortOrder !== "desc") && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                Sort: {filters.sortBy} ({filters.sortOrder})
                <button
                  onClick={() => handleSortChange("createdAt", "desc")}
                  className="ml-2 text-gray-400 hover:text-gray-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
