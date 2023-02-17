/*
  Warnings:

  - The primary key for the `DonatorInformation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DonatorInformation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "DonatorInformation_donatedTokenId_key";

-- AlterTable
ALTER TABLE "DonatorInformation" DROP CONSTRAINT "DonatorInformation_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "DonatorInformation_pkey" PRIMARY KEY ("donatedTokenId");
