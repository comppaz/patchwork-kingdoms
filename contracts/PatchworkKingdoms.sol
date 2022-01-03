//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract PatchworkKingdoms is ERC721 {
    constructor() ERC721("PatchworkKingdoms", "PWKD") {}
}
