const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const samplePublications = [
  {
    title: "Introduction to Machine Learning",
    abstract: "A comprehensive guide to machine learning algorithms and their applications in modern data science. This book covers supervised and unsupervised learning, neural networks, and practical implementation strategies.",
    content: "Machine learning has revolutionized the way we approach data analysis and prediction. This comprehensive guide takes you through the fundamental concepts, algorithms, and practical applications of machine learning in today's data-driven world...",
    keywords: "machine learning, artificial intelligence, data science, algorithms, neural networks",
    type: "BOOK"
  },
  {
    title: "Advanced Research in Quantum Computing",
    abstract: "This journal article explores the latest developments in quantum computing research, including quantum algorithms, error correction, and potential applications in cryptography and optimization.",
    content: "Quantum computing represents a paradigm shift in computational capabilities. Recent advances in quantum error correction and algorithm development have brought us closer to practical quantum computers...",
    keywords: "quantum computing, quantum algorithms, cryptography, optimization, quantum error correction",
    type: "JOURNAL"
  },
  {
    title: "Climate Change and Environmental Policy",
    abstract: "An in-depth analysis of current climate change policies and their effectiveness in addressing global environmental challenges. This article examines policy frameworks across different countries and regions.",
    content: "Climate change remains one of the most pressing challenges of our time. This article provides a comprehensive analysis of environmental policies implemented worldwide...",
    keywords: "climate change, environmental policy, sustainability, global warming, policy analysis",
    type: "ARTICLE"
  },
  {
    title: "Digital Marketing Strategies for Small Businesses",
    abstract: "A practical e-book guide for small business owners looking to leverage digital marketing tools and strategies to grow their customer base and increase revenue.",
    content: "In today's digital age, small businesses must adapt their marketing strategies to compete effectively. This guide provides actionable insights and practical strategies...",
    keywords: "digital marketing, small business, social media, SEO, online advertising",
    type: "EBOOK"
  },
  {
    title: "The History of Ancient Civilizations",
    abstract: "An engaging audiobook that takes listeners on a journey through ancient civilizations, exploring their cultures, achievements, and lasting impact on modern society.",
    content: "From the pyramids of Egypt to the philosophy of ancient Greece, this audiobook explores the rich tapestry of human civilization...",
    keywords: "ancient history, civilizations, archaeology, culture, historical analysis",
    type: "AUDIOBOOK"
  },
  {
    title: "Modern Web Development with React",
    abstract: "A comprehensive guide to building modern web applications using React, covering hooks, state management, and best practices for scalable development.",
    content: "React has become the go-to library for building user interfaces. This book covers everything from basic concepts to advanced patterns...",
    keywords: "React, web development, JavaScript, frontend, programming",
    type: "BOOK"
  },
  {
    title: "Advances in Renewable Energy Technology",
    abstract: "This journal article reviews recent technological advances in renewable energy systems, including solar, wind, and energy storage solutions.",
    content: "The transition to renewable energy is accelerating globally. This comprehensive review examines the latest technological developments...",
    keywords: "renewable energy, solar power, wind energy, energy storage, sustainability",
    type: "JOURNAL"
  },
  {
    title: "Psychological Effects of Social Media",
    abstract: "An examination of how social media usage affects mental health, social relationships, and cognitive behavior patterns in different age groups.",
    content: "Social media has fundamentally changed how we interact and communicate. This research explores both positive and negative psychological impacts...",
    keywords: "social media, psychology, mental health, behavior, digital communication",
    type: "ARTICLE"
  },
  {
    title: "Cryptocurrency and Blockchain Technology",
    abstract: "An accessible e-book explaining cryptocurrency fundamentals, blockchain technology, and their potential impact on traditional financial systems.",
    content: "Cryptocurrency and blockchain technology are reshaping the financial landscape. This guide provides a clear understanding of these revolutionary technologies...",
    keywords: "cryptocurrency, blockchain, Bitcoin, finance, technology",
    type: "EBOOK"
  },
  {
    title: "Mindfulness and Meditation Practices",
    abstract: "An audiobook guide to mindfulness and meditation techniques for stress reduction, improved focus, and overall well-being.",
    content: "In our fast-paced world, mindfulness and meditation offer powerful tools for mental clarity and emotional balance...",
    keywords: "mindfulness, meditation, stress relief, mental health, wellness",
    type: "AUDIOBOOK"
  }
];

async function seedRepository() {
  try {
    console.log('🌱 Starting repository seeding...');

    // Get the first user to assign as author (or create a default user)
    let user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('📝 Creating default user...');
      user = await prisma.user.create({
        data: {
          email: 'admin@tinaeducation.org',
          name: 'Tina Education Admin',
          role: 'ADMIN'
        }
      });
    }

    console.log(`👤 Using user: ${user.name} (${user.email})`);

    // Create publications
    for (const publication of samplePublications) {
      console.log(`📚 Creating publication: ${publication.title}`);
      
      await prisma.publication.create({
        data: {
          ...publication,
          author_id: user.id
        }
      });
    }

    console.log('✅ Repository seeding completed successfully!');
    console.log(`📊 Created ${samplePublications.length} sample publications`);

  } catch (error) {
    console.error('❌ Error seeding repository:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
seedRepository();
