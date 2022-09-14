const { DateTime } = require("luxon");
require("dotenv").config();

const fetch = require("node-fetch");
const { exportToCSV } = require("./exportToCSV.js");
const updatePrismaEntry = require("./updateDetailEntry.js");

const initMintPrice = 0.175;
const asset_contract_address = "0xd24a7c412f2279b1901e591898c1e96c140be8c5";
const totalAmountNFTs = 1000;
const api_options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "X-API-KEY": process.env.OPENSEA_API_KEY,
  },
};

const openSeaUrlPrefix = "https://opensea.io/";

/**
 * calculate donated eth sum for one nft
 */
async function calculateDonatedETH(tokenId, date, totalData) {
  console.log(
    "Getting donated eth sum calculated for " + tokenId + " at " + date
  );
  let events_url =
    "https://api.opensea.io/api/v1/events?only_opensea=true&token_id=" +
    tokenId +
    "&asset_contract_address=" +
    asset_contract_address +
    "&event_type=successful";

  let ownerAddress = "";
  let ownerName = "";
  let totalDonated = initMintPrice;

  // update data for id=1 manually since the following api call would have another event_type: event_type = transfer
  if (tokenId === 1) {
    ownerAddress = openSeaUrlPrefix.concat(
      "0xbbb06cbf8b14473dbf565f3f93f5f6182327653a"
    );
    ownerName = "NadiehBremer";
    totalDonated = 0;
    // make api calls
  } else {
    const response = await fetch(url, options);
    if (response.status === 429) {
      console.log("ERROR RESPONSE STATUS IS 429");
      console.log(response);
      const retryAfter = response.headers.get("retry-after");
      const millisToSleep = getMillisToSleep(retryAfter);
      await sleep(millisToSleep);
      return calculateDonatedETH(tokenId, date, totalData);
    }
    const data = await response.json();

    if (data && data.asset_events && data.asset_events.length > 0) {
      for (const element of data.asset_events) {
        let calculatedDonationValue = await getDonatedETHPerValue(
          element.transaction.transaction_hash,
          element.total_price
        );
        totalDonated += calculatedDonationValue;

        ownerAddress = openSeaUrlPrefix.concat(element.asset.owner.address);
        if (element.asset.owner.user) {
          ownerName = element.asset.owner.user.username;
        }
      }
    }
  }
  let nftObject = {
    nft_id: tokenId,
    eth: totalDonated,
    lastUpdate: date,
    ownerUrl: ownerAddress,
    ownerName: ownerName,
  };
  console.log(nftObject);
  totalData.push(nftObject);
  return { totalData: totalData, totalDonated: totalDonated };
}

/**
 * get donated eth value using etherscan api calls
 */
async function getDonatedETHPerValue(transactionHash, totalPrice) {
  let internalTransactionEtherscanUrl = `https://api.etherscan.io/api?module=account&action=txlistinternal&txhash=${transactionHash}&apikey=${process.env.ETHERSCAN_API_KEY}`;
  let transactionReceiptEtherscanUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${transactionHash}&apikey=${process.env.ETHERSCAN_API_KEY}`;

  const response = await fetch(internalTransactionEtherscanUrl);
  const data = await response.text();
  const result = JSON.parse(data).result;
  let donationValue = 0;
  let openseaFees = ((totalPrice / 100) * 2.5) / 10 ** 18;

  if (result !== undefined && result.length > 0) {
    // transaction included only one NFT token
    if (result.length === 2) {
      donationValue = result[0].value / 10 ** 18;
      // multiple NFT token were handled in one transaction
    } else {
      // find the correct index by finding the total price value in the array
      let currentDonationIndex =
        result.findIndex((element) => {
          return element.value === totalPrice;
        }) + 1;

      donationValue = result[currentDonationIndex].value / 10 ** 18;
    }
    // catch all transactions not catched by the other api call
  } else {
    const response = await fetch(transactionReceiptEtherscanUrl);
    const data = await response.json();
    if (data !== undefined && data.result.logs.length > 0) {
      const logs = data.result.logs;
      if (logs.length === 5) {
        donationValue = parseInt(logs[1].data, 16) / 10 ** 18;
      } else if (logs.length === 6) {
        let priceArray = [];
        logs.forEach((l) => {
          if (l.data !== "0x") {
            let test = parseInt(l.data, 16);
            priceArray.push(test / 10 ** 18);
          }
        });
        priceArray.sort();
        // get donation value from sorted array: opensea fees, donationValue, and totalPrice
        donationValue = priceArray[1];
      } else {
        console.log("SOME ERROR OCCURED");
      }
    }
  }
  // subtract opensea fees
  donationValue -= openseaFees;
  return donationValue;
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
    result = await calculateDonatedETH(i, date, totalData);
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
    let previousNFTInfo = await updatePrismaEntry.findNFTDetail(
      total.totalData[i].nft_id
    );
    // get last known weeklyRank value and preserve the current value for this update
    total.totalData[i].weeklyRank = previousNFTInfo.weeklyRank;
    await updatePrismaEntry.createPrismaEntry(total.totalData[i]);
  }
}

/**
 * calculate rank changes
 */
async function updateWeeklyRank() {
  let tokenId = 1;
  while (tokenId <= totalAmountNFTs) {
    let nft = await updatePrismaEntry.findNFTDetail(tokenId);
    console.log("CURRENT RANK: " + nft.rank);
    nft.weeklyRank = nft.rank;
    await updatePrismaEntry.createPrismaEntry(nft);
    tokenId++;
  }
}

module.exports = {
  calculateRank,
  updateWeeklyRank,
};
