import * as dotenv from "dotenv";
import { createAlchemyWeb3, AlchemyWeb3 } from "@alch/alchemy-web3";
import { NFTEntry } from "./types/types";
import { Contract } from "web3-eth-contract";
dotenv.config();

// setup variables

async function getItems() {
  const web3Wss: AlchemyWeb3 = createAlchemyWeb3(process.env.ALCHEMY_WSS_URL);
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

  const escrowContractWSS: Contract = new web3Wss.eth.Contract(
    contractABI["abi"],
    contractAddress
  );
  const items = await escrowContract.methods.getItems().call();
  //console.log(items);
  /*
  const contractAddress = process.env.ESCROW_DEPLOYMENT_ADDRESS;
  const contractABI = require("./contracts/PatchworkKingdomsEscrow.json");

  const escrowContract = new web3.eth.Contract(
    contractABI["abi"],
    contractAddress
  );
  const escrowContractWSS = new web3Wss.eth.Contract(
    contractABI["abi"],
    contractAddress
  );
  const items = await escrowContract.methods.getItems().call();
  console.log(items);
  
  items.forEach((el: any[], i: number) => {
    //let item : NFTEntry = {};
    // check giver of deposited item is a currently valid address and that the price is neither undefined nor zero
    console.log(el);
    if (
      el[1] !== "0x0000000000000000000000000000000000000000" ||
      el[4] === 0 ||
      el[4] === undefined
    ) {
      /*
      let item : NFTEntry = {
        
        itemId : el.itemId,
        giver : el.giver,
        expiration : el.expiration,
        length : el.length,
        price : el.price,
        tokenId : el.tokenId,
        url : "https://api.lorem.space/image/drink"
      };
      //output.push(item);
    }
  });*/
  //return output;
}
getItems();

/**
 * Check the expiration date on every deposited token
 * Used as hourly handler.
 */
export const checkHandler = async function () {
  // connect/setup to/with deployed contract first --> setup()

  // get deposited nfts
  //const items = await escrowContract.methods.getItems().call(); // call getItems function

  // get and set current Date to compare all items with convert to seconds UTC Math.floor(Date.now() / 1000)
  let currentDate;
  // iterate over all nfts
  // nfts.forEach(el: any) => {}
  // check if el.expiration < currentDate, then expired --> call expiration method and continue with other items
};
