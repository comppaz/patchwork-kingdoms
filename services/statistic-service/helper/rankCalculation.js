const { DateTime } = require("luxon");
require("dotenv").config();

const fetch = require("node-fetch");
const updatePrismaEntry = require("./updateDetailEntry.js");

const initMintPrice = 0.175;
const asset_contract_address = "0xd24a7c412f2279b1901e591898c1e96c140be8c5";
const totalAmountNFTs = 1000;
const openSeaUrlPrefix = "https://opensea.io/";

/**
 * calculate donated eth sum for one nft
 */
async function getDonatedETHperPWK(tokenId, date, totalData) {
  console.log(
    "Getting donated eth sum calculated for " + tokenId + " at " + date
  );
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-API-KEY": process.env.OPENSEA_API_KEY,
    },
  };
  let url =
    "https://api.opensea.io/api/v1/events?only_opensea=true&token_id=" +
    tokenId +
    "&asset_contract_address=" +
    asset_contract_address +
    "&event_type=successful";

  let ownerAddress = "";
  let ownerName = "";

  const response = await fetch(url, options);
  if (response.status === 429) {
    console.log("ERROR RESPONSE STATUS IS 429");
    console.log(response);
    const retryAfter = response.headers.get("retry-after");
    const millisToSleep = getMillisToSleep(retryAfter);
    await sleep(millisToSleep);
    return getDonatedETHperPWK(tokenId);
  }
  const data = await response.json();
  let totalDonated = initMintPrice;

  if (data && data.asset_events && data.asset_events.length > 0) {
    data.asset_events.forEach((element) => {
      totalDonated += element.total_price / 10 ** 18;
      ownerAddress = openSeaUrlPrefix.concat(element.asset.owner.address);
      if (element.asset.owner.user) {
        ownerName = element.asset.owner.user.username;
      }
    });
  }
  let nftObject = {
    id: tokenId,
    eth: totalDonated,
    lastUpdated: date,
    ownerUrl: ownerAddress,
    ownerName: ownerName,
  };
  totalData.push(nftObject);
  return { totalData: totalData, totalDonated: totalDonated };
}

/**
 * calculate sum of each eth value for all nfts together
 */
async function calculateTotalETHValue(date, totalData) {
  let i = 1;
  let totalSum = 0;
  let result = {};
  while (i <= totalAmountNFTs) {
    // add single eth value to total sum
    result = await getDonatedETHperPWK(i, date, totalData);
    totalSum += result.totalDonated;
    i++;
  }
  console.log("CALCULATED TOTAL: " + totalSum);
  return { totalSum: totalSum, totalData: result.totalData };
}

// helper function to slow down open sea api requests
function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
// helper function to slow down open sea api requests
function getMillisToSleep(retryHeaderString) {
  let millisToSleep = Math.round(parseFloat(retryHeaderString) * 1000);
  if (isNaN(millisToSleep)) {
    millisToSleep = Math.max(0, new Date(retryHeaderString) - new Date());
  }
  return millisToSleep;
}

/**
 * calculate over all rank
 */
async function calculateRank() {
  let totalData = [];
  console.log("Calculating rank");
  let total = await calculateTotalETHValue(DateTime.utc().toISO(), totalData);

  total.totalData.sort((currentNft, previousNft) => {
    currentNft.relativeEth = currentNft.eth / total.totalSum;
    previousNft.relativeEth = previousNft.eth / total.totalSum;
    return previousNft.eth / total.totalSum - currentNft.relativeEth;
  });

  let rank = 1;
  for (let i = 0; i < total.totalData.length; i++) {
    if (
      i > 0 &&
      total.totalData[i].relativeEth < total.totalData[i - 1].relativeEth
    ) {
      rank++;
    }
    total.totalData[i].rank = rank;

    await updatePrismaEntry.createPrismaEntry(total.totalData[i]);
  }
}

module.exports = {
  calculateRank,
};
