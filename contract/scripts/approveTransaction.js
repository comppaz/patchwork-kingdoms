const { ethers } = require("ethers");
require("dotenv").config();

const walletAddress = "0x3112aF4cE798B63A1f6B318BA4CB50a2Ee248971";
const contractAddress = "0x44aea1977fD9ccAaDF2cAE0B743fda0F42d9BD4B";
const tokenAddress = "0xDFAE561b53206764eCee36C6f0b71D8a52037ffE";
const tokenAbi = [
  "function approve(address,uint256)",
  "function mint(uint256)",
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
  const approveTx = await testERC721token.approve(contractAddress, 12, {
    gasLimit: 2000000,
  });
  approveTx.wait();
  console.log(
    `Your transaction is confirmed, its receipt is: ${approveTx.transactionHash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
