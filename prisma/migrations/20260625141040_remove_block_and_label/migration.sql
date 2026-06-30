/*
  Warnings:

  - You are about to drop the `blocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `card_labels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `labels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "blocks" DROP CONSTRAINT "blocks_card_id_fkey";

-- DropForeignKey
ALTER TABLE "blocks" DROP CONSTRAINT "blocks_parent_block_id_fkey";

-- DropForeignKey
ALTER TABLE "card_labels" DROP CONSTRAINT "card_labels_card_id_fkey";

-- DropForeignKey
ALTER TABLE "card_labels" DROP CONSTRAINT "card_labels_label_id_fkey";

-- DropForeignKey
ALTER TABLE "labels" DROP CONSTRAINT "labels_workspace_id_fkey";

-- DropTable
DROP TABLE "blocks";

-- DropTable
DROP TABLE "card_labels";

-- DropTable
DROP TABLE "labels";
