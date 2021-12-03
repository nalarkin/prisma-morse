-- CreateTable
CREATE TABLE `Serializable` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `serial_number` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NULL,
    `status` ENUM('BROKEN', 'USABLE', 'SCRAP', 'IN_REPAIR') NOT NULL,
    `type` ENUM('TOOL', 'DEVICE', 'CONSUMABLE') NOT NULL DEFAULT 'CONSUMABLE',
    `project` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `guide` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `renterId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Serializable` ADD CONSTRAINT `Serializable_renterId_fkey` FOREIGN KEY (`renterId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
