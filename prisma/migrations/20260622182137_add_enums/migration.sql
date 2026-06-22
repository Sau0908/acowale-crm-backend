/*
  Warnings:

  - The `status` column on the `Feedback` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `category` on the `Feedback` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('Product', 'Feature_Request', 'UI_UX', 'Support', 'Billing', 'Other');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('Open', 'In_Progress', 'Resolved');

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "category",
ADD COLUMN     "category" "FeedbackCategory" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "FeedbackStatus" NOT NULL DEFAULT 'Open';
