/*
  Warnings:

  - You are about to drop the `appointmentextra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `extraservice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `appointmentextra` DROP FOREIGN KEY `AppointmentExtra_appointmentId_fkey`;

-- DropForeignKey
ALTER TABLE `appointmentextra` DROP FOREIGN KEY `AppointmentExtra_extraServiceId_fkey`;

-- AlterTable
ALTER TABLE `appointment` ALTER COLUMN `status` DROP DEFAULT;

-- DropTable
DROP TABLE `appointmentextra`;

-- DropTable
DROP TABLE `extraservice`;

-- CreateTable
CREATE TABLE `GalleryItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `beforeUrl` VARCHAR(191) NOT NULL,
    `afterUrl` VARCHAR(191) NOT NULL,
    `serviceId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GalleryItem` ADD CONSTRAINT `GalleryItem_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
