/*
  Warnings:

  - You are about to drop the column `renterId` on the `serializable` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `serializable` DROP FOREIGN KEY `Serializable_renterId_fkey`;

-- AlterTable
ALTER TABLE `serializable` DROP COLUMN `renterId`,
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Serializable` ADD CONSTRAINT `Serializable_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
