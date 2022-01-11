const hre = require("hardhat");

async function main() {

    const PatchworkKingdoms = await hre.ethers.getContractFactory("PatchworkKingdoms");

    const contract = await PatchworkKingdoms.attach(process.env.CONTRACT_ADDRESS);

    if (process.env.NEW_OWNER && process.env.NEW_OWNER.length) {
        let tx = await contract.transferOwnership(process.env.NEW_OWNER);

        await tx.wait()

        console.log(`Ownership transferred to address: ${process.env.NEW_OWNER}`)

    } else {
        console.log('Please specify a NEW_OWNER in the .env file')
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});