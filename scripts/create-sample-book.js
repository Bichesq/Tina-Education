const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleBook() {
  console.log('Creating sample book...');
  
  try {
    // Get a user to assign as author (or create one)
    let user = await prisma.user.findFirst();
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'sample@example.com',
          name: 'Sample Author',
          role: 'USER'
        }
      });
      console.log('Created sample user');
    }
    
    // Get the "Crime, Thriller and Mystery" genre
    const genre = await prisma.genre.findFirst({
      where: {
        slug: 'crime-thriller-mystery'
      }
    });
    
    if (!genre) {
      console.error('Genre not found. Please run seed-genres.js first');
      return;
    }
    
    // Create sample book
    const book = await prisma.publication.create({
      data: {
        title: 'The Thursday Murder Club',
        abstract: 'In a peaceful retirement village, four unlikely friends meet weekly to investigate cold cases. But when a local developer is found dead with a mysterious photograph next to his body, the Thursday Murder Club find themselves in the middle of their first live case.',
        content: 'Elizabeth, Joyce, Ibrahim and Ron might be pushing eighty but they still have one very important thing left to do – solve a murder. In Cooper\'s Chase retirement village, these four very different people meet every Thursday in the Jigsaw Room to discuss unsolved crimes; together they call themselves the Thursday Murder Club...',
        keywords: 'mystery, crime, thriller, retirement, murder, investigation, friendship',
        type: 'BOOK',
        author_id: user.id,
        genreId: genre.id
      }
    });
    
    console.log(`Created sample book: "${book.title}"`);
    
    // Create another sample book in a different genre
    const fictionGenre = await prisma.genre.findFirst({
      where: {
        slug: 'literary-fiction'
      }
    });
    
    if (fictionGenre) {
      const book2 = await prisma.publication.create({
        data: {
          title: 'The Seven Husbands of Evelyn Hugo',
          abstract: 'Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life. But when she chooses unknown magazine reporter Monique Grant for the job, no one is more astounded than Monique herself.',
          content: 'From the 1950s to the 1980s, Evelyn Hugo was Hollywood royalty. She was known for her seven marriages, her beauty, and her talent. But now, at age 79, she\'s ready to tell her story to one person: Monique Grant, a struggling magazine writer...',
          keywords: 'literary fiction, Hollywood, biography, secrets, love, fame',
          type: 'EBOOK',
          author_id: user.id,
          genreId: fictionGenre.id
        }
      });
      
      console.log(`Created second sample book: "${book2.title}"`);
    }
    
    // Display created books with genres
    const booksWithGenres = await prisma.publication.findMany({
      where: {
        type: { in: ["BOOK", "EBOOK", "AUDIOBOOK"] }
      },
      include: {
        genre: {
          include: {
            parent: true
          }
        },
        user: {
          select: { name: true }
        }
      }
    });
    
    console.log('\nCreated books:');
    booksWithGenres.forEach(book => {
      const genreHierarchy = book.genre?.parent 
        ? `${book.genre.parent.name} > ${book.genre.name}`
        : book.genre?.name || 'No genre';
      console.log(`- "${book.title}" by ${book.user.name} -> ${genreHierarchy}`);
    });
    
  } catch (error) {
    console.error('Error creating sample book:', error);
    throw error;
  }
}

async function main() {
  try {
    await createSampleBook();
  } catch (error) {
    console.error('Creation failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { createSampleBook };
