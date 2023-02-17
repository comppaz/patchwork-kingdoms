/*
  Warnings:

  - Made the column `weeklyRank` on table `NFTDetail` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "NFTDetail" ALTER COLUMN "weeklyRank" SET NOT NULL;
