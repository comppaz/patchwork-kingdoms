const { ethers } = require("ethers");
require("dotenv").config();

const tokenAddress = "0xDFAE561b53206764eCee36C6f0b71D8a52037ffE";
const tokenAbi = [
  "function approve(address,uint256)",
  "function mint(address)",
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
    "0x3112aF4cE798B63A1f6B318BA4CB50a2Ee248971"
  );
  mintTx.wait();
  console.log(mintTx);
  console.log(
    `Your transaction is confirmed, its receipt is: ${mintTx.transactionHash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
