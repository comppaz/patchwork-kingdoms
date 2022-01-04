const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const whitelist = require('../data/whitelist.json');

async function generateMerkleRoot() {

    const leafNodes = whitelist.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    return merkleTree.getHexRoot();

}

module.exports = generateMerkleRoot;