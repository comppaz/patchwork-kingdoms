const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const express = require('express');
const cron = require('node-cron');
const fs = require('fs');
const { DateTime } = require("luxon");
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
const totalAmountNFTs = 1000;

// running every full hour
cron.schedule('0 * * * *', () => {
    console.log('running a task every hour');
    // start calculation process and post to db
    rank.calculateRank();
});

app.listen(port, () => {
    console.log(`Server Running at ${port} 🚀`);
  });

/**
 * api endpoint for the web application to access to for each nft
 */ 
app.get("/getNftStatistics", async(req, res) => {
    console.log('API: RETURNING NFT STATISTICS')
    const id = parseInt(req.query.id);
    const nftStatistics = await prisma.NFTDetail.findUnique({
        where: {
            nft_id: id
        }
    })
    console.log(nftStatistics);
    res.json(nftStatistics);
})

/**
 * api endpoint for the web application to access all nfts for the leaderboard
 */ 
 app.get("/getAllNftStatistics", async(req, res) => {
    console.log('API: RETURNING ALL NFT STATISTICS AT ONCE')
    const nftStatistics = await prisma.NFTDetail.findMany({});
    res.json(nftStatistics);
})

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

/**
 * calculate donated eth sum for one nft 
 */ 
async function getDonatedETHperPWK(tokenId, date, totalData){
    console.log('Getting donated eth sum calculated for ' + tokenId + ' at ' + date);
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
    return {totalData: totalData, totalDonated: totalDonated};
} 

/**
 * calculate sum of each eth value for all nfts together
 */ 
async function calculateTotalETHValue(date, totalData){
    let i = 1;
    let totalSum = 0;
    let result = {};
    while(i <= totalAmountNFTs){
        // add single eth value to total sum
        result = await getDonatedETHperPWK(i, date, totalData);
        totalSum += result.totalDonated;
        i++
    }
    console.log('CALCULATED TOTAL: ' + totalSum);
    return {totalSum: totalSum, totalData: result.totalData};
}

/**
 * calculate over all rank
 */ 
async function calculateRank(){
    let totalData = [];
    console.log('Calculating rank')
    let total = await calculateTotalETHValue(DateTime.utc().toISO(), totalData);

    total.totalData.sort((currentNft, previousNft) => {
        currentNft.relativeEth = currentNft.eth/total.totalSum;
        previousNft.relativeEth = previousNft.eth/total.totalSum;
        return previousNft.eth/total.totalSum - currentNft.relativeEth;
    });

    let rank = 1;
    for(let i = 0; i < total.totalData.length; i++){
        if(i > 0 && total.totalData[i].relativeEth < total.totalData[i - 1].relativeEth){
            rank++;
        }
        total.totalData[i].rank = rank;

        await createPrismaEntry(total.totalData[i]);
    }
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