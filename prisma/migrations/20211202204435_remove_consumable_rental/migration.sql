/*
  Warnings:

  - You are about to drop the column `renterId` on the `consumable` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `consumable` DROP FOREIGN KEY `Consumable_renterId_fkey`;

-- AlterTable
ALTER TABLE `consumable` DROP COLUMN `renterId`,
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Consumable` ADD CONSTRAINT `Consumable_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
