const axios = require("axios");
const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  /* for local testing
    const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://127.0.0.1:8545"
    const signer = provider.getSigner();
  );*/
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const network = process.env.NETWORK;
  const provider = new ethers.providers.AlchemyProvider(
    network,
    `${process.env.ALCHEMY_API_KEY}`
  );
  const signer = wallet.connect(provider);
  const contractAddress = process.env.ESCROW_CONTRACT_ADDRESS;
  const abi = require("./contracts/PatchworkKingdomsEscrow.json");

  const escrowContract = new ethers.Contract(
    contractAddress,
    abi["abi"],
    signer
  );
  console.log("LISTENING & WAITING FOR EVENT");
  escrowContract.on(
    "Deposited",
    async (itemId, tokenAddress, tokenId, event) => {
      console.log(`...RECEIVED DEPOSIT: TOKENID ${tokenId}...`);
      console.log(event);
      const response = await handleRequest(event);
      console.log("Finished handling request");
      console.log(response);
      const lastMinPriceValue = await handleResponse(response);
      console.log("Finished handling response");
      console.log(lastMinPriceValue);
      // event.args array has the following value sequence see contract: (id, tokenAddress, tokenId)
      itemId = event.args[0].toNumber();
      escrowContract.setLastMinPrice(lastMinPriceValue, itemId);
      console.log("RETURN ITEM ID: " + itemId);
    }
  );
}

async function handleRequest(event) {
  console.log("Starting handling request");
  let options = {
    method: "GET",
    url: "https://deep-index.moralis.io/api/v2/nft/",
    params: { chain: "eth", format: "decimal" },
    headers: {
      accept: "application/json",
      "X-API-Key": process.env.MORALIS_API_KEY,
    },
  };
  // event.args array has the following value sequence see contract: (id, tokenAddress, tokenId)
  let address = event.args[1];

  // when testing on different net overwrite received value to get real results
  address = "0xd24a7c412f2279b1901e591898c1e96c140be8c5";
  let tokenId = event.args[2].toNumber();

  options.url = options.url
    .concat(address)
    .concat("/")
    .concat(tokenId)
    .concat("/transfers");

  let result = await axios(options);
  return result;
}

async function handleResponse(response) {
  console.log("Starting handling response");
  const data = await response.data;
  let lastMinPriceValue = 0;

  if (data.result == undefined || data.result.length == 0) {
    console.log("error no transaction found");
  } else {
    // sort all sales according to the their timestamps
    data.result.reduce((a, b) =>
      a.block_timestamp > b.block_timestamp ? a : b
    );
    // latest sale
    // lastMinPriceValue = data.result[0].value;
    // for testing 25000000000000000
    lastMinPriceValue = 1500000000000000n;
    console.log(`SETTING PRICE TO ${lastMinPriceValue}`);
  }
  return lastMinPriceValue;
}

main();

module.exports = {
  main,
  handleRequest,
  handleResponse,
};
