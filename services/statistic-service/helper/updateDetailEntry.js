const { PrismaClient } = require('@prisma/client');

// setup prisma client
const prisma = new PrismaClient();
/**
 * create statistic entry for the nft with prisma in db
 */ 
 async function createPrismaEntry(nft){
    console.log('Updating Prisma with the following value');
    console.log(nft)
    const newNftDetails = await prisma.NFTDetail.upsert({
        where: {nft_id: nft.id},
        update: {
            nft_id:     nft.id,
            eth:        nft.eth,
            relativeEth:nft.relativeEth,
            rank:       nft.rank,
            lastUpdate: nft.lastUpdated
        }, 
        create: {
            nft_id:     nft.id,
            eth:        nft.eth,
            relativeEth:nft.relativeEth,
            rank:       nft.rank,
            lastUpdate: nft.lastUpdated
        }
    });
    console.log('Created/updated new NFT statistcs with its details', newNftDetails);
}


module.exports = {
    createPrismaEntry,
}