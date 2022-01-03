//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";

contract PatchworkKingdoms is ERC721, Ownable {
    bool private _whitelistSaleIsActive = false;
    bool private _publicSaleIsActive = false;

    string private _baseUrl;
    uint256 private _tokenId = 2;
    bytes32 private _merkleRoot;

    mapping(address => bool) private _claimed;

    constructor(address artist) ERC721("PatchworkKingdoms", "PWKD") {
        _mint(artist, 1);
    }

    function mint(bytes32[] calldata merkleProof) external payable {
        if (!_publicSaleIsActive) {
            require(
                _whitelistSaleIsActive,
                "The whitelist sale is not active yet."
            );
            require(onWhitelist(merkleProof), "You're not on the whitelist.");
            require(!_claimed[msg.sender], "You already got your chance.");
        }

        require(_tokenId <= 999, "We're out of tokens.");
        require(
            msg.value == 0.175 ether,
            "The amount of ether sent is incorrect."
        );

        _mint(msg.sender, _tokenId);
        _tokenId++;
        _claimed[msg.sender] = true;
    }

    // PRIVATE (READ_ONLY)
    function onWhitelist(bytes32[] calldata merkleProof)
        internal
        view
        returns (bool)
    {
        return
            MerkleProof.verify(
                merkleProof,
                _merkleRoot,
                keccak256(abi.encodePacked(msg.sender))
            );
    }

    // PUBLIC (READ_ONLY)
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseUrl;
    }

    // ADMIN FUNCTIONS
    function toggleWhitelistSaleState() external onlyOwner {
        _whitelistSaleIsActive = !_whitelistSaleIsActive;
    }

    function togglePublicSaleState() external onlyOwner {
        _publicSaleIsActive = !_publicSaleIsActive;
    }

    function setMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        _merkleRoot = merkleRoot;
    }

    function setBaseUrl(string memory url) external onlyOwner {
        _baseUrl = url;
    }

    function withdraw() external onlyOwner {
        (bool sent, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(sent, "Failed to withdraw balance");
    }
}
