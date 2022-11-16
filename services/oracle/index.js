const axios = require("axios");
const { ethers } = require("ethers");
const Web3 = require("web3");
require("dotenv").config();
const web3 = new Web3("HTTP://127.0.0.1:8545");

async function main() {
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://127.0.0.1:8545"
  );
  const signer = provider.getSigner();
  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_address",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Deposited",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Donated",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "itemId",
          type: "uint256",
        },
      ],
      name: "cancelDeposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_expiration",
          type: "uint256",
        },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "itemId",
          type: "uint256",
        },
      ],
      name: "donation",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "itemId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_expiration",
          type: "uint256",
        },
      ],
      name: "expiration",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "itemId",
          type: "uint256",
        },
      ],
      name: "getItem",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "giver",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "expiration",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
          ],
          internalType: "struct PatchworkKingdomsEscrow.ERC721Item",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "items",
      outputs: [
        {
          internalType: "address",
          name: "giver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "expiration",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_address",
          type: "address",
        },
      ],
      name: "setAddress",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "lastMinPrice",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "itemId",
          type: "uint256",
        },
      ],
      name: "setLastMinPrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const escrowContract = new ethers.Contract(contractAddress, abi, signer);
  console.log("LISTENING & WAITING FOR EVENT");
  escrowContract.on(
    "Deposited",
    async (itemId, tokenAddress, tokenId, event) => {
      const response = await handleRequest(event);
      const lastMinPriceValue = await handleResponse(response);
      // event.args array has the following value sequence see contract: (id, tokenAddress, tokenId)
      itemId = event.args[0].toNumber();
      escrowContract.setLastMinPrice(lastMinPriceValue, itemId);
    }
  );
}

async function handleRequest(event) {
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
  console.log("Received Deposit Event");
  let address = event.args[1];

  // when testing on different net overwrite received value to get real results
  // address = "0xd24a7c412f2279b1901e591898c1e96c140be8c5";
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
    lastMinPriceValue = data.result[0].value;
  }
  return lastMinPriceValue;
}

main();

module.exports = {
  main,
  handleRequest,
  handleResponse,
};
