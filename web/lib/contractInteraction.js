// setup
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { approveTransaction } from './testTokenInteraction';

const web3Wss = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_WSS_URL);
const web3 = createAlchemyWeb3(`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);

const contractAddress = process.env.NEXT_PUBLIC_ESCROW_DEPLOYMENT_ADDRESS;
const contractABI = require('../contracts/PatchworkKingdomsEscrow.json');
const escrowContract = new web3.eth.Contract(contractABI['abi'], contractAddress);
export const escrowContractWSS = new web3Wss.eth.Contract(contractABI['abi'], contractAddress);

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
                    status: 'Successfully logged in!',
                };
            } else {
                return {
                    address: '',
                    status: 'Connect to Metamask first.',
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
            status: 'You must install Metamask, a virtual Ethereum wallet, in your browser before connecting.',
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
    if (itemId === undefined || expiration === undefined) {
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

export const getItems = async () => {
    const items = await escrowContract.methods.getItems().call();
    let output = [];
    items.forEach((el, i) => {
        let item = {};
        if (el[1] !== '0x0000000000000000000000000000000000000000') {
            item.itemId = el.itemId;
            item.giver = el.giver;
            item.expiration = el.expiration;
            item.length = el.length;
            item.price = el.price;
            item.tokenId = el.tokenId;
            item.url = 'https://api.lorem.space/image/drink';
            output.push(item);
        }
    });
    return output;
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

    await approveTransaction(address, tokenId);

    const accountNonce = '0x' + ((await web3.eth.getTransactionCount(address)) + 2).toString(16);

    // start deposit transaction
    const depositParameter = {
        to: contractAddress,
        from: address,
        nonce: accountNonce,
        data: escrowContract.methods.deposit(tokenId, expiration).encodeABI(),
    };
    // sign the deposit transaction
    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [depositParameter],
        });
        console.log(txHash);
        return txHash;
    } catch (error) {
        return {
            status: 'Something went wrong: ' + error.message,
        };
    }
};

export const buy = async (address, itemId, price) => {
    console.log('START DONATION ITEM REQUEST');
    // check auth
    if (!window.ethereum || address === null) {
        return {
            status: 'Connect your Metamask wallet to donate your nft.',
        };
    }
    // check parameter to call contract methods!
    if (itemId === undefined) {
        return {
            status: 'Please insert valid parameters.',
        };
    }

    // start buy transaction
    const buyParameters = {
        to: contractAddress,
        from: address,
        value: price,
        data: escrowContract.methods.donation(itemId).encodeABI(),
    };
    console.log(buyParameters);
    // sign the deposit transaction
    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [buyParameters],
        });
        return txHash;
    } catch (error) {
        return {
            status: 'Something went wrong: ' + error.message,
        };
    }
};

export const subscribeToDepositEvent = async () => {
    console.log('SUBSCRIBIING TO EVENT?');
    escrowContractWSS.events.Deposited({}, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }
    });
};
