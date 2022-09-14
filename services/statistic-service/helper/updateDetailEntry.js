const { PrismaClient } = require("@prisma/client");

// setup prisma client
const prisma = new PrismaClient();
/**
 * create statistic entry for the nft with prisma in db
 */
async function createPrismaEntry(nft) {
  console.log("Updating Prisma with the following value");
  console.log(nft);
  const newNftDetails = await prisma.NFTDetail.upsert({
    where: { nft_id: nft.nft_id },
    update: {
      nft_id: nft.nft_id,
      eth: nft.eth,
      relativeEth: nft.relativeEth,
      rank: nft.rank,
      lastUpdate: nft.lastUpdate,
      nft_owner_url: nft.ownerUrl,
      nft_owner_name: nft.ownerName,
      weeklyRank: nft.weeklyRank,
    },
    create: {
      nft_id: nft.nft_id,
      eth: nft.eth,
      relativeEth: nft.relativeEth,
      rank: nft.rank,
      lastUpdate: nft.lastUpdate,
      nft_owner_url: nft.ownerUrl,
      nft_owner_name: nft.ownerName,
      weeklyRank: nft.weeklyRank,
    },
  });
  console.log(
    "Created/updated new NFT statistcs with its details",
    newNftDetails
  );
}

/** get nft details for specific id */
async function findNFTDetail(tokenId) {
  const nft = await prisma.NFTDetail.findUnique({
    where: {
      nft_id: tokenId,
    },
  });
  return nft;
}

module.exports = {
  createPrismaEntry,
  findNFTDetail,
};
