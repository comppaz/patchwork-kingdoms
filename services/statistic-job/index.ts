import { DateTime } from "luxon";
import * as dotenv from "dotenv";
dotenv.config();
import axios, { AxiosRequestConfig } from "axios";
import {
  createPrismaEntry,
  findNFTDetail,
  retrieveEntries,
  saveUpdatedValues,
  updateEntryValues,
} from "./helper/updateDetailEntry";
import { NFTEntry, NFTUpdateEntry } from "./types";

const initMintPrice = 0.175;
const asset_contract_address = "0xd24a7c412f2279b1901e591898c1e96c140be8c5";
const totalAmountNFTs = 1000;
const api_options: AxiosRequestConfig = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "X-API-KEY": process.env.OPENSEA_API_KEY!,
  },
};

const openSeaUrlPrefix = "https://opensea.io/";

/**
 * Calculate the donated eth for a specific nft
 *
 * @param tokenId {number} - the id of the nft
 * @param date {string} - the date of the calculation
 * @param totalData {NFTEntry[]} - the total data of the nfts where the new data will be added
 * @returns
 */
async function calculateDonatedETH(
  tokenId: number,
  date: string
): Promise<NFTUpdateEntry | undefined> {
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
    api_options.url = events_url;
    let response;
    try {
      response = await axios(api_options);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log("ERROR when receiving token event information");
        await sleep(5000);
        return;
      }
    }
    const data = response?.data;
    if (data && data.asset_events && data.asset_events.length > 0) {
      for (const element of data.asset_events) {
        let calculatedDonationValue = await getDonatedETHPerValue(
          element.transaction.transaction_hash,
          element.total_price
        );
        totalDonated += calculatedDonationValue;
      }
    }

    let owner;

    try {
      api_options.url = `https://api.opensea.io/api/v1/asset/${asset_contract_address}/${tokenId}/owners?limit=20&order_by=created_date&order_direction=desc`;
      let owners = await axios(api_options);
      owner = owners?.data.owners[0].owner;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log("ERROR when receiving Owner information");
        await sleep(5000);
        return;
      }
    }
    if (owner.address) {
      ownerAddress = openSeaUrlPrefix.concat(owner.address);
    }
    if (owner.user && owner.user.username) {
      ownerName = owner.user.username;
    }
  }
  let updatedToken: NFTUpdateEntry = {
    id: tokenId,
    eth: totalDonated,
    lastUpdated: date,
    ownerUrl: ownerAddress,
    ownerName: ownerName,
  };
  return updatedToken;
}

/**
 * Get the donated eth for a specific transaction
 *
 * @param transactionHash {string} - the transaction hash of the transaction
 * @param totalPrice {number} - the total price of the transaction
 * @returns {number} - the donated eth for the transaction
 */
async function getDonatedETHPerValue(
  transactionHash: string,
  totalPrice: number
) {
  let internalTransactionEtherscanUrl = `https://api.etherscan.io/api?module=account&action=txlistinternal&txhash=${transactionHash}&apikey=${process.env.ETHERSCAN_API_KEY}`;
  let transactionReceiptEtherscanUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${transactionHash}&apikey=${process.env.ETHERSCAN_API_KEY}`;

  const response = await axios.get(internalTransactionEtherscanUrl);

  const result = response.data.result;
  let donationValue = 0;
  let openseaFees = ((totalPrice / 100) * 2.5) / 10 ** 18;

  if (result !== undefined && result.length > 0) {
    // transaction included only one NFT token
    if (result.length <= 2) {
      donationValue = result[0].value / 10 ** 18;
      // multiple NFT token were handled in one transaction
    } else {
      // find the correct index by finding the total price value in the array
      let currentDonationIndex =
        result.findIndex((element: any) => {
          return element.value === totalPrice;
        }) + 1;
      donationValue = result[currentDonationIndex].value / 10 ** 18;
    }
    // catch all transactions not catched by the other api call
  } else {
    const response = await axios.get(transactionReceiptEtherscanUrl);
    const data = response.data;
    if (data !== undefined && data.result.logs.length > 0) {
      const logs = data.result.logs;
      if (logs.length === 5) {
        donationValue = parseInt(logs[1].data, 16) / 10 ** 18;
      } else if (logs.length === 6) {
        let priceArray: number[] = [];
        logs.forEach((l: any) => {
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
 * Calculate the total donated eth for all NFTs
 *
 * @param date {string} - the date of the last update
 * @param totalData {NFTEntry[]} - the total data of all NFTs
 * @returns
 */

async function calculateTotalETHValue(totalData: any[]) {
  let i = 1;
  let totalSum = 0;
  while (i <= totalAmountNFTs) {
    // add single eth value to total sum
    if (totalData[i]) {
      totalSum += totalData[i].eth;
    }
    i++;
  }
  return totalSum;
}

async function calculateRanks(totalData: any[], totalSum: number) {
  totalData?.sort((currentNft: NFTEntry, previousNft: NFTEntry) => {
    currentNft.relativeEth = currentNft.eth / totalSum;
    previousNft.relativeEth = previousNft.eth / totalSum;
    return previousNft.eth / totalSum - currentNft.relativeEth;
  });
}

// helper function to slow down open sea api requests
function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
// helper function to slow down open sea api requests
function getMillisToSleep(retryHeaderString: string) {
  let millisToSleep = Math.round(parseFloat(retryHeaderString) * 1000);
  console.log(millisToSleep);
  if (isNaN(millisToSleep)) {
    millisToSleep = Math.max(
      0,
      new Date(retryHeaderString).getTime() - new Date().getTime()
    );
  }
  return millisToSleep;
}

export const hourlyHandler = async function () {
  // receive updated information from apis
  let i = 1;

  while (i <= 1000) {
    console.log("HALLOO");
    console.log(i);
    let updatedObject: NFTUpdateEntry | undefined = await calculateDonatedETH(
      i,
      DateTime.utc().toISO()
    );
    // sleep >4s to avoid opensea throttling
    sleep(10000);
    // save received information for each token in db
    if (updatedObject) {
      updateEntryValues(updatedObject);
    }
    i++;
  }
  // retrieve updated data from db
  const entries = await retrieveEntries();
  // calculate total amount of sales
  let totalSales = await calculateTotalETHValue(entries);
  // calculate relative sales value and ranks
  await calculateRanks(entries, totalSales);
  // save updated values
  await saveUpdatedValues(entries);
};

/**
 * Calculate the weekly rank of all NFTs
 */
export const weeklyHandler = async function () {
  let tokenId = 1;
  while (tokenId <= totalAmountNFTs) {
    let nft = await findNFTDetail(tokenId);
    let nftEntry: NFTEntry = {
      id: nft?.nft_id!,
      eth: nft?.eth!,
      lastUpdated: nft?.lastUpdate!,
      ownerUrl: nft?.nft_owner_url!,
      ownerName: nft?.nft_owner_name!,
      relativeEth: nft?.relativeEth!,
      rank: nft?.rank,
      // update with current rank value
      weeklyRank: nft?.rank,
    };
    await createPrismaEntry(nftEntry);
    tokenId++;
  }
};
