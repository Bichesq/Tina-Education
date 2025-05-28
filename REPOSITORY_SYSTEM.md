# Repository System Documentation

## Overview

The Tina Education Repository System is a comprehensive digital library that allows users to browse, search, and access academic publications including books, journals, and articles. The system provides a clean, modern interface with advanced filtering and search capabilities.

## Features

### 📚 Publication Types
- **Books**: Physical books and printed publications
- **E-books**: Digital books and electronic publications
- **Audiobooks**: Audio format publications
- **Journals**: Academic journals and research publications
- **Articles**: Research articles and papers

### 🔍 Search & Filter
- Full-text search across titles, abstracts, keywords, and authors
- Advanced filtering options
- Sort by date, title, or relevance
- Pagination for large result sets

### 🎨 User Interface
- Responsive design that works on all devices
- Clean, modern card-based layout
- Consistent with existing site design
- Accessible navigation and controls

## Navigation Structure

### Main Menu
- **Books** (`/books`) - Browse all books, e-books, and audiobooks
- **Journals** (`/journals`) - Browse academic journals
- **Articles** (`/articles`) - Browse research articles

### Dashboard Integration
The repository is integrated into the dashboard sidebar with quick access links:
- All Publications
- Books
- Journals
- Articles

## API Endpoints

### Repository APIs
- `GET /api/repository` - Get all publications with filtering
- `GET /api/repository/books` - Get books, e-books, and audiobooks
- `GET /api/repository/journals` - Get journals
- `GET /api/repository/articles` - Get articles

### Query Parameters
- `search` - Search term for titles, abstracts, keywords, authors
- `page` - Page number for pagination (default: 1)
- `limit` - Number of results per page (default: 12)
- `sortBy` - Sort field: createdAt, updatedAt, title (default: createdAt)
- `sortOrder` - Sort order: asc, desc (default: desc)

### Response Format
```json
{
  "publications": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 50,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 12
  }
}
```

## Components

### RepositoryGrid
Main component that handles the display of publications with filtering and pagination.

**Props:**
- `apiEndpoint` - API endpoint to fetch data from
- `title` - Page title
- `description` - Page description
- `emptyStateMessage` - Message when no results found
- `emptyStateIcon` - Icon for empty state

### RepositoryCard
Individual publication card component.

**Features:**
- Publication type badge
- Cover image or placeholder
- Title, author, and date
- Abstract preview
- Keywords display
- Action buttons (View Details, Download)

### RepositoryFilters
Search and filter component.

**Features:**
- Search input with submit
- Sort options dropdown
- Advanced filters toggle
- Active filters display
- Clear filters functionality

### RepositoryStats
Dashboard statistics component showing repository overview.

**Displays:**
- Total publications count
- Count by publication type
- Recent publications (last 30 days)
- Detailed breakdown

## Database Schema

The repository uses the existing `Publication` model:

```prisma
model Publication {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  abstract  String?
  content   String?
  keywords  String?
  cover     String?
  author_id String
  type      Pub_type @default(EBOOK)
  user      User     @relation(fields: [author_id], references: [id])
}

enum Pub_type {
  JOURNAL
  ARTICLE
  BOOK
  EBOOK
  AUDIOBOOK
}
```

## Setup Instructions

### 1. Seed Sample Data
To populate the repository with sample publications:

```bash
npm run seed:repository
```

This will create 10 sample publications of different types.

### 2. Environment Variables
Ensure your database is properly configured in `.env`:

```env
DATABASE_URL="your_database_url"
```

### 3. Database Migration
If you need to update the database schema:

```bash
npx prisma migrate dev
npx prisma generate
```

## Usage Examples

### Adding New Publications
Publications can be added through the existing manuscript submission system or directly via the database.

### Searching Publications
Users can search using the search bar on any repository page. The search covers:
- Publication titles
- Abstracts
- Keywords
- Author names

### Filtering Results
Users can filter by:
- Publication type (automatically filtered on type-specific pages)
- Sort order (newest first, oldest first, alphabetical)
- Custom date ranges (via advanced filters)

## Customization

### Adding New Publication Types
1. Update the `Pub_type` enum in `prisma/schema.prisma`
2. Run database migration
3. Update the icon and color mappings in components
4. Add new API endpoints if needed

### Styling
The repository system uses Tailwind CSS and follows the existing design system. Key classes:
- Cards: `bg-white rounded-lg shadow-sm border border-gray-200`
- Buttons: `bg-blue-900 text-white rounded-lg hover:bg-blue-800`
- Text: `text-gray-900` for headings, `text-gray-600` for secondary text

## Future Enhancements

### Planned Features
- [ ] Advanced search with boolean operators
- [ ] Publication categories and tags
- [ ] User favorites and reading lists
- [ ] Download tracking and analytics
- [ ] Citation generation
- [ ] Social sharing features
- [ ] Comments and reviews system
- [ ] Related publications suggestions

### Performance Optimizations
- [ ] Implement caching for frequently accessed publications
- [ ] Add search indexing for better performance
- [ ] Optimize image loading and thumbnails
- [ ] Implement virtual scrolling for large lists

## Support

For questions or issues with the repository system, please contact the development team or create an issue in the project repository.
