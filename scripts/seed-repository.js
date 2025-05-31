const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const samplePublications = [
  // BOOKS (6 total)
  {
    title: "Introduction to Machine Learning",
    abstract:
      "A comprehensive guide to machine learning algorithms and their applications in modern data science. This book covers supervised and unsupervised learning, neural networks, and practical implementation strategies.",
    content:
      "Machine learning has revolutionized the way we approach data analysis and prediction. This comprehensive guide takes you through the fundamental concepts, algorithms, and practical applications of machine learning in today's data-driven world...",
    keywords:
      "machine learning, artificial intelligence, data science, algorithms, neural networks",
    type: "BOOK",
    cover:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=600&fit=crop",
  },
  {
    title: "Modern Web Development with React",
    abstract:
      "A comprehensive guide to building modern web applications using React, covering hooks, state management, and best practices for scalable development.",
    content:
      "React has become the go-to library for building user interfaces. This book covers everything from basic concepts to advanced patterns...",
    keywords: "React, web development, JavaScript, frontend, programming",
    type: "BOOK",
    cover:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=600&fit=crop",
  },
  {
    title: "The Art of Leadership",
    abstract:
      "Discover the essential principles of effective leadership in the modern workplace. This book combines timeless wisdom with contemporary insights to help you become a better leader.",
    content:
      "Leadership is not about position or title, but about influence and impact. This comprehensive guide explores the fundamental principles that make great leaders...",
    keywords: "leadership, management, business, team building, communication",
    type: "BOOK",
    cover:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
  },
  {
    title: "Data Science Fundamentals",
    abstract:
      "Master the core concepts of data science including statistics, programming, and machine learning. Perfect for beginners and professionals looking to enhance their skills.",
    content:
      "Data science is transforming industries and creating new opportunities. This book provides a solid foundation in the essential skills needed to succeed in this field...",
    keywords: "data science, statistics, Python, analytics, big data",
    type: "BOOK",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop",
  },
  {
    title: "Sustainable Architecture",
    abstract:
      "Explore innovative approaches to sustainable building design and construction. This book showcases cutting-edge techniques for creating environmentally responsible architecture.",
    content:
      "The future of architecture lies in sustainability. This comprehensive guide examines how architects and builders can create structures that work in harmony with the environment...",
    keywords:
      "architecture, sustainability, green building, design, environment",
    type: "BOOK",
    cover:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=600&fit=crop",
  },
  {
    title: "The Psychology of Success",
    abstract:
      "Understand the mental frameworks and habits that drive high achievers. This book reveals the psychological principles behind sustained success and personal growth.",
    content:
      "Success is not just about talent or luck—it's about mindset. This book explores the psychological factors that separate high achievers from the rest...",
    keywords: "psychology, success, mindset, personal development, motivation",
    type: "BOOK",
    cover:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=600&fit=crop",
  },

  // JOURNALS (6 total)
  {
    title: "Advanced Research in Quantum Computing",
    abstract:
      "This journal article explores the latest developments in quantum computing research, including quantum algorithms, error correction, and potential applications in cryptography and optimization.",
    content:
      "Quantum computing represents a paradigm shift in computational capabilities. Recent advances in quantum error correction and algorithm development have brought us closer to practical quantum computers...",
    keywords:
      "quantum computing, quantum algorithms, cryptography, optimization, quantum error correction",
    type: "JOURNAL",
    cover:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
  },
  {
    title: "Advances in Renewable Energy Technology",
    abstract:
      "This journal article reviews recent technological advances in renewable energy systems, including solar, wind, and energy storage solutions.",
    content:
      "The transition to renewable energy is accelerating globally. This comprehensive review examines the latest technological developments...",
    keywords:
      "renewable energy, solar power, wind energy, energy storage, sustainability",
    type: "JOURNAL",
    cover:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=600&fit=crop",
  },
  {
    title: "Neuroscience and Cognitive Behavior",
    abstract:
      "Recent findings in neuroscience research reveal new insights into cognitive behavior patterns and their implications for understanding human consciousness and decision-making.",
    content:
      "The human brain continues to surprise researchers with its complexity and adaptability. This journal explores the latest discoveries in neuroscience...",
    keywords:
      "neuroscience, cognitive behavior, brain research, consciousness, psychology",
    type: "JOURNAL",
    cover:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop",
  },
  {
    title: "Biotechnology and Medical Innovation",
    abstract:
      "Exploring breakthrough developments in biotechnology and their applications in modern medicine, including gene therapy, personalized medicine, and bioengineering.",
    content:
      "Biotechnology is revolutionizing healthcare and medicine. This comprehensive review examines the most promising developments in the field...",
    keywords:
      "biotechnology, medical innovation, gene therapy, personalized medicine, bioengineering",
    type: "JOURNAL",
    cover:
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=600&fit=crop",
  },
  {
    title: "Space Exploration and Astrophysics",
    abstract:
      "Latest discoveries in space exploration and astrophysics, including exoplanet research, dark matter studies, and the search for extraterrestrial life.",
    content:
      "The universe continues to reveal its secrets through advanced space exploration and astrophysical research. This journal presents the latest findings...",
    keywords:
      "space exploration, astrophysics, exoplanets, dark matter, astronomy",
    type: "JOURNAL",
    cover:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop",
  },
  {
    title: "Artificial Intelligence Ethics",
    abstract:
      "Examining the ethical implications of artificial intelligence development and deployment, including bias, privacy, and the future of human-AI interaction.",
    content:
      "As AI becomes more prevalent in society, ethical considerations become increasingly important. This journal explores the complex moral landscape of AI...",
    keywords:
      "artificial intelligence, ethics, bias, privacy, human-AI interaction",
    type: "JOURNAL",
    cover:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop",
  },

  // ARTICLES (6 total)
  {
    title: "Climate Change and Environmental Policy",
    abstract:
      "An in-depth analysis of current climate change policies and their effectiveness in addressing global environmental challenges. This article examines policy frameworks across different countries and regions.",
    content:
      "Climate change remains one of the most pressing challenges of our time. This article provides a comprehensive analysis of environmental policies implemented worldwide...",
    keywords:
      "climate change, environmental policy, sustainability, global warming, policy analysis",
    type: "ARTICLE",
    cover:
      "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=600&fit=crop",
  },
  {
    title: "Psychological Effects of Social Media",
    abstract:
      "An examination of how social media usage affects mental health, social relationships, and cognitive behavior patterns in different age groups.",
    content:
      "Social media has fundamentally changed how we interact and communicate. This research explores both positive and negative psychological impacts...",
    keywords:
      "social media, psychology, mental health, behavior, digital communication",
    type: "ARTICLE",
    cover:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop",
  },
  {
    title: "The Future of Remote Work",
    abstract:
      "Analyzing the long-term implications of remote work on productivity, company culture, and employee satisfaction in the post-pandemic era.",
    content:
      "The COVID-19 pandemic has fundamentally changed how we think about work. This article examines the lasting effects of remote work...",
    keywords:
      "remote work, productivity, company culture, pandemic, workplace trends",
    type: "ARTICLE",
    cover:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=600&fit=crop",
  },
  {
    title: "Sustainable Fashion Industry",
    abstract:
      "Exploring the environmental impact of fast fashion and the growing movement towards sustainable and ethical clothing production.",
    content:
      "The fashion industry is one of the world's largest polluters. This article explores how sustainable practices are reshaping the industry...",
    keywords:
      "sustainable fashion, environment, ethical production, fast fashion, clothing",
    type: "ARTICLE",
    cover:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",
  },
  {
    title: "Urban Planning in the 21st Century",
    abstract:
      "How modern cities are adapting to population growth, climate change, and technological advancement through innovative urban planning strategies.",
    content:
      "Cities are growing rapidly and facing unprecedented challenges. This article examines how urban planners are creating sustainable solutions...",
    keywords:
      "urban planning, smart cities, sustainability, population growth, technology",
    type: "ARTICLE",
    cover:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop",
  },
  {
    title: "The Rise of Electric Vehicles",
    abstract:
      "Examining the rapid adoption of electric vehicles and their impact on the automotive industry, environment, and energy infrastructure.",
    content:
      "Electric vehicles are transforming transportation. This article analyzes the factors driving adoption and the challenges ahead...",
    keywords:
      "electric vehicles, automotive industry, sustainability, energy, transportation",
    type: "ARTICLE",
    cover:
      "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=600&fit=crop",
  },

  // Additional EBOOKS
  {
    title: "Digital Marketing Strategies for Small Businesses",
    abstract:
      "A practical e-book guide for small business owners looking to leverage digital marketing tools and strategies to grow their customer base and increase revenue.",
    content:
      "In today's digital age, small businesses must adapt their marketing strategies to compete effectively. This guide provides actionable insights and practical strategies...",
    keywords:
      "digital marketing, small business, social media, SEO, online advertising",
    type: "EBOOK",
    cover:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop",
  },
  {
    title: "Cryptocurrency and Blockchain Technology",
    abstract:
      "An accessible e-book explaining cryptocurrency fundamentals, blockchain technology, and their potential impact on traditional financial systems.",
    content:
      "Cryptocurrency and blockchain technology are reshaping the financial landscape. This guide provides a clear understanding of these revolutionary technologies...",
    keywords: "cryptocurrency, blockchain, Bitcoin, finance, technology",
    type: "EBOOK",
    cover:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=600&fit=crop",
  },
  {
    title: "Personal Finance Mastery",
    abstract:
      "A comprehensive e-book covering budgeting, investing, debt management, and building wealth for long-term financial security.",
    content:
      "Financial literacy is crucial for personal success. This e-book provides practical strategies for managing money and building wealth...",
    keywords:
      "personal finance, budgeting, investing, wealth building, financial planning",
    type: "EBOOK",
    cover:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
  },
  {
    title: "Home Cooking Essentials",
    abstract:
      "Master the art of home cooking with this practical e-book featuring easy recipes, cooking techniques, and meal planning strategies for busy lifestyles.",
    content:
      "Cooking at home is both rewarding and economical. This guide helps you develop essential cooking skills and create delicious meals...",
    keywords: "cooking, recipes, meal planning, kitchen skills, home cooking",
    type: "EBOOK",
    cover:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop",
  },
  {
    title: "Photography for Beginners",
    abstract:
      "Learn the fundamentals of photography including composition, lighting, and camera settings. Perfect for aspiring photographers and hobbyists.",
    content:
      "Photography is an art form accessible to everyone. This e-book teaches the essential skills needed to capture stunning images...",
    keywords:
      "photography, camera techniques, composition, lighting, digital photography",
    type: "EBOOK",
    cover:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=600&fit=crop",
  },
  {
    title: "Freelancer's Success Guide",
    abstract:
      "Everything you need to know about starting and growing a successful freelance business, from finding clients to managing finances.",
    content:
      "Freelancing offers freedom and flexibility, but success requires strategy. This guide provides the tools and knowledge needed to thrive...",
    keywords:
      "freelancing, business, entrepreneurship, remote work, self-employment",
    type: "EBOOK",
    cover:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=600&fit=crop",
  },

  // Additional AUDIOBOOKS
  {
    title: "Mindfulness and Meditation Practices",
    abstract:
      "An audiobook guide to mindfulness and meditation techniques for stress reduction, improved focus, and overall well-being.",
    content:
      "In our fast-paced world, mindfulness and meditation offer powerful tools for mental clarity and emotional balance...",
    keywords: "mindfulness, meditation, stress relief, mental health, wellness",
    type: "AUDIOBOOK",
    cover:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
  },
  {
    title: "The Science of Sleep",
    abstract:
      "Discover the fascinating world of sleep science and learn practical strategies for improving sleep quality and overall health.",
    content:
      "Sleep is essential for physical and mental health. This audiobook explores the science behind sleep and provides actionable advice...",
    keywords:
      "sleep science, health, wellness, circadian rhythm, sleep disorders",
    type: "AUDIOBOOK",
    cover:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=600&fit=crop",
  },
  {
    title: "World War II: Untold Stories",
    abstract:
      "Compelling narratives from World War II featuring lesser-known stories of courage, sacrifice, and resilience from around the globe.",
    content:
      "World War II shaped the modern world. This audiobook presents powerful stories that illuminate the human experience during this pivotal time...",
    keywords:
      "World War II, history, war stories, courage, historical narratives",
    type: "AUDIOBOOK",
    cover:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
  },
  {
    title: "Philosophy for Everyday Life",
    abstract:
      "Explore timeless philosophical concepts and their practical applications in modern life, making complex ideas accessible and relevant.",
    content:
      "Philosophy isn't just academic—it's a practical guide for living. This audiobook makes philosophical wisdom accessible to everyone...",
    keywords: "philosophy, wisdom, ethics, critical thinking, life guidance",
    type: "AUDIOBOOK",
    cover:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
  },
  {
    title: "The Art of Storytelling",
    abstract:
      "Master the craft of storytelling with techniques used by professional writers, speakers, and performers to captivate audiences.",
    content:
      "Stories have the power to inspire, educate, and connect us. This audiobook teaches the essential elements of compelling storytelling...",
    keywords:
      "storytelling, communication, writing, public speaking, narrative",
    type: "AUDIOBOOK",
    cover:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
  },
];

async function seedRepository() {
  try {
    console.log('🌱 Starting repository seeding...');

    // Get the first user to assign as author (or create a default user)
    let user = await prisma.user.findFirst();

    if (!user) {
      console.log("📝 Creating default user...");
      user = await prisma.user.create({
        data: {
          email: "admin@tinaeducation.org",
          name: "Tina Education Admin",
          role: "ADMIN",
        },
      });
    }

    console.log(`👤 Using user: ${user.name} (${user.email})`);

    // Create publications
    for (const publication of samplePublications) {
      console.log(`📚 Creating publication: ${publication.title}`);

      await prisma.publication.create({
        data: {
          ...publication,
          author_id: user.id,
        },
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
