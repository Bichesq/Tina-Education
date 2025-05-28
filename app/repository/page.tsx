import RepositoryGrid from "../components/repository/RepositoryGrid";

export default function RepositoryPage() {
  return (
    <RepositoryGrid
      apiEndpoint="/api/repository"
      title="Academic Repository"
      description="Explore our complete collection of academic publications including books, journals, and articles."
      emptyStateMessage="No publications found. Try adjusting your search criteria or check back later for new content."
      emptyStateIcon="📚"
    />
  );
}
