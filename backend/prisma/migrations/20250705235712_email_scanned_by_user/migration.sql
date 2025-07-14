/*
  Warnings:

  - You are about to drop the column `emailScanned` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "emailScanned";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailScanned" TIMESTAMP(3);
