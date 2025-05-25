const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestReview() {
  try {
    // Get the current user
    const user = await prisma.user.findFirst({
      where: { email: 'bichesq@gmail.com' }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    // Create a test manuscript
    const manuscript = await prisma.manuscript.create({
      data: {
        title: 'Advanced Machine Learning Techniques in Healthcare',
        abstract: 'This paper explores the application of advanced machine learning techniques in healthcare diagnostics, focusing on deep learning models for medical image analysis and predictive analytics for patient outcomes.',
        content: `
# Introduction

Machine learning has revolutionized healthcare by providing powerful tools for diagnosis, treatment planning, and patient care optimization. This study examines the latest developments in ML applications within healthcare settings.

## Methodology

We implemented several deep learning architectures including:
- Convolutional Neural Networks (CNNs) for medical imaging
- Recurrent Neural Networks (RNNs) for time-series patient data
- Transformer models for clinical text analysis

## Results

Our experiments demonstrate significant improvements in diagnostic accuracy:
- 95% accuracy in chest X-ray analysis
- 87% precision in predicting patient readmission
- 92% recall in identifying critical conditions

## Discussion

The results indicate that machine learning can significantly enhance healthcare delivery when properly implemented with appropriate safeguards and validation protocols.

## Conclusion

Advanced ML techniques show great promise for improving healthcare outcomes, but require careful validation and ethical considerations.
        `,
        keywords: 'machine learning, healthcare, deep learning, medical imaging, predictive analytics',
        type: 'ARTICLE',
        status: 'UNDER_REVIEW',
        author_id: user.id,
        pdfFile: 'https://example.com/sample-paper.pdf'
      }
    });

    // Create a review assignment in ACCEPTED status
    const review = await prisma.review.create({
      data: {
        content: 'Review assignment for machine learning healthcare paper',
        manuscript_id: manuscript.id,
        reviewer_id: user.id,
        status: 'ACCEPTED',
        feedback: null,
        score: null,
        progressPercentage: 0,
        timeSpent: 0,
        revisionRound: 1
      }
    });

    console.log('✅ Test review created successfully!');
    console.log('📄 Manuscript:', manuscript.title);
    console.log('🔍 Review ID:', review.id);
    console.log('🌐 Review URL:', `http://localhost:3000/reviews/${review.id}/review`);

  } catch (error) {
    console.error('❌ Error creating test review:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestReview();
