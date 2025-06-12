import Link from "next/link";

interface Genre {
  id: string;
  name: string;
  slug: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
    parent?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

interface GenreBreadcrumbProps {
  genre?: Genre;
  publicationTitle?: string;
  className?: string;
}

export default function GenreBreadcrumb({ 
  genre, 
  publicationTitle, 
  className = "" 
}: GenreBreadcrumbProps) {
  // Build breadcrumb path
  const breadcrumbItems = [];
  
  // Always start with Home
  breadcrumbItems.push({
    label: "Home",
    href: "/",
    isLast: false
  });
  
  if (genre) {
    // Build genre hierarchy from root to current
    const genreHierarchy = [];
    let currentGenre: Genre | undefined = genre;
    
    // Build hierarchy array (from current to root)
    while (currentGenre) {
      genreHierarchy.unshift(currentGenre);
      currentGenre = currentGenre.parent;
    }
    
    // Add each genre level to breadcrumb
    genreHierarchy.forEach((g, index) => {
      const isParentGenre = !g.parent;
      const href = isParentGenre 
        ? `/books?genre=${g.slug}` 
        : `/books?genre=${g.slug}`;
        
      breadcrumbItems.push({
        label: g.name,
        href,
        isLast: false
      });
    });
  }
  
  // Add publication title if provided
  if (publicationTitle) {
    breadcrumbItems.push({
      label: publicationTitle,
      href: "#",
      isLast: true
    });
  }
  
  // Mark the last item
  if (breadcrumbItems.length > 0) {
    breadcrumbItems[breadcrumbItems.length - 1].isLast = true;
  }
  
  return (
    <nav className={`mb-8 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {item.isLast ? (
              <span className="text-gray-900 font-medium line-clamp-1">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href} 
                className="hover:text-blue-900 transition-colors truncate"
                title={item.label}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Helper component for genre-only breadcrumbs (for category pages)
interface GenreOnlyBreadcrumbProps {
  parentGenre?: {
    name: string;
    slug: string;
  };
  currentGenre?: {
    name: string;
    slug: string;
  };
  className?: string;
}

export function GenreOnlyBreadcrumb({ 
  parentGenre, 
  currentGenre, 
  className = "" 
}: GenreOnlyBreadcrumbProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/", isLast: false }
  ];
  
  if (parentGenre) {
    breadcrumbItems.push({
      label: parentGenre.name,
      href: `/books?genre=${parentGenre.slug}`,
      isLast: false
    });
  }
  
  if (currentGenre) {
    breadcrumbItems.push({
      label: currentGenre.name,
      href: `/books?genre=${currentGenre.slug}`,
      isLast: true
    });
  }
  
  return (
    <nav className={`mb-6 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {item.isLast ? (
              <span className="text-gray-900 font-medium">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href} 
                className="hover:text-blue-900 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
