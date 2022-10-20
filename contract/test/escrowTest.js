const { expect, assert, Assertion } = require("chai");
const chai = require("chai");
const { ethers } = require("hardhat");

describe("PatchworkKingdomEscrow", function () {
  let escrowContract;
  let testERC721token;

  let item;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let tokenId = 0;
  let itemId = 0;
  let expiration = 1;

  this.beforeAll(async function () {
    const PatchworkKingdomEscrow = await ethers.getContractFactory(
      "PatchworkKingdomsEscrow"
    );
    const TestERC721Token = await ethers.getContractFactory("ERC721TestToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    testERC721token = await TestERC721Token.deploy();
    escrowContract = await PatchworkKingdomEscrow.deploy(
      testERC721token.address
    );

    item = {
      giver: addr1,
      tokenId: tokenId,
      expiration: 1981787987,
      price: ethers.utils.parseEther("0.01"),
    };
  });

  /**
   * make deposit preparation as mint based on current tokenId
   */
  async function prepareDeposit() {
    const mintTx = await testERC721token.mint(addr1.address, tokenId);
    await mintTx.wait();

    expect(await testERC721token.ownerOf(tokenId)).to.equal(addr1.address);
    const approveERC721TokenTx = await testERC721token
      .connect(addr1)
      .approve(escrowContract.address, tokenId);
    await approveERC721TokenTx.wait();
  }

  describe("Deposit", function () {
    it("Should allow to deposit ERC721 compatible token.", async function () {
      await prepareDeposit();
      const depositTx = await escrowContract
        .connect(addr1)
        .deposit(tokenId, expiration);
      await depositTx.wait();
      expect(await testERC721token.ownerOf(tokenId)).to.equal(
        escrowContract.address
      );

      await expect(depositTx)
        .to.emit(escrowContract, "Deposited")
        .withArgs(itemId, testERC721token.address, tokenId);

      // increase tokenId and pointer after deposit for next calls
      tokenId++;
      itemId++;
    });
  });

  describe("Donation", function () {
    it("Should allow to donate and to receive the respective token.", async function () {
      // pointer to access the previously deposited token
      let _itemId = 0;
      let wei = ethers.utils.parseEther("0.01");

      const donationTx = await escrowContract
        .connect(addr2)
        .donation(_itemId, { value: wei });
      await donationTx.wait();

      await expect(donationTx)
        .to.emit(escrowContract, "Donated")
        .withArgs(_itemId, item.price, testERC721token.address, item.tokenId);
    });
  });

  describe("Helper", function () {
    it("Should get item", async function () {
      let itemId = 0;

      let result = await escrowContract.getItem(itemId);
      Object.keys(item).forEach((key) => {
        expect(result.hasOwnProperty(key)).to.equal(true);
      });
    });

    it("Should set last price", async function () {
      let lastMinPrice = ethers.utils.parseEther("0.01");
      let itemId = 0;
      await escrowContract.setLastMinPrice(lastMinPrice, itemId);
      let result = await escrowContract.getItem(itemId);

      expect(result.price - lastMinPrice).to.equal(0);
    });
  });

  describe("Admin Functions", function () {
    it("Should cancel deposit", async function () {
      // deposit a token before removing it
      await prepareDeposit();
      await escrowContract.connect(addr1).deposit(tokenId, expiration);
      // after deposit contract address is the new owner of the token
      expect(await testERC721token.ownerOf(tokenId)).to.equal(
        escrowContract.address
      );

      // cancellation process
      const cancellationTx = await escrowContract
        .connect(owner)
        .cancelDeposit(itemId);
      await cancellationTx.wait();

      // previous owner returns to be the owner of the token
      expect(await testERC721token.ownerOf(tokenId)).to.equal(addr1.address);

      // increase tokenId and pointer after process for next calls
      tokenId++;
      itemId++;
    });

    it("Should expire", async function () {
      // deposit a token before removing it
      await prepareDeposit();
      await escrowContract.connect(addr1).deposit(tokenId, expiration);
      // after deposit contract address is the new owner of the token
      expect(await testERC721token.ownerOf(tokenId)).to.equal(
        escrowContract.address
      );

      let _expiration = 2;

      // expiration process
      const expirationTx = await escrowContract
        .connect(owner)
        .expiration(itemId, _expiration);
      await expirationTx.wait();

      // previous owner returns to be the owner of the token
      expect(await testERC721token.ownerOf(tokenId)).to.equal(addr1.address);

      // increase tokenId and pointer after process for next calls
      tokenId++;
      itemId++;
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
