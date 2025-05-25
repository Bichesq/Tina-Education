-- CreateEnum
CREATE TYPE "ReviewRecommendation" AS ENUM ('ACCEPT', 'MINOR_REVISIONS', 'MAJOR_REVISIONS', 'REJECT');

-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('REVIEWER', 'EDITOR', 'AUTHOR');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "confidentialComments" TEXT,
ADD COLUMN     "contentEvaluation" TEXT,
ADD COLUMN     "overallRating" INTEGER,
ADD COLUMN     "previousReviewId" TEXT,
ADD COLUMN     "progressPercentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "publicComments" TEXT,
ADD COLUMN     "recommendation" "ReviewRecommendation",
ADD COLUMN     "revisionRound" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "strengths" TEXT,
ADD COLUMN     "styleEvaluation" TEXT,
ADD COLUMN     "timeSpent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weaknesses" TEXT;

-- CreateTable
CREATE TABLE "ReviewMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "sender" "MessageSender" NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ReviewMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReviewMessage" ADD CONSTRAINT "ReviewMessage_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewMessage" ADD CONSTRAINT "ReviewMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
