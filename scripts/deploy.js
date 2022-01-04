const hre = require("hardhat");

async function main() {

  if (!process.env.ARTIST_ADDRESS) {
    throw Error('Artist address not set as environment variable.')
  }

  const PatchworkKingdoms = await hre.ethers.getContractFactory("PatchworkKingdoms");
  const contract = await PatchworkKingdoms.deploy(process.env.ARTIST_ADDRESS);

  await contract.deployed();

  console.log("Patchwork Kingdoms deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
