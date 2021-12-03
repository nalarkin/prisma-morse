-- CreateTable
CREATE TABLE `Consumable` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL,
    `type` ENUM('TOOL', 'DEVICE', 'CONSUMABLE') NOT NULL DEFAULT 'CONSUMABLE',
    `description` VARCHAR(191) NULL,
    `guide` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `renterId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Consumable` ADD CONSTRAINT `Consumable_renterId_fkey` FOREIGN KEY (`renterId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
