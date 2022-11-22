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

async function main() {
  const mintTx = await testERC721token.mint(
    "0x3112aF4cE798B63A1f6B318BA4CB50a2Ee248971",
    12
  );
  mintTx.wait();
  console.log(
    `Your transaction is confirmed, its receipt is: ${mintTx.transactionHash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
