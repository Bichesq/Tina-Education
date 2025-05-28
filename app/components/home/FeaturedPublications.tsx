import { prisma } from "../../../prisma";
import PublicationCarousel from "./PublicationCarousel";

async function getFeaturedPublications() {
  try {
    // Fetch books and ebooks
    const books = await prisma.publication.findMany({
      where: {
        type: {
          in: ["BOOK", "EBOOK", "AUDIOBOOK"]
        }
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 6
    });

    // Fetch journals
    const journals = await prisma.publication.findMany({
      where: {
        type: "JOURNAL"
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 6
    });

    // Fetch articles
    const articles = await prisma.publication.findMany({
      where: {
        type: "ARTICLE"
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 6
    });

    return {
      books,
      journals,
      articles
    };
  } catch (error) {
    console.error("Error fetching featured publications:", error);
    return {
      books: [],
      journals: [],
      articles: []
    };
  }
}

export default async function FeaturedPublications() {
  const { books, journals, articles } = await getFeaturedPublications();

  return (
    <section id="books" className="py-16 bg-white">
      <div className="container mx-auto w-[90%] max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Publications
          </h2>
          <p className="text-lg text-gray-400">
            Discover the latest academic works and research from our community
          </p>
        </div>

        {/* Books and eBooks Carousel */}
        <PublicationCarousel
          title="Books & eBooks"
          type="books"
          publications={books}
        />

        {/* Journals Carousel */}
        <PublicationCarousel
          title="Journals"
          type="journals"
          publications={journals}
        />

        {/* Articles Carousel */}
        <PublicationCarousel
          title="Articles"
          type="articles"
          publications={articles}
        />

        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/books"
              className="inline-flex items-center px-8 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              Browse All Books
              <span className="ml-2">→</span>
            </a>
            <a
              href="/journals"
              className="inline-flex items-center px-8 py-3 bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
            >
              Browse All Journals
              <span className="ml-2">→</span>
            </a>
            <a
              href="/articles"
              className="inline-flex items-center px-8 py-3 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
            >
              Browse All Articles
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
