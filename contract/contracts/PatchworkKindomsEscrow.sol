// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract PatchworkKingdomsEscrow {
    IERC721 token;
    uint256 counter;
    // TODO: so richtig?
    //address payable public owner;

    struct ERC721Item {
        address donatorGiver;
        uint256 item;
        uint256 expiration;
        uint256 price;
    }

    mapping(uint256 => ERC721Item) public items;

    event Deposited(
        uint256 id,
        uint256 price,
        address tokenAddress,
        uint256 item
    );
    event Donated(
        uint256 id,
        uint256 price,
        address tokenAddress,
        uint256 item
    );

    constructor(IERC721 _token) {
        token = _token;
        counter = 0;
    }

    /**
    deposit function puts token in escrow 
    */
    function deposit(
        uint256 _item,
        uint256 _expiration,
        uint256 _price
    ) public {
        require(
            msg.sender == token.ownerOf(_item),
            "Sender is not the token owner."
        );
        // transfer the item to escrow contract
        token.transferFrom(msg.sender, address(this), _item);
        uint256 itemId = counter;
        // update items with current deposited item
        items[itemId] = ERC721Item({
            donatorGiver: msg.sender,
            item: _item,
            expiration: block.timestamp + _expiration,
            price: _price
        });
        counter += 1;
        emit Deposited(itemId, _price, address(token), _item);
    }

    /**
    donation function receives token from escrow by paying the price
    @param itemId: id of an existing item in items
    @param _price: price the donatorBuyer wants to pay, must be minimum the price set by donatorGiver
    */
    function donation(uint256 itemId, uint256 _price) public {
        ERC721Item memory item = items[itemId];
        // check price value
        require(
            _price > item.price,
            "The price value does not exceed or is equal to the minimum price."
        );
        // check expiration value
        require(block.timestamp <= item.expiration, "The token is expired.");
        token.transferFrom(address(this), msg.sender, item.item);
        emit Donated(itemId, _price, address(token), item.item);
    }

    // TODO: should the admin have the right to cancel a deposit?
    /**
    cancelDeposit function allows the admin to cancel a deposit and transfer back the token to the donatorGiver
    
    function cancelDeposit(uint256 itemId) public {
        ERC721Item memory item = items[itemId];
        require(
            msg.sender == owner,
            "Trade can only be cancelled by the admin."
        );
        token.transferFrom(address(this), item.donatorGiver, item.item);
    }*/
}
