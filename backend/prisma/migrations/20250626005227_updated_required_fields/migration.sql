/*
  Warnings:

  - Added the required column `companyName` to the `Application` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_companyId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "companyName" TEXT,
ALTER COLUMN "companyId" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
