-- AlterTable
ALTER TABLE `User` ADD COLUMN `refresh_token` VARCHAR(400) NULL,
    MODIFY `reset_token` VARCHAR(400) NULL;
