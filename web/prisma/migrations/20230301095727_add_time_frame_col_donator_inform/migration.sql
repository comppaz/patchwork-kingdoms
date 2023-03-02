/*
  Warnings:

  - Added the required column `timeframe` to the `DonatorInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DonatorInformation" ADD COLUMN     "timeframe" DOUBLE PRECISION NOT NULL;
