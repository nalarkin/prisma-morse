/*
  Warnings:

  - You are about to drop the column `userId` on the `consumable` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `consumable` DROP FOREIGN KEY `Consumable_userId_fkey`;

-- AlterTable
ALTER TABLE `consumable` DROP COLUMN `userId`;
