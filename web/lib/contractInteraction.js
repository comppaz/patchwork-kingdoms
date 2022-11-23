// setup
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

const web3 = createAlchemyWeb3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`);

const contractAddress = '0xFe721a433b0a0Bcd306e62B82ba9ab3e8a13a877';
const contractABI = require('../../contract/artifacts/contracts/PatchworkKingdomsEscrow.sol/PatchworkKingdomsEscrow.json');
export const escrowContract = new web3.eth.Contract(contractABI['abi'], contractAddress);

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            const obj = {
                status: 'Status Output will be shown here',
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: '',
                status: err.message,
            };
        }
    } else {
        return {
            address: '',
            status: '',
        };
    }
};

export const getConnectedWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: 'eth_accounts',
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: 'Output will follow here.',
                };
            } else {
                return {
                    address: '',
                    status: 'Connect to Metamask using the top right button.',
                };
            }
        } catch (err) {
            return {
                address: '',
                status: err.message,
            };
        }
    } else {
        return {
            address: '',
            status: '',
        };
    }
};

export const getItem = async (address, itemId) => {
    console.log('START GET ITEM REQUEST');
    // check auth
    if (!window.ethereum || address === null) {
        return {
            status: 'Connect your Metamask wallet to donate your nft.',
        };
    }

    // check parameter to call contract methods!
    if (tokenId === undefined || expiration === undefined) {
        return {
            status: 'Please insert valid parameters.',
        };
    }

    // start get transaction
    const getParameters = {
        to: contractAddress,
        from: address,
        data: escrowContract.methods.getItem(itemId).encodeABI(),
    };

    // sign the get transaction
    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [getParameters],
        });

        return {
            status: 'The Get Request was successful with thte following Transaction Hash ' + txHash,
        };
    } catch (error) {
        return {
            status: 'Something went wrong: ' + error.message,
        };
    }
};

export const deposit = async (address, tokenId, expiration) => {
    console.log('START DEPOSIT ITEM REQUEST');
    // check auth
    if (!window.ethereum || address === null) {
        return {
            status: 'Connect your Metamask wallet to donate your nft.',
        };
    }
    // check parameter to call contract methods!
    if (tokenId === undefined || expiration === undefined) {
        return {
            status: 'Please insert valid parameters.',
        };
    }

    // start deposit transaction
    const depositParameter = {
        to: contractAddress,
        from: address,
        data: escrowContract.methods.deposit(tokenId, expiration).encodeABI(),
    };
    console.log(depositParameter);
    // sign the deposit transaction
    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [depositParameter],
        });
        console.log(txHash);
        return {
            status: 'Your Deposit was signed successfully!',
        };
    } catch (error) {
        return {
            status: 'Something went wrong: ' + error.message,
        };
    }
};
