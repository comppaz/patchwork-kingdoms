const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Patchwork Kingdoms", function () {

  let contract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async () => {

    const PatchworkKingdoms = await ethers.getContractFactory("PatchworkKingdoms");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    contract = await PatchworkKingdoms.deploy()
    await contract.deployed()

  });

  it("Should mint the #1 NFT to artist wallet", async function () {

  });

  it("Should revert if sale is not active", async function () {

  });

  it("Should revert if amount of ether is wrong", async function () {

  });

  it("Should update the merkle tree", async function () {

  });

  it("Should revert if not on the whitelist", async function () {

  });

  it("Should mint if on the whitelist", async function () {

  });

});
