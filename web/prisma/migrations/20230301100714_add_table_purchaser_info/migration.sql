-- CreateTable
CREATE TABLE "PurchaserInformation" (
    "purchasedTokenId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "dateOfSale" TEXT NOT NULL,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "minPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PurchaserInformation_pkey" PRIMARY KEY ("purchasedTokenId")
);
