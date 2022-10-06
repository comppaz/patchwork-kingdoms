const { expect } = require("chai");
const chai = require("chai");
const { ethers } = require("hardhat");

describe("PatchworkKingdomEscrow", function () {
  
  let escrowContract;
  let testERC721token;
  
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;
  const tokenSupply = 100000000000000;

  this.beforeEach(async function () {
    const PatchworkKingdomEscrow = await ethers.getContractFactory("PatchworkKingdomEscrow");
    const TestERC721Token = await ethers.getContractFactory("ERC721TestToken");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    
    testERC721token = await TestERC721Token.deploy();
    escrowContract = await PatchworkKingdomEscrow.deploy(testERC721token.address);
  });

  describe("Deposit", function () {
    it("Should allow to deposit ERC721 compatible token.", async function () {
      let itemId = 0;
      let item = 1;
      let expiration = 1;
      let price = 1;
      const mintTx = await testERC721token.mint(owner.address, item);
      await mintTx.wait();
      
      expect(await testERC721token.ownerOf(item)).to.equal(owner.address);

      const approveERC721TokenTx = await testERC721token.approve(escrowContract.address, item);
      await approveERC721TokenTx.wait();

      const depositTx = await escrowContract.connect(owner).deposit(item, expiration, price);
      await depositTx.wait();

      await expect(depositTx).to.emit(escrowContract, 'Deposited').withArgs(itemId, price, testERC721token.address, item);
    });
  });


  describe("Donation", function () {
    it("Should allow to donate a specified price and to receive the respective token.", async function () {
      let itemId = 1;
      let item = 1;
      let expiration = 1;
      let price = 1;
      let minPrice = 0.5;

      const mintTx = await testERC721token.mint(escrowContract.address, item);
      await mintTx.wait();
      
      expect(await testERC721token.ownerOf(item)).to.equal(escrowContract.address);

      const approveERC721TokenTx = await testERC721token.approve(escrowContract.address, item);
      await approveERC721TokenTx.wait();

      const depositTx = await escrowContract.connect(owner).deposit(item, expiration, price);
      await depositTx.wait();

      await expect(depositTx).to.emit(escrowContract, 'Deposited').withArgs(itemId, price, testERC721token.address, item);
    });
  });
});
