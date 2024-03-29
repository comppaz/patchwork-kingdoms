import * as dotenv from "dotenv";
import { createAlchemyWeb3, AlchemyWeb3 } from "@alch/alchemy-web3";
import { NFTEntry } from "./types/types";
import { Contract } from "web3-eth-contract";
import { ethers } from "ethers";

dotenv.config();

// setup variables
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);
const network = process.env.NETWORK;
const provider = new ethers.providers.AlchemyProvider(
  network,
  `${process.env.ALCHEMY_API_KEY}`
);
const signer = wallet.connect(provider);
const adminAddress = process.env.ADMIN_ADDRESS;
const contractAddress: string = process.env.ESCROW_DEPLOYMENT_ADDRESS!;
const contractABI: any = require("./contracts/PatchworkKingdomsEscrow.json");
const escrowContract = new ethers.Contract(
  contractAddress,
  contractABI["abi"],
  signer
);

async function getItems() {
  console.log("...GETTING ITEMS...");
  // wenn escrow contract items = [] check
  const items = await escrowContract.getItems();
  console.log(items);

  let depositedItems: NFTEntry[] = [];
  items.forEach((el: any[]) => {
    // check giver of deposited item is a currently valid address and that the price is neither undefined nor zero
    if (el[1] !== "0x0000000000000000000000000000000000000000") {
      depositedItems.push({
        itemId: el[0],
        giver: el[1],
        expiration: el[3],
        length: el.length,
        price: el[4],
        tokenId: el[2],
        url: `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.fra1.digitaloceanspaces.com/thumbnail/${el[2]}.png`,
      });
    }
  });
  return depositedItems;
}

/**
 * Check the expiration date on every deposited token
 * Used as every 10 minute- handler.
 */
export const checkHandler = async function () {
  console.log("...STARTING CHECK HANDLER...");
  let depositedItems = await getItems();
  let currentTimestamp = Math.floor(Date.now() / 1000);

  // iterate over all nfts
  depositedItems.forEach(async (el: NFTEntry) => {
    if (currentTimestamp >= el.expiration) {
      console.log(`FOUND EXPIRED ITEM WITH TOKENID: ${el.tokenId}`);
      console.log(`Current Timestamp: ${currentTimestamp}`);
      console.log(`Deposited Expir. Timestamp: ${el.expiration}`);
      // call expiration method
      await escrowContract.expiration(el.itemId, currentTimestamp);
    }
  });
};
