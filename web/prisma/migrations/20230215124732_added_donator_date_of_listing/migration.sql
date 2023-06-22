/*
  Warnings:

  - Added the required column `dateOfListing` to the `DonatorInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DonatorInformation" ADD COLUMN     "dateOfListing" TEXT NOT NULL;
