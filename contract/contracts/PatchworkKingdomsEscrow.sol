// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract PatchworkKingdomsEscrow {
    IERC721 token;
    uint256 counter;
    address payable private owner;
    address private admin;

    struct ERC721Item {
        address giver;
        uint256 tokenId;
        uint256 expiration;
        uint256 price;
    }

    mapping(uint256 => ERC721Item) public items;

    event Deposited(
        uint256 id,
        address tokenAddress,
        uint256 tokenId
    );
    event Donated(
        uint256 id,
        uint256 price,
        address tokenAddress,
        uint256 tokenId
    );

    constructor(address _address, address _admin) {
        require(_address.supportsInterface("0x80ac58cd"));
        token = IERC721(_address);
        counter = 0;
        owner = payable(msg.sender);
        admin = _admin;
    }

    modifier onlyAllowed() {
        require(msg.sender == owner || msg.sender == admin || "not allowed");
        _;
    }

    /**
    deposit function puts token in escrow 
    */
    function deposit(
        uint256 tokenId,
        uint256 _expiration
    ) external {
        require(
            msg.sender == token.ownerOf(tokenId),
            "Sender is not the token owner."
        );
        // transfer the item to escrow contract
        token.transferFrom(msg.sender, address(this), tokenId);
        uint256 itemId = counter;
        // update items with current deposited item
        items[itemId] = ERC721Item({
            giver: msg.sender,
            tokenId: tokenId,
            expiration: block.timestamp + _expiration,
            price: 0
        });
        counter += 1;
        emit Deposited(itemId, address(token), items[itemId].tokenId);
    }

    /**
    setLastMinPrice function is called by the oracle service after the Deposited event has been triggered
    @param lastMinPrice: the value the oracle calculates 
    @param itemId: id of the deposited item
    */
    function setLastMinPrice(uint256 lastMinPrice, uint256 itemId) external {
        items[itemId].price = lastMinPrice;
    }

    /**
    getItem function returns specific item
    @param itemId: id of the requested item
    */
    function getItem(uint256 itemId) external view returns(ERC721Item memory){
        ERC721Item memory item = items[itemId];
        return item;
    }

    /**
    setAddress function sets other token address than Patchwork Kingdoms
    @param _address: address of the token
    */
    function setAddress(address _address) external onlyAllow{
        require(_address.supportsInterface("0x80ac58cd"));
        token = IERC721(_address);
    }

    /**
    donation function receives token from escrow by paying the price
    @param itemId: id of an existing item in items
    */
    function donation(uint256 itemId) external payable {
        ERC721Item memory item = items[itemId];
        // check price value
        require(
            msg.value > item.price,
            "The price value does not exceed or is equal to the minimum price."
        );
        // check expiration value
        require(block.timestamp > item.expiration, "The token is expired.");
        token.safeTransferFrom(address(this), msg.sender, item.tokenId);
        emit Donated(itemId, msg.value, address(token), item.tokenId);
        delete(items[itemId]);
    }

    /**
    cancelDeposit function allows the admin to cancel a deposit and transfer back the token to the giver
    @param itemId: id of an existing item in items
    */
    function cancelDeposit(uint256 itemId) external onlyAllow {
        ERC721Item memory item = items[itemId];
        require(
            msg.sender == owner,
            "Deposit can only be cancelled by the admin."
        );
        token.transferFrom(address(this), item.giver, item.tokenId);
        delete(items[itemId]);
    }

    /**
    expiration function allows to return the deposited item back to the giver if the expiration time is exceeded
    @param itemId: id of an existing item in items
    */
    function expiration(uint256 itemId, uint256 _expiration) external {
        ERC721Item memory item = items[itemId];
        require(msg.sender == owner || msg.sender == admin || msg.sender == item.giver);
        require(_expiration < item.expiration, "The token is not expired.");
        token.transferFrom(address(this), item.giver, item.tokenId);
        delete(items[itemId]);
    }

    /**
    withdraw function allows the admin to withdraw the received eths on this address
    */
    function withdraw() external onlyAllow {
        require(
            msg.sender == owner,
            "Tokens can only be withdrawn by the admin."
        );
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "Failed to withdraw.");
    }
}
