-- CreateTable
CREATE TABLE "DonatorInformation" (
    "id" SERIAL NOT NULL,
    "donatedTokenId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "DonatorInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DonatorInformation_donatedTokenId_key" ON "DonatorInformation"("donatedTokenId");
