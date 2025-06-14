-- CreateEnum
CREATE TYPE "ReviewerApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "affiliation" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "expertise" TEXT,
ADD COLUMN     "orcid" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "ReviewerApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ReviewerApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "motivation" TEXT NOT NULL,
    "expertise" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "adminNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "ReviewerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewerApplication_userId_key" ON "ReviewerApplication"("userId");

-- AddForeignKey
ALTER TABLE "ReviewerApplication" ADD CONSTRAINT "ReviewerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
