/*
  Warnings:

  - You are about to alter the column `price` on the `Images` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[url]` on the table `Images` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Images" ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Images_url_key" ON "Images"("url");
