const { ethers } = require('ethers');
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

const tokenAddress = process.env.NEXT_PUBLIC_TESTTOKEN_DEPLOYMENT_ADDRESS;
const contractAddress = process.env.NEXT_PUBLIC_ESCROW_DEPLOYMENT_ADDRESS;
const tokenAbi = require('../../contract/artifacts/contracts/ERC721TestToken.sol/ERC721TestToken.json');
const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_ETHERS_PRIVATE_KEY);
const network = 'goerli';
const provider = new ethers.providers.AlchemyProvider(network, `${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);
const signer = wallet.connect(provider);
const testERC721token = new ethers.Contract(tokenAddress, tokenAbi['abi'], signer);
const web3 = createAlchemyWeb3(`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);

export const approveTransaction = async (address, tokenId) => {
    console.log('APPROVE TRANSACTION');
    const approveTx = await testERC721token.approve(contractAddress, tokenId, {
        gasLimit: 2400000,
    });
    try {
        await approveTx.wait();
    } catch (error) {
        if (error.code === ethers.errors.TRANSACTION_REPLACED) {
            console.log('Transaction was replaced');
            return 'Transaction was replaced';
        }
    }
};

export const mintTestToken = async address => {
    console.log('MINT TOKEN');
    const mintTx = await testERC721token.mint(address);
    mintTx.wait();
    return mintTx;
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
            let object = {
                tokenId: tokenId,
                contractAddress: nft.contract.address,
                url: 'https://api.lorem.space/image/drink',
            };
            ownedNfts.push(object);
        }
    }
    return ownedNfts;
};
