/*
  Warnings:

  - Added the required column `minPrice` to the `DonatorInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DonatorInformation" ADD COLUMN     "minPrice" DOUBLE PRECISION NOT NULL;
