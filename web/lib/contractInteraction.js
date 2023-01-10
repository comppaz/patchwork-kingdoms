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

export const getItem = async itemId => {
    console.log('START GET ITEM REQUEST');
    const item = await escrowContract.methods.getItem(itemId).call();
    return item;
};

export const getItems = async () => {
    const items = await escrowContract.methods.getItems().call();
    let output = [];
    items.forEach((el, i) => {
        let item = {};
        // check giver of deposited item is a currently valid address and that the price is neither undefined nor zero
        if (el[1] !== '0x0000000000000000000000000000000000000000' || el[4] === 0 || el[4] === undefined) {
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
            message: 'Connect your Metamask wallet to donate your nft.',
        };
    }
    // check parameter to call contract methods!
    if (tokenId === undefined || expiration === undefined) {
        return {
            message: 'Please insert valid parameters.',
        };
    }

    //await approveTransaction(address, tokenId);

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
        return {
            message: 'The deposit request was successful.',
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
    // check if this caller is the one who donated the item!
    // TODO: Deactivated for testing
    /*
    const item = await getItem(itemId);
    if (item[1].toLowerCase() === address.toLowerCase()) {
        console.log('Giver equals address, purchasement will fail!');
        return {
            status: 'You previously donated this nft. You can't buy it!',
        };
    }*/
    // start buy transaction
    const buyParameters = {
        to: contractAddress,
        from: address,
        value: price,
        data: escrowContract.methods.donation(itemId).encodeABI(),
    };
    // sign the deposit transaction
    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [buyParameters],
        });
        console.log(txHash);
        return {
            message: 'The purchasement was successful!',
            status: true,
            txHash: txHash,
        };
    } catch (error) {
        return {
            message: 'Something went wrong: ' + error.message,
            status: false,
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
