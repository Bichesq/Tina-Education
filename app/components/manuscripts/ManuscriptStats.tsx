import { auth } from "@/auth";
import { prisma } from "../../../prisma";

async function getManuscriptStats(userId: string) {
  try {
    const [
      totalManuscripts,
      draftManuscripts,
      underReviewManuscripts,
      acceptedManuscripts,
      rejectedManuscripts,
      journalManuscripts,
      articleManuscripts,
      bookManuscripts
    ] = await Promise.all([
      prisma.manuscript.count({
        where: { author_id: userId }
      }),
      prisma.manuscript.count({
        where: { author_id: userId, status: "DRAFT" }
      }),
      prisma.manuscript.count({
        where: { author_id: userId, status: "UNDER_REVIEW" }
      }),
      prisma.manuscript.count({
        where: { author_id: userId, status: "ACCEPTED" }
      }),
      prisma.manuscript.count({
        where: { author_id: userId, status: "REJECTED" }
      }),
      prisma.manuscript.count({
        where: { author_id: userId, type: "JOURNAL" }
      }),
      prisma.manuscript.count({
        where: { author_id: userId, type: "ARTICLE" }
      }),
      prisma.manuscript.count({
        where: { author_id: userId, type: "BOOK" }
      })
    ]);

    return {
      totalManuscripts,
      draftManuscripts,
      underReviewManuscripts,
      acceptedManuscripts,
      rejectedManuscripts,
      journalManuscripts,
      articleManuscripts,
      bookManuscripts
    };
  } catch (error) {
    console.error("Failed to fetch manuscript stats:", error);
    return {
      totalManuscripts: 0,
      draftManuscripts: 0,
      underReviewManuscripts: 0,
      acceptedManuscripts: 0,
      rejectedManuscripts: 0,
      journalManuscripts: 0,
      articleManuscripts: 0,
      bookManuscripts: 0
    };
  }
}

export default async function ManuscriptStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const stats = await getManuscriptStats(session.user.id);

  const statItems = [
    {
      label: "Total Manuscripts",
      value: stats.totalManuscripts,
      icon: "📝",
      color: "bg-blue-50 text-blue-900 border-blue-200"
    },
    {
      label: "Drafts",
      value: stats.draftManuscripts,
      icon: "✏️",
      color: "bg-gray-50 text-gray-900 border-gray-200"
    },
    {
      label: "Under Review",
      value: stats.underReviewManuscripts,
      icon: "👀",
      color: "bg-amber-50 text-amber-900 border-amber-200"
    },
    {
      label: "Accepted",
      value: stats.acceptedManuscripts,
      icon: "✅",
      color: "bg-green-50 text-green-900 border-green-200"
    },
    {
      label: "Rejected",
      value: stats.rejectedManuscripts,
      icon: "❌",
      color: "bg-red-50 text-red-900 border-red-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className={`bg-white rounded-lg shadow-sm border p-4 ${item.color}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl">{item.icon}</div>
            <div className="text-2xl font-bold">
              {item.value}
            </div>
          </div>
          <div className="text-sm font-medium">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
