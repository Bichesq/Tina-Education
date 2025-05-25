/*
  Warnings:

  - You are about to drop the column `affiliation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expertise` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reviewer_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reviews` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Notifications` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pdfFile` to the `Manuscript` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "VerificationToken_token_key";

-- AlterTable
ALTER TABLE "Manuscript" ADD COLUMN     "pdfFile" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "affiliation",
DROP COLUMN "expertise",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "password",
DROP COLUMN "reviewer_id",
DROP COLUMN "reviews",
ALTER COLUMN "role" SET DEFAULT 'REVIEWER';

-- DropTable
DROP TABLE "Notifications";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
