/*
  Warnings:

  - You are about to drop the column `owner_id` on the `workspaces` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_owner_id_fkey";

-- AlterTable
ALTER TABLE "workspaces" DROP COLUMN "owner_id";
