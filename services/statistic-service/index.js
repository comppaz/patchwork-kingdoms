const { PrismaClient } = require("@prisma/client");
const express = require("express");
require("dotenv").config();

// setup express
const app = express();
app.use(express.json());
const port = process.env.PORT || "3001";

// setup prisma client
const prisma = new PrismaClient();

app.listen(port, () => {
  console.log(`Server Running at ${port} 🚀`);
});

/**
 * api endpoint for the web application to access to for each nft
 */
app.get("/getNftStatistics", async (req, res) => {
  console.log("API: RETURNING NFT STATISTICS");
  const id = parseInt(req.query.id);
  const nftStatistics = await prisma.NFTDetail.findUnique({
    where: {
      nft_id: id,
    },
  });
  console.log(nftStatistics);
  res.json(nftStatistics);
});

/**
 * api endpoint for the web application to access all nfts for the leaderboard
 */
app.get("/getAllNftStatistics", async (req, res) => {
  console.log("API: RETURNING ALL NFT STATISTICS AT ONCE");
  const nftStatistics = await prisma.NFTDetail.findMany({});
  res.json(nftStatistics);
});
