import { DateTime } from "luxon";
import * as dotenv from "dotenv";
dotenv.config();
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { createPrismaEntry } from "./helper/updateDetailEntry";
import { Context } from "aws-lambda";

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
 * calculate donated eth sum for one nft
 */
async function calculateDonatedETH(
  tokenId: number,
  date: string,
  totalData: NFTEntry[]
): Promise<TotalObject> {
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
        console.log(err);
        console.log(`ERROR RESPONSE STATUS IS ${err.response.status}`);
        const retryAfter = err.response.headers["retry-after"];
        const millisToSleep = getMillisToSleep(retryAfter);
        await sleep(millisToSleep);
        return calculateDonatedETH(tokenId, date, totalData);
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

        ownerAddress = openSeaUrlPrefix.concat(element.asset.owner.address);
        if (element.asset.owner.user) {
          ownerName = element.asset.owner.user.username;
        }
      }
    }
  }
  let nftObject = {
    id: tokenId,
    eth: totalDonated,
    lastUpdated: date,
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
    if (result.length === 2) {
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
 * calculate sum of each eth value for all nfts together
 */
async function calculateTotalETHValue(date: string, totalData: NFTEntry[]) {
  let i = 1;
  let totalSum = 0;
  let result: TotalObject = {};
  while (i <= totalAmountNFTs) {
    // add single eth value to total sum
    result = await calculateDonatedETH(i, date, totalData);
    totalSum += result.totalDonated!;
    i++;
  }
  console.log("CALCULATED TOTAL: " + totalSum);
  return { totalSum: totalSum, totalData: result.totalData };
}

// helper function to slow down open sea api requests
function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
// helper function to slow down open sea api requests
function getMillisToSleep(retryHeaderString: string) {
  let millisToSleep = Math.round(parseFloat(retryHeaderString) * 1000);
  if (isNaN(millisToSleep)) {
    millisToSleep = Math.max(
      0,
      new Date(retryHeaderString).getTime() - new Date().getTime()
    );
  }
  return millisToSleep;
}

/**
 * calculate over all rank
 */
module.exports.handler = async function (event: any, context: Context) {
  let totalData: NFTEntry[] = [];

  console.log("Calculating rank");
  let total = await calculateTotalETHValue(DateTime.utc().toISO(), totalData);

  total.totalData?.sort((currentNft: NFTEntry, previousNft: NFTEntry) => {
    currentNft.relativeEth = currentNft.eth / total.totalSum;
    previousNft.relativeEth = previousNft.eth / total.totalSum;
    return previousNft.eth / total.totalSum - currentNft.relativeEth;
  });

  let rank = 1;
  for (let i = 0; i < total.totalData!.length; i++) {
    if (
      i > 0 &&
      total.totalData![i].relativeEth! < total.totalData![i - 1].relativeEth!
    ) {
      rank++;
    }
    total.totalData![i].rank = rank;
    await createPrismaEntry(total.totalData![i]);
  }
};
