-- AlterTable
ALTER TABLE "workspace_members" ADD COLUMN     "last_used" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
