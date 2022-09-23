import { PrismaClient } from "@prisma/client";
import { NFTEntry } from "../types";

// setup prisma client
const prisma = new PrismaClient();
/**
 * create statistic entry for the nft with prisma in db
 */
export const createPrismaEntry = async function (nft: NFTEntry) {
  console.log("Updating Prisma with the following value");
  console.log(nft);
  const newNftDetails = await prisma.nFTDetail.upsert({
    where: { nft_id: nft.id },
    update: {
      nft_id: nft.id,
      eth: nft.eth,
      relativeEth: nft.relativeEth,
      rank: nft.rank,
      lastUpdate: nft.lastUpdated,
      nft_owner_url: nft.ownerUrl,
      nft_owner_name: nft.ownerName,
      weeklyRank: nft.weeklyRank,
    },
    create: {
      nft_id: nft.id,
      eth: nft.eth,
      relativeEth: nft.relativeEth!,
      rank: nft.rank!,
      lastUpdate: nft.lastUpdated,
      nft_owner_url: nft.ownerUrl,
      nft_owner_name: nft.ownerName,
      weeklyRank: nft.weeklyRank!,
    },
  });
  console.log(
    "Created/updated new NFT statistcs with its details",
    newNftDetails
  );
};

/** get nft details for specific id */
export const findNFTDetail = async function (tokenId: number) {
  const nft = await prisma.nFTDetail.findUnique({
    where: {
      nft_id: tokenId,
    },
  });
  return nft;
};
