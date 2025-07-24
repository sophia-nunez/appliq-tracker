/*
  Warnings:

  - You are about to drop the column `interviewUpated` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "interviewUpated",
ADD COLUMN     "interviewUpdated" TIMESTAMP(3);
