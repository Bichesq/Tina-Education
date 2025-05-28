import RepositoryGrid from "../components/repository/RepositoryGrid";

export default function JournalsPage() {
  return (
    <RepositoryGrid
      apiEndpoint="/api/repository/journals"
      title="Journals Repository"
      description="Browse our comprehensive collection of academic journals and research publications."
      emptyStateMessage="No journals found. Try adjusting your search criteria or check back later for new publications."
      emptyStateIcon="📰"
    />
  );
}
