import { prisma } from "../../../prisma";
import StatsCard from "../dashboard/StatsCard";

async function getRepositoryStats() {
  try {
    const [
      totalPublications,
      totalBooks,
      totalEbooks,
      totalAudiobooks,
      totalJournals,
      totalArticles,
      recentPublications
    ] = await Promise.all([
      prisma.publication.count(),
      prisma.publication.count({ where: { type: "BOOK" } }),
      prisma.publication.count({ where: { type: "EBOOK" } }),
      prisma.publication.count({ where: { type: "AUDIOBOOK" } }),
      prisma.publication.count({ where: { type: "JOURNAL" } }),
      prisma.publication.count({ where: { type: "ARTICLE" } }),
      prisma.publication.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ]);

    return {
      totalPublications,
      totalBooks: totalBooks + totalEbooks + totalAudiobooks, // Combined books
      totalJournals,
      totalArticles,
      recentPublications,
      breakdown: {
        books: totalBooks,
        ebooks: totalEbooks,
        audiobooks: totalAudiobooks,
        journals: totalJournals,
        articles: totalArticles
      }
    };
  } catch (error) {
    console.error("Failed to fetch repository stats:", error);
    return {
      totalPublications: 0,
      totalBooks: 0,
      totalJournals: 0,
      totalArticles: 0,
      recentPublications: 0,
      breakdown: {
        books: 0,
        ebooks: 0,
        audiobooks: 0,
        journals: 0,
        articles: 0
      }
    };
  }
}

export default async function RepositoryStats() {
  const stats = await getRepositoryStats();

  const statItems = [
    {
      label: "Total Publications",
      value: stats.totalPublications,
      icon: "📚",
      color: "bg-blue-50 text-blue-900",
      href: "/repository"
    },
    {
      label: "Books",
      value: stats.totalBooks,
      icon: "📖",
      color: "bg-orange-50 text-orange-900",
      href: "/books"
    },
    {
      label: "Journals",
      value: stats.totalJournals,
      icon: "📰",
      color: "bg-green-50 text-green-900",
      href: "/journals"
    },
    {
      label: "Articles",
      value: stats.totalArticles,
      icon: "📄",
      color: "bg-purple-50 text-purple-900",
      href: "/articles"
    },
    {
      label: "Recent (30 days)",
      value: stats.recentPublications,
      icon: "🆕",
      color: "bg-indigo-50 text-indigo-900",
      href: "/repository?sortBy=createdAt&sortOrder=desc"
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Repository Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {statItems.map((item, index) => (
          <StatsCard
            key={index}
            label={item.label}
            value={item.value}
            icon={item.icon}
            color={item.color}
            href={item.href}
          />
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Publication Types Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">📚</div>
            <div className="text-sm text-gray-400">Physical Books</div>
            <div className="text-lg font-semibold text-gray-900">{stats.breakdown.books}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💻</div>
            <div className="text-sm text-gray-400">E-books</div>
            <div className="text-lg font-semibold text-gray-900">{stats.breakdown.ebooks}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎧</div>
            <div className="text-sm text-gray-400">Audiobooks</div>
            <div className="text-lg font-semibold text-gray-900">{stats.breakdown.audiobooks}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📰</div>
            <div className="text-sm text-gray-400">Journals</div>
            <div className="text-lg font-semibold text-gray-900">{stats.breakdown.journals}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📄</div>
            <div className="text-sm text-gray-400">Articles</div>
            <div className="text-lg font-semibold text-gray-900">{stats.breakdown.articles}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
