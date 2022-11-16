const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
  let owner;
  let addr1;
  let addrs;
  let tokenId = 441;

  [owner, addr1, ...addrs] = await hre.ethers.getSigners();
  const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://127.0.0.1:8545"
  );
  const signer = provider.getSigner();
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const tokenAbi = [
    "function approve(address,uint256)",
    "function mint(address,uint256)",
    "function ownerOf(uint256)",
  ];
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
  const testERC721token = new ethers.Contract(tokenAddress, tokenAbi, signer);

  // prepare deposit
  await prepareDeposit(testERC721token, addr1, tokenId, escrowContract);
  console.log("START DEPOSIT EVENT");
  // deposit
  const depositTx = await escrowContract
    .connect(addr1)
    .deposit(tokenId, 2, { gasLimit: 30000000 });
  await depositTx.wait();
  console.log(await testERC721token.ownerOf(tokenId));
  console.log("DEPOSIT SUCCESSFUL");
}

async function prepareDeposit(testERC721token, addr1, tokenId, escrowContract) {
  // prepare deposit
  console.log(addr1);
  const mintTx = await testERC721token.mint(addr1.address, tokenId);
  await mintTx.wait();

  const approveERC721TokenTx = await testERC721token
    .connect(addr1)
    .approve(escrowContract.address, tokenId);
  await approveERC721TokenTx.wait();
  console.log("Current owner: ");
  console.log(await testERC721token.ownerOf(tokenId));
}

main();
