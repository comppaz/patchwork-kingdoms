const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const express = require('express');
const cron = require('node-cron');
require('dotenv').config()

// setup express
const app = express();
app.use(express.json());
const port = process.env.PORT || "3001";

// setup prisma client
const prisma = new PrismaClient();

// variables

const initMintPrice = 0.175;
const asset_contract_address = "0xd24a7c412f2279b1901e591898c1e96c140be8c5";

// TODO: set all 1000 nfts
const totalAmountNFTs = 10;

// save all set nft staistics objects here
const totalData = [];

cron.schedule('0 0 * * *', () => {
    console.log('running a task every hour');
    // start calculation process and post to db
    calculateRank();
  });

app.listen(port, () => {
    console.log(`Server Running at ${port} 🚀`);
  });

/**
 * api endpoint for the web application to access to for each nft
 */ 
app.get("/getNftStatistics", async(req, res) => {
    console.log('RETURNING NFT STATISTICS')
    console.log(req.query.id)
    const id = parseInt(req.query.id);
    console.log(id)
    console.log(typeof id)
    const nftStatistics = await prisma.NFTDetail.findUnique({
        where: {
            nft_id: id
        }
    })
    console.log(nftStatistics);
    res.json(nftStatistics);
})

/**
 * create statistic entry for the nft with prisma in db
 */ 
async function createPrismaEntry(nft){
    
    const newNftDetails = await prisma.NFTDetail.upsert({
        where: {id: nft.id},
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

/**
 * calculate donated eth sum for one nft 
 */ 
async function getDonatedETHperPWK(tokenId, date){
    const options = {
        method: 'GET',
        headers: {Accept: 'application/json', 'X-API-KEY': process.env.OPENSEA_API_KEY}
    }
    let url = "https://api.opensea.io/api/v1/events?only_opensea=true&token_id="+tokenId+"&asset_contract_address="+asset_contract_address+"&event_type=successful";

    const response = await fetch(url, options);
    if(response.status === 429){
        const retryAfter = response.headers.get('retry-after')
        const millisToSleep = getMillisToSleep(retryAfter)
        await sleep(millisToSleep)
        return getDonatedETHperPWK(tokenId)
    }
    const data = await response.json();
    let totalDonated = initMintPrice;

    if(data && data.asset_events && (data.asset_events.length > 0)){
        data.asset_events.forEach(element => {
            totalDonated += (element.total_price/10 ** 18);
        });
    }
    let nftObject = {
        id: tokenId,
        eth: totalDonated,
        lastUpdated: date
    }
    totalData.push(nftObject);
    return totalDonated;
} 

/**
 * calculate sum of each eth value for all nfts together
 */ 
async function calculateTotalETHValue(date){
    let i = 1;
    let totalSum = 0;
    while(i < totalAmountNFTs){
        // add single eth value to total sum
        totalSum += await getDonatedETHperPWK(i, date);
        i++
    }
    console.log(totalData)
    return totalSum;
}

/**
 * calculate over all rank
 */ 
async function calculateRank(){
    let total = await calculateTotalETHValue(new Date());

    totalData.sort((currentNft, previousNft) => {
        currentNft.relativeEth = currentNft.eth/total;
        previousNft.relativeEth = previousNft.eth/total;
        return previousNft.eth/total - currentNft.relativeEth;
    });

    let rank = 1;
    totalData.forEach((nft, i) => {
        if(i > 0 && nft.relativeEth < totalData[i - 1].relativeEth){
            rank++;
        }
        nft.rank = rank;

        createPrismaEntry(nft);
    });
}

// helper function to slow down open sea api requests
function sleep (milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
// helper function to slow down open sea api requests
function getMillisToSleep (retryHeaderString) {
    let millisToSleep = Math.round(parseFloat(retryHeaderString) * 1000)
    if (isNaN(millisToSleep)) {
      millisToSleep = Math.max(0, new Date(retryHeaderString) - new Date())
    }
    return millisToSleep
}