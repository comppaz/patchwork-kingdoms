const hre = require("hardhat");

async function main() {

    const PatchworkKingdoms = await hre.ethers.getContractFactory("PatchworkKingdoms");

    const contract = await PatchworkKingdoms.attach(process.env.CONTRACT_ADDRESS);

    let tx = await contract.toggleWhitelistSaleState();

    await tx.wait()

    console.log(`Whitelist sale activated.`)

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});