const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PatchworkKingdomEscrow", function () {
  let escrowContract;
  let testERC721token;

  let owner;
  let addr1;
  let addr2;
  let tokenId = 1;
  let depositedItemId = 0;
  // 1 month in seconds
  const expiration = 2629743;
  const itemKeys = ["giver", "tokenId", "expiration", "price", "isReady"];

  this.beforeAll(async function () {
    const PatchworkKingdomEscrow = await ethers.getContractFactory(
      "PatchworkKingdomsEscrow"
    );
    const TestERC721Token = await ethers.getContractFactory("ERC721TestToken");
    [owner, addr1, addr2] = await ethers.getSigners();

    testERC721token = await TestERC721Token.deploy();
    escrowContract = await PatchworkKingdomEscrow.deploy(
      testERC721token.address
    );
  });

  /**
   * make deposit preparation as mint based on current tokenId
   */
  async function prepareDeposit(_tokenId) {
    const mintTx = await testERC721token.mint(addr1.address);
    await mintTx.wait();

    expect(await testERC721token.ownerOf(_tokenId)).to.equal(addr1.address);
    const approveERC721TokenTx = await testERC721token
      .connect(addr1)
      .approve(escrowContract.address, _tokenId);
    await approveERC721TokenTx.wait();
  }

  describe("Deposit", function () {
    it("Should allow to deposit ERC721 compatible token.", async function () {
      await prepareDeposit(tokenId);
      const depositTx = await escrowContract
        .connect(addr1)
        .deposit(tokenId, expiration);
      await depositTx.wait();
      expect(await testERC721token.ownerOf(tokenId)).to.equal(
        escrowContract.address
      );

      await expect(depositTx)
        .to.emit(escrowContract, "Deposited")
        .withArgs(depositedItemId, testERC721token.address, tokenId);
    });
  });

  describe("Helper", function () {
    it("Should get item", async function () {
      const result = await escrowContract.getItem(depositedItemId);
      itemKeys.forEach((key) => {
        expect(Object.prototype.hasOwnProperty.call(result, key)).to.equal(
          true
        );
      });
    });

    it("Should get all items", async function () {
      let result = await escrowContract.getItems();
      expect(result.length).not.to.equal(0);
    });

    it("Should set last price", async function () {
      const lastMinPrice = ethers.utils.parseEther("0.01");
      await escrowContract.setLastMinPrice(lastMinPrice, depositedItemId);
      const result = await escrowContract.getItem(depositedItemId);

      expect(result.price - lastMinPrice).to.equal(0);
    });
  });

  describe("Donation", function () {
    it("Should allow to donate and to receive the respective token.", async function () {
      const offerPrice = "0.176";
      const wei = ethers.utils.parseEther(offerPrice);

      const donationTx = await escrowContract
        .connect(addr2)
        .donation(depositedItemId, { value: wei });
      await donationTx.wait();

      await expect(donationTx)
        .to.emit(escrowContract, "Donated")
        .withArgs(depositedItemId, wei, testERC721token.address, tokenId);
    });
  });

  describe("Admin Functions", function () {
    // before each a mint and deposit are needed
    it("Should cancel deposit", async function () {
      // increase tokenId and pointer
      tokenId++;
      depositedItemId++;
      // deposit a token before removing it
      await prepareDeposit(tokenId);
      await escrowContract.connect(addr1).deposit(tokenId, expiration);
      // after deposit contract address is the new owner of the token
      expect(await testERC721token.ownerOf(tokenId)).to.equal(
        escrowContract.address
      );

      // cancellation process
      const cancellationTx = await escrowContract
        .connect(owner)
        .cancelDeposit(depositedItemId);
      await cancellationTx.wait();

      // previous owner returns to be the owner of the token
      expect(await testERC721token.ownerOf(tokenId)).to.equal(addr1.address);
    });

    it("Should expire", async function () {
      // increase tokenId and pointer
      tokenId++;
      depositedItemId++;
      // deposit a token before removing it
      await prepareDeposit(tokenId);
      await escrowContract.connect(addr1).deposit(tokenId, expiration);
      // after deposit contract address is the new owner of the token
      expect(await testERC721token.ownerOf(tokenId)).to.equal(
        escrowContract.address
      );
      const _expiration = 1887643181;

      // expiration process
      const expirationTx = await escrowContract
        .connect(owner)
        .expiration(depositedItemId, _expiration);
      await expirationTx.wait();

      // previous owner returns to be the owner of the token
      expect(await testERC721token.ownerOf(tokenId)).to.equal(addr1.address);
    });

    it("Should withdraw correct amount.", async function () {
      const ownerBalanceBefore = await ethers.provider.getBalance(
        owner.address
      );
      const addressBalanceBefore = await ethers.provider.getBalance(
        escrowContract.address
      );
      await escrowContract.withdraw();
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      const addressBalanceAfter = await ethers.provider.getBalance(
        escrowContract.address
      );

      let diffOwner = Math.abs(
        ethers.utils.formatEther(ownerBalanceAfter) -
          ethers.utils.formatEther(ownerBalanceBefore)
      );

      let diffAddress = Math.abs(
        ethers.utils.formatEther(addressBalanceAfter) -
          ethers.utils.formatEther(addressBalanceBefore)
      );

      let difference = Math.abs(diffOwner - diffAddress).toFixed(3);

      expect(difference).to.equal("0.000");
    });
  });
});
