const hre = require("hardhat");

async function main() {

    const PatchworkKingdoms = await hre.ethers.getContractFactory("PatchworkKingdoms");

    const contract = await PatchworkKingdoms.attach(process.env.CONTRACT_ADDRESS);

    let tx = await contract.setBaseUrl(process.env.BASE_URL);

    await tx.wait()

    console.log(`Base Url was set: ${tx.hash}`)

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});