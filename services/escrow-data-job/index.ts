import * as dotenv from "dotenv";
import { createAlchemyWeb3, AlchemyWeb3 } from "@alch/alchemy-web3";
import { NFTEntry } from "./types/types";
import { Contract } from "web3-eth-contract";
dotenv.config();

// setup variables
const adminAddress = "0x3112aF4cE798B63A1f6B318BA4CB50a2Ee248971";
const web3: AlchemyWeb3 = createAlchemyWeb3(
  `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
);
const contractAddress: string = process.env.ESCROW_DEPLOYMENT_ADDRESS;
const contractABI: any = require("./contracts/PatchworkKingdomsEscrow.json");
const escrowContract: Contract = new web3.eth.Contract(
  contractABI["abi"],
  contractAddress
);
web3.eth.handleRevert = true;

async function getItems() {
  const items = await escrowContract.methods.getItems().call();

  let depositedItems: NFTEntry[] = [];
  items.forEach((el: any[]) => {
    // check giver of deposited item is a currently valid address and that the price is neither undefined nor zero
    if (
      el[1] !== "0x0000000000000000000000000000000000000000" ||
      el[4] === 0 ||
      el[4] === undefined
    ) {
      depositedItems.push({
        itemId: el[0],
        giver: el[1],
        expiration: el[3],
        length: el.length,
        price: el[4],
        tokenId: el[2],
        url: "https://api.lorem.space/image/drink",
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
  let depositedItems = await getItems();
  let currentTimestamp = Math.floor(Date.now() / 1000);

  // iterate over all nfts
  depositedItems.forEach(async (el: NFTEntry) => {
    if (currentTimestamp >= el.expiration) {
      // call expiration method
      await escrowContract.methods
        .expiration(el.itemId, currentTimestamp)
        .call({ sender: adminAddress });
    }
  });
};
