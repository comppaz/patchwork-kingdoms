// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PatchworkKingdomsEscrow {
    IERC721 token;
    uint256 counter;
    address payable private owner;

    struct ERC721Item {
        address giver;
        uint256 item;
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
        uint256 item
    );

    constructor(address _address) {
        token = IERC721(_address);
        counter = 0;
        owner = payable(msg.sender);
    }

    /**
    deposit function puts token in escrow 
    */
    function deposit(
        uint256 tokenId,
        uint256 _expiration
    ) public {
        require(
            msg.sender == token.ownerOf(tokenId),
            "Sender is not the token owner."
        );
        token.approve(address(this), tokenId);
        // transfer the item to escrow contract
        token.transferFrom(msg.sender, address(this), tokenId);
        uint256 itemId = counter;
        // update items with current deposited item
        items[itemId] = ERC721Item({
            giver: msg.sender,
            item: tokenId,
            // TODO: alternative for expiration: the calculation of the expiration_date is done in frontend and passed as parameter into this function
            expiration: block.timestamp + _expiration,
            price: 0
        });
        counter += 1;
        emit Deposited(itemId, address(token), tokenId);
    }

    /**
    setLastMinPrice function is called by the oracle service after the Deposited event has been triggered
    @param lastMinPrice: the value the oracle calculates 
    @param itemId: id of the deposited item
    */
    function setLastMinPrice(uint256 lastMinPrice, uint256 itemId) public view {
        ERC721Item memory item = items[itemId];
        item.price = lastMinPrice;
    }

    /**
    getItem function returns specific item
    @param itemId: id of the requested item
    */
    function getItem(uint256 itemId) public view returns(ERC721Item memory){
        ERC721Item memory item = items[itemId];
        return item;
    }

    /**
    donation function receives token from escrow by paying the price
    @param itemId: id of an existing item in items
    */
    function donation(uint256 itemId) public payable {
        ERC721Item memory item = items[itemId];
        // check price value
        require(
            msg.value > item.price,
            "The price value does not exceed or is equal to the minimum price."
        );
        // check expiration value
        // TODO: see above and below how to handle expiration
        require(block.timestamp <= item.expiration, "The token is expired.");
        token.transferFrom(address(this), msg.sender, item.item);
        delete(items[itemId]);
        emit Donated(itemId, msg.value, address(token), item.item);
    }

    /**
    cancelDeposit function allows the admin to cancel a deposit and transfer back the token to the giver
    @param itemId: id of an existing item in items
    */
    function cancelDeposit(uint256 itemId) public {
        ERC721Item memory item = items[itemId];
        require(
            msg.sender == owner,
            "Deposit can only be cancelled by the admin."
        );
        delete(items[itemId]);
        token.transferFrom(address(this), item.giver, item.item);
    }

    /**
    expiration function allows to return the deposited item back to the giver if the expiration time is exceeded
    @param itemId: id of an existing item in items
    */
    function expiration(uint256 itemId, uint256 _expiration) public {
        ERC721Item memory item = items[itemId];
        // TODO: expiration value could be verified with block.timestamp see above: depends on initial decision
        require(_expiration < item.expiration, "The token is not expired.");
        delete(items[itemId]);
        token.transferFrom(address(this), item.giver, item.item);
    }

    /**
    withdraw function allows the admin to withdraw the received eths on this address
    */
    function withdraw() public {
        require(
            msg.sender == owner,
            "Tokens can only be withdrawn by the admin."
        );
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "Failed to withdraw.");
    }
}
