const { ethers } = require("ethers");
require("dotenv").config();

const tokenAddress = "0x4C32D7bf64a21cC6fF47e0D55F7F81a7e9Dcb4f0";
const tokenAbi = [
  "function approve(address,uint256)",
  "function mint(address,uint256)",
  "function ownerOf(uint256)",
];
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const network = "goerli";
const provider = new ethers.providers.AlchemyProvider(
  network,
  `${process.env.ALCHEMY_API_KEY}`
);
const signer = wallet.connect(provider);
const testERC721token = new ethers.Contract(tokenAddress, tokenAbi, signer);

testERC721token
  .approve("0xFe721a433b0a0Bcd306e62B82ba9ab3e8a13a877", 13, {
    gasLimit: 2000000,
  })
  .then((tx) => tx.wait(5))
  .then((receipt) =>
    console.log(
      `Your transaction is confirmed, its receipt is: ${receipt.transactionHash}`
    )
  )
  .catch((e) => console.error(e));
