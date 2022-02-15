const hre = require("hardhat");
const generateMerkleRoot = require("./generateMerkleRoot");

async function main() {

    const PatchworkKingdoms = await hre.ethers.getContractFactory("PatchworkKingdoms");

    const contract = await PatchworkKingdoms.attach(process.env.CONTRACT_ADDRESS);

    let merkleRoot = await generateMerkleRoot();

    let tx = await contract.setMerkleRoot(merkleRoot);

    await tx.wait()

    console.log(`Set merkle root to ${merkleRoot.toString('hex')}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
