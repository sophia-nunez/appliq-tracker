-- AlterTable
ALTER TABLE "User" ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "token_expiry" TIMESTAMP(3);
