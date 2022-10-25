const axios = require("axios");
const contract = require("@truffle/contract");
const Web3 = require("web3");
require("dotenv").config();

// TODO: change ip address to actual provider
const web3 = new Web3(
  new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545")
);
const OracleContract = require("../../contract/artifacts/contracts/PatchworkKindomsEscrow.sol/PatchworkKingdomsEscrow.json");
const oracleContract = contract(OracleContract);
oracleContract.setProvider(web3.currentProvider);

const options = {
  method: "GET",
  url: "https://deep-index.moralis.io/api/v2/nft/",
  params: { chain: "eth", format: "decimal" },
  headers: {
    accept: "application/json",
    "X-API-Key": process.env.MORALIS_API_KEY,
  },
};
web3.eth.getAccounts(async (err, accounts) => {
  const deployedContractInstance = await oracleContract.deployed();
  deployedContractInstance.contract.events
    ?.Deposited()
    .on("data", async function (event) {
      console.log("Received Deposit Event");
      let itemId = event.returnValues.id;
      // TODO: Token Address != Smart Contract Address
      let contractAddress = event.returnValues.tokenAddress;
      let tokenId = event.returnValues.tokenId;
      options.url = options.url
        .concat(contractAddress)
        .concat("/")
        .concat(tokenId)
        .concat("/transfers");

      const response = await axios(options);
      const data = await response.data;
      console.log("ALL SALES");
      console.log(data);
      let lastMinPriceValue = 0;

      if (data.result == undefined || data.result.length == 0) {
        console.log("error no transaction found");
      } else {
        // sort all sales according to the their timestamps
        data.result.reduce((a, b) =>
          a.block_timestamp > b.block_timestamp ? a : b
        );
        // latest sale
        console.log(data.result[0].value);
        lastMinPriceValue = data.result[0].value;
      }

      await deployedContractInstance.setLastMinPrice(
        lastMinPriceValue,
        itemId,
        { from: accounts[0] }
      );
    });
});
