-- CreateTable
CREATE TABLE "NFTDetail" (
    "nft_id" INTEGER NOT NULL,
    "eth" DOUBLE PRECISION NOT NULL,
    "relativeEth" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "lastUpdate" TEXT NOT NULL,

    CONSTRAINT "NFTDetail_pkey" PRIMARY KEY ("nft_id")
);
