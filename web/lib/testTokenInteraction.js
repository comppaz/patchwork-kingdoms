const { ethers } = require('ethers');
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { isSuccessfulTransaction, waitTransaction } from './checkApprovalStatus';

const tokenAddress = process.env.NEXT_PUBLIC_TESTTOKEN_DEPLOYMENT_ADDRESS;
const contractAddress = process.env.NEXT_PUBLIC_ESCROW_DEPLOYMENT_ADDRESS;
const tokenAbi = require('../contracts/ERC721TestToken.json');
const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_ETHERS_PRIVATE_KEY);
const network = 'goerli';
const provider = new ethers.providers.AlchemyProvider(network, `${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);
const signer = wallet.connect(provider);
const testERC721token = new ethers.Contract(tokenAddress, tokenAbi['abi'], signer);

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_HTTPS_URL);

const testERC721Token = new web3.eth.Contract(tokenAbi['abi'], tokenAddress);

export const approveTransaction = async (address, tokenId) => {
    const accountNonce = '0x' + ((await web3.eth.getTransactionCount(address)) + 1).toString(16);
    const approveParameter = {
        to: tokenAddress,
        from: address,
        nonce: accountNonce,
        data: testERC721Token.methods.approve(contractAddress, tokenId).encodeABI(),
    };
    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [approveParameter],
        });
        return {
            message: 'Your request was successful.',
            status: true,
            txHash: txHash,
        };
    } catch (error) {
        return {
            message: error.message,
            status: false,
        };
    }
};

export const mintTestToken = async address => {
    const accountNonce = '0x' + ((await web3.eth.getTransactionCount(address)) + 1).toString(16);
    const mintParameter = {
        to: tokenAddress,
        from: address,
        nonce: accountNonce,
        data: testERC721Token.methods.mint(address).encodeABI(),
    };

    const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [mintParameter],
    });

    return txHash;
};

export const getMaxMintedTokenId = async () => {
    const token = await testERC721token._tokenId();
    const hexValue = token._hex;
    return parseInt(hexValue, 16);
};

export const getOwnedTestNfts = async address => {
    let ownedNfts = [];
    const nfts = await web3.alchemy.getNfts({ owner: address, contractAddresses: tokenAddress });
    for (let nft of nfts.ownedNfts) {
        if (nft.contract.address === tokenAddress) {
            let tokenId = parseInt(nft['id']['tokenId'], 16);
            let object;
            if (process.env.PROD_FLAG) {
                object = {
                    tokenId: tokenId,
                    contractAddress: nft.contract.address,
                    imageUrl: `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.fra1.digitaloceanspaces.com/thumbnail/${tokenId}.png`,
                };
            } else {
                object = {
                    tokenId: tokenId,
                    contractAddress: nft.contract.address,
                    imageUrl: `https://api.lorem.space/image/drink`,
                };
            }
            ownedNfts.push(object);
        }
    }
    return ownedNfts;
};
