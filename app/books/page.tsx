import RepositoryGrid from "../components/repository/RepositoryGrid";

export default function BooksPage() {
  return (
    <RepositoryGrid
      apiEndpoint="/api/repository/books"
      title="Books Repository"
      description="Explore our collection of books, e-books, and audiobooks from various authors and disciplines."
      emptyStateMessage="No books found. Try adjusting your search criteria or check back later for new publications."
      emptyStateIcon="📚"
    />
  );
}
