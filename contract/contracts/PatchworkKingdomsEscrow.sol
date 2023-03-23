// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

/*
  _____      _       _                       _      _  ___                 _                     
 |  __ \    | |     | |                     | |    | |/ (_)               | |                    
 | |__) |_ _| |_ ___| |____      _____  _ __| | __ | ' / _ _ __   __ _  __| | ___  _ __ ___  ___ 
 |  ___/ _` | __/ __| '_ \ \ /\ / / _ \| '__| |/ / |  < | | '_ \ / _` |/ _` |/ _ \| '_ ` _ \/ __|
 | |  | (_| | || (__| | | \ V  V / (_) | |  |   <  | . \| | | | | (_| | (_| | (_) | | | | | \__ \
 |_|   \__,_|\__\___|_| |_|\_/\_/ \___/|_|  |_|\_\ |_|\_\_|_| |_|\__, |\__,_|\___/|_| |_| |_|___/
                                                                  __/ |                          
                                                                 |___/                           
*/

/// @title Patchwork Kingdoms
/// @author GigaConnect
/// @notice Let's build a community of supporters for the Giga initiative and raise funds to bring reliable, robust connectivity to schools across the globe.

contract PatchworkKingdomsEscrow {
    IERC721 token;
    uint256 counter;
    address payable private owner;

    struct ERC721Item {
        uint256 itemId;
        address giver;
        uint256 tokenId;
        uint256 expiration;
        uint256 price;
        bool isReady;
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

    /// @notice The entry point of the contract.
    /// @param _address PWK's token address.
    constructor(address _address) {
        token = IERC721(_address);
        counter = 0;
        owner = payable(msg.sender);
    }

    /// @notice This is the public deposit function that puts a token into the escrow contract of the project and requires the sender to be the current owner.
    /// @param tokenId PWK's token Id to be donated.
    /// @param _expiration monthly timeframe after which the deposit will expire.
    function deposit(
        uint256 tokenId,
        uint256 _expiration
    ) public {
        require(
            msg.sender == token.ownerOf(tokenId),
            "Sender is not the token owner."
        );

        token.transferFrom(msg.sender, address(this), tokenId);
        uint256 itemId = counter;
        items[itemId] = ERC721Item({
            itemId: itemId,
            giver: msg.sender,
            tokenId: tokenId,
            expiration: block.timestamp + _expiration,
            price: 0.175 ether,
            isReady: false
        });
        counter += 1;
        emit Deposited(itemId, address(token), items[itemId].tokenId);
    }

    /// @notice This function is called by the oracle service after the Deposited event has been triggered. After setting the price, the isReady-Flag is updated.
    /// @param lastMinPrice This is the value the oracle calculates. 
    /// @param itemId This is the id of the deposited item.
    function setLastMinPrice(uint256 lastMinPrice, uint256 itemId) public {
        require(
            msg.sender == owner,
            "Last min price can only be set by an admin."
        );

        items[itemId].price = lastMinPrice;
        items[itemId].isReady = true;
    }

    /// @notice This function returns a specific item to be displayed.
    /// @param itemId This is the id of the requested item
    function getItem(uint256 itemId) public view returns(ERC721Item memory){
        ERC721Item memory item = items[itemId];
        return item;
    }

    /// @notice This function returns all items to be displayed.
    function getItems() public view returns(ERC721Item[] memory){
        ERC721Item[] memory allItems = new ERC721Item[](counter);
        for (uint256 i; i < counter; i++) allItems[i] = items[i];
        return allItems;
    }

    /// @notice This function sets other token address than Patchwork Kingdoms.
    /// @param _address This is the token's address
    function setAddress(address _address) public{
        token = IERC721(_address);
    }

    /// @notice This function returns the deposited token from escrow when the user exceeds the minimum price value.
    /// @param itemId This is the id of a deposited token in the escrow contract.
    function donation(uint256 itemId) public payable {
        ERC721Item memory item = items[itemId];

        require(
            msg.value > item.price,
            "The price value does not exceed or is equal to the minimum price."
        );
        require(items[itemId].isReady == true, "Item is not activated.");
        require(block.timestamp <= item.expiration, "The token is expired.");

        token.safeTransferFrom(address(this), msg.sender, item.tokenId);

        emit Donated(itemId, msg.value, address(token), item.tokenId);
        delete(items[itemId]);
    }

    /// @notice This function allows the admin to cancel a deposit and transfer back the token to the original token giver.
    /// @param itemId This is the id of a deposited token in the escrow contract.
    function cancelDeposit(uint256 itemId) public {
        ERC721Item memory item = items[itemId];

        require(
            msg.sender == owner,
            "Deposit can only be cancelled by the admin."
        );

        token.transferFrom(address(this), item.giver, item.tokenId);
        delete(items[itemId]);
    }

    /// @notice This function allows to return the deposited token back to the original giver if the expiration time is exceeded.
    /// @param itemId This is the id of a deposited token in the escrow contract.
    /// @param currentTimestamp This is the current timestamp.
    function expiration(uint256 itemId, uint256 currentTimestamp) public {
        ERC721Item memory item = items[itemId];

        require(
            (msg.sender == owner || msg.sender == item.giver),
            "Tokens can only be expired by the admin or the original token owner."
        );
        require(currentTimestamp >= item.expiration, "The token is not expired.");

        token.transferFrom(address(this), item.giver, item.tokenId);
        delete(items[itemId]);
    }

    /// @notice This function allows the admin to withdraw the received eths on this contract
    function withdraw() external {
        require(
            msg.sender == owner,
            "Tokens can only be withdrawn by the admin."
        );
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "Failed to withdraw.");
    }
}
