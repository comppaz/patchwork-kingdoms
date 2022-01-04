const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

describe("Patchwork Kingdoms", function () {

  let contract;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;
  let whitelist;
  let merkleTree;

  function computeProof(address) {
    const hashedAddress = keccak256(address);
    return merkleTree.getHexProof(hashedAddress);
  }

  beforeEach(async () => {

    const PatchworkKingdoms = await ethers.getContractFactory("PatchworkKingdoms");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    contract = await PatchworkKingdoms.deploy(addr1.address)
    await contract.deployed()

    whitelist = [addr1.address, addr2.address];
    const hashedAddresses = whitelist.map(addr => keccak256(addr));
    merkleTree = new MerkleTree(hashedAddresses, keccak256, { sortPairs: true });

    await contract.setMerkleRoot(merkleTree.getHexRoot())

  });

  it("Should be named correctly", async function () {
    expect(await contract.name()).to.equal("PatchworkKingdoms");
    expect(await contract.symbol()).to.equal("PWKD");
  });

  it("Should set the right owner", async function () {
    expect(await contract.owner()).to.equal(owner.address);
  });

  it("Should return the correct metadata url if set", async function () {

    let metadataUri = await contract.tokenURI(1)
    expect(metadataUri).to.equal('');

    await contract.setBaseUrl("https://example.com/")

    metadataUri = await contract.tokenURI(1)

    expect(metadataUri).to.equal("https://example.com/1");

  });

  it("Should mint the #1 NFT to artist wallet", async function () {
    expect(await contract.ownerOf(1)).to.equal(addr1.address);
  });

  it("Should revert if sale is not active", async function () {
    const proof = computeProof(addr1.address)
    await expect(contract.connect(addr1).mint(proof)).to.be.revertedWith("whitelist sale not active");
  });

  it("Should revert if not on whitelist", async function () {
    const proof = computeProof(addr3.address);
    await contract.toggleWhitelistSaleState();
    await expect(contract.connect(addr3).mint(proof)).to.be.revertedWith("sender not on the whitelist");
    await expect(contract.connect(addr2).mint(proof)).to.be.revertedWith("sender not on the whitelist");
  });

  it("Should revert if amount of ether is wrong", async function () {
    const proof = computeProof(addr1.address);
    await contract.toggleWhitelistSaleState();
    await expect(contract.connect(addr1).mint(proof)).to.be.revertedWith("amount sent is incorrect");
  });

  it("Should update the merkle tree", async function () {

    whitelist = [addr2.address, addr3.address];
    const hashedAddresses = whitelist.map(addr => keccak256(addr));
    merkleTree = new MerkleTree(hashedAddresses, keccak256, { sortPairs: true });

    await contract.setMerkleRoot(merkleTree.getHexRoot());

    const proof = computeProof(addr1.address);
    await contract.toggleWhitelistSaleState();

    await expect(contract.connect(addr1).mint(proof)).to.be.revertedWith("sender not on the whitelist")

  });

  it("Should mint if on the whitelist", async function () {

    let wei = ethers.utils.parseEther("0.175")
    let tokenId = 2;

    let overrides = {
      nonce: addr1.getTransactionCount(),
      value: wei,
    };

    const proof = computeProof(addr1.address);

    await contract.setBaseUrl("https://example.com/")
    await contract.toggleWhitelistSaleState();

    let tx = await contract.connect(addr1).mint(proof, overrides)

    await tx.wait()


    let metadataUri = await contract.tokenURI(tokenId)

    expect(metadataUri).to.equal("https://example.com/" + tokenId);
    expect(await contract.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address)

    overrides.nonce = addr1.getTransactionCount()

    await expect(contract.connect(addr1).mint(proof, overrides)).to.be.revertedWith("sender already claimed");

  });

  it("Should ignore whitelist if public sale is active", async function () {

    let wei = ethers.utils.parseEther("0.175")
    let tokenId = 2;

    let overrides = {
      nonce: addr3.getTransactionCount(),
      value: wei,
    };

    const proof = computeProof(addr3.address);

    await contract.setBaseUrl("https://example.com/")
    await contract.togglePublicSaleState();

    let tx = await contract.connect(addr3).mint(proof, overrides)

    await tx.wait()

    let metadataUri = await contract.tokenURI(tokenId)

    expect(metadataUri).to.equal("https://example.com/" + tokenId);
    expect(await contract.connect(addr3).ownerOf(tokenId)).to.equal(addr3.address)

  });

  it("Should withdraw correct amount of ether to owner address", async function () {

    let wei = ethers.utils.parseEther("0.175")

    let overrides = {
      nonce: addr1.getTransactionCount(),
      value: wei,
    };

    const proof = computeProof(addr1.address);

    await contract.toggleWhitelistSaleState();

    let tx = await contract.connect(addr1).mint(proof, overrides)

    await tx.wait()

    await expect(contract.connect(addr1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner")

    const balanceBefore = await ethers.provider.getBalance(owner.address);
    await contract.withdraw()
    const balanceAfter = await ethers.provider.getBalance(owner.address);

    let diff = ethers.utils.formatEther(balanceAfter) - ethers.utils.formatEther(balanceBefore)

    expect(diff.toFixed(3)).to.equal('0.175');

  });

});
