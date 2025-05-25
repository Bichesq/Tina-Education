import { auth } from "@/auth";
import { prisma } from "../../../prisma";

async function getPublicationStats(userId: string) {
  try {
    const [
      totalPublications,
      journalArticles,
      articles,
      books,
      ebooks
    ] = await Promise.all([
      prisma.publication.count({
        where: { author_id: userId }
      }),
      prisma.publication.count({
        where: { author_id: userId, type: "JOURNAL" }
      }),
      prisma.publication.count({
        where: { author_id: userId, type: "ARTICLE" }
      }),
      prisma.publication.count({
        where: { author_id: userId, type: "BOOK" }
      }),
      prisma.publication.count({
        where: { author_id: userId, type: "EBOOK" }
      })
    ]);

    return {
      totalPublications,
      journalArticles,
      articles,
      books,
      ebooks
    };
  } catch (error) {
    console.error("Failed to fetch publication stats:", error);
    return {
      totalPublications: 0,
      journalArticles: 0,
      articles: 0,
      books: 0,
      ebooks: 0
    };
  }
}

export default async function PublicationStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const stats = await getPublicationStats(session.user.id);

  const statItems = [
    {
      label: "Total Publications",
      value: stats.totalPublications,
      icon: "📚",
      color: "bg-blue-50 text-blue-900"
    },
    {
      label: "Journal Articles",
      value: stats.journalArticles,
      icon: "📄",
      color: "bg-green-50 text-green-900"
    },
    {
      label: "Articles",
      value: stats.articles,
      icon: "📄",
      color: "bg-purple-50 text-purple-900"
    },
    {
      label: "Books",
      value: stats.books,
      icon: "📖",
      color: "bg-orange-50 text-orange-900"
    },
    {
      label: "E-books",
      value: stats.ebooks,
      icon: "💻",
      color: "bg-indigo-50 text-indigo-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center text-xl mb-3`}>
            {item.icon}
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {item.value}
          </div>
          <div className="text-sm text-gray-600">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
