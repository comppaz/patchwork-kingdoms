// setup
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

const web3Wss = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_WSS_URL);
const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_HTTPS_URL);

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
    const item = await escrowContract.methods.getItem(itemId).call();
    return item;
};

export const getItems = async () => {
    const items = await escrowContract.methods.getItems().call();
    let output = [];
    items.forEach((el, i) => {
        let item = {};
        if (process.env.PROD_FLAG) {
            // make sure giver of deposited item is neither invalid nor the element is not ready nor that the price is neither undefined nor zero
            if (el.isReady) {
                item.itemId = el.itemId;
                item.giver = el.giver;
                item.expiration = el.expiration;
                item.length = el.length;
                item.price = el.price;
                item.tokenId = el.tokenId;
                item.imageUrl = `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.fra1.digitaloceanspaces.com/thumbnail/${el.tokenId}.png`;
                output.push(item);
            }
        } else {
            // check giver of deposited item is a currently valid address and that the price is neither undefined nor zero
            if (el.isReady) {
                item.itemId = el.itemId;
                item.giver = el.giver;
                item.expiration = el.expiration;
                item.length = el.length;
                item.price = el.price;
                item.tokenId = el.tokenId;
                item.imageUrl = 'https://api.lorem.space/image/drink';
                output.push(item);
            }
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
        let output = LinkOnToast('The deposit request was successful. Please wait for it to complete!', txHash);
        return {
            message: output,
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
    // check auth
    if (!window.ethereum || address === null) {
        return {
            message: 'Connect your Metamask wallet to buy the nft.',
        };
    }
    // check parameter to call contract methods!
    if (itemId === undefined) {
        return {
            message: 'Please insert valid parameters.',
        };
    }

    // check if this caller is the one who donated the item only in PROD
    if (process.env.PROD_FLAG) {
        const item = await getItem(itemId);
        if (item[1].toLowerCase() === address.toLowerCase()) {
            console.log('Giver equals address, purchasement will fail!');
            return {
                message: "You previously donated this nft. You can't buy it again!",
                status: false,
                txHash: txHash,
            };
        }
    }

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
        let output = LinkOnToast('The purchasement request was successful. Please wait for it to complete!', txHash);
        return {
            message: output,
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

export const subscribeToDepositEvent = async () => {
    escrowContractWSS.events.Deposited({}, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }
    });
};

const LinkOnToast = (output, txHash) => (
    <div>
        <p>{output}</p>
        <p>
            {' '}
            Check out your Transaction{' '}
            <a
                className=" text-indigo-700 underline"
                target="_blank"
                rel="noopener noreferrer"
                href={`${process.env.ETHERSCAN_URL}/tx/${txHash}`}>
                here
            </a>
        </p>
    </div>
);
