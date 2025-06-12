const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function assignSampleGenres() {
  console.log('Starting genre assignment...');
  
  try {
    // Get all publications that are books
    const books = await prisma.publication.findMany({
      where: {
        type: { in: ["BOOK", "EBOOK", "AUDIOBOOK"] }
      }
    });
    
    console.log(`Found ${books.length} books to assign genres to`);
    
    // Get some genres to assign
    const genres = await prisma.genre.findMany({
      where: {
        parentId: { not: null } // Only child genres
      }
    });
    
    console.log(`Found ${genres.length} child genres`);
    
    // Assign random genres to books
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];
      
      await prisma.publication.update({
        where: { id: book.id },
        data: { genreId: randomGenre.id }
      });
      
      console.log(`Assigned "${randomGenre.name}" to "${book.title}"`);
    }
    
    console.log('Genre assignment completed successfully!');
    
    // Display results
    const updatedBooks = await prisma.publication.findMany({
      where: {
        type: { in: ["BOOK", "EBOOK", "AUDIOBOOK"] },
        genreId: { not: null }
      },
      include: {
        genre: {
          include: {
            parent: true
          }
        }
      }
    });
    
    console.log('\nBooks with assigned genres:');
    updatedBooks.forEach(book => {
      const genreHierarchy = book.genre.parent 
        ? `${book.genre.parent.name} > ${book.genre.name}`
        : book.genre.name;
      console.log(`- "${book.title}" -> ${genreHierarchy}`);
    });
    
  } catch (error) {
    console.error('Error assigning genres:', error);
    throw error;
  }
}

async function main() {
  try {
    await assignSampleGenres();
  } catch (error) {
    console.error('Assignment failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { assignSampleGenres };
