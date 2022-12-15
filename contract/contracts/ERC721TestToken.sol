// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721TestToken is ERC721, Ownable {
    uint256 public _tokenId = 1;

    constructor() ERC721("TESTERC721", "TSE") {
    }

    function mint(address _to) public {
        super._mint(_to, _tokenId);
        _tokenId++;
    }
}