-- AlterTable
ALTER TABLE "User" ADD COLUMN     "auth_provider" TEXT NOT NULL DEFAULT 'local',
ADD COLUMN     "google_id" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
