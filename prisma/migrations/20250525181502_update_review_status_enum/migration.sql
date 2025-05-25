/*
  Warnings:

  - The values [REJECTED,SUBMITTED] on the enum `ReviewStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReviewStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'IN_REVIEW', 'REVIEW_SUBMITTED');
ALTER TABLE "Review" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Review" ALTER COLUMN "status" TYPE "ReviewStatus_new" USING ("status"::text::"ReviewStatus_new");
ALTER TYPE "ReviewStatus" RENAME TO "ReviewStatus_old";
ALTER TYPE "ReviewStatus_new" RENAME TO "ReviewStatus";
DROP TYPE "ReviewStatus_old";
ALTER TABLE "Review" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
