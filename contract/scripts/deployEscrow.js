// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const pwkAddress = "0xd24a7c412f2279b1901e591898c1e96c140be8c5";
  const PatchworkKingdomsEscrow = await hre.ethers.getContractFactory(
    "PatchworkKingdomsEscrow"
  );
  const TestERC721Token = await hre.ethers.getContractFactory(
    "ERC721TestToken"
  );
  const testERC721token = await TestERC721Token.deploy();

  const testTokenAddress = "0xc1794a6682683052c446ab4cfd78a8990b2ab0e1";

  // TODO: change to pwkAddress when deploying on same net
  const patchworkKingdomsEscrow = await PatchworkKingdomsEscrow.deploy(
    testTokenAddress
  );

  await patchworkKingdomsEscrow.deployed();

  console.log(`deployed to ${patchworkKingdomsEscrow.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
