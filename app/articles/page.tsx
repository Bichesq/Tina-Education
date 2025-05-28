import RepositoryGrid from "../components/repository/RepositoryGrid";

export default function ArticlesPage() {
  return (
    <RepositoryGrid
      apiEndpoint="/api/repository/articles"
      title="Articles Repository"
      description="Discover our extensive collection of academic articles and research papers."
      emptyStateMessage="No articles found. Try adjusting your search criteria or check back later for new publications."
      emptyStateIcon="📄"
    />
  );
}
