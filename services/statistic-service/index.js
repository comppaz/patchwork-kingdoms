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

// get access to calculation function 
const rank = require('./helper/rankCalculation.js')


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
