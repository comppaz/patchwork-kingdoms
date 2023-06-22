import { createAlchemyWeb3 } from '@alch/alchemy-web3';

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_HTTPS_URL);
const DEFAULT_INTERVAL = 500;

let blockWaiting = 20;
let timeoutId;

export function waitTransaction(txHash: string): Promise<any> {
    let transactionReceiptAsync = async function (txHash, resolve, reject) {
        try {
            let receipt = await web3.eth.getTransactionReceipt(txHash);
            if (!receipt || !receipt.blockNumber) {
                timeoutId = setTimeout(function () {
                    transactionReceiptAsync(txHash, resolve, reject);
                }, DEFAULT_INTERVAL);
            } else {
                clearTimeout(timeoutId);
                try {
                    let block = await web3.eth.getBlock(receipt.blockNumber);
                    let current = await web3.eth.getBlock('latest');
                    if (current.number - block.number >= blockWaiting && blockWaiting >= 0) {
                        let tx = await web3.eth.getTransaction(txHash);
                        if (tx.blockNumber != null) resolve(receipt);
                        else reject(new Error('Transaction with hash: ' + txHash + ' ended up in an uncle block.'));
                    } else {
                        blockWaiting--;
                        transactionReceiptAsync(txHash, resolve, reject);
                    }
                } catch (e) {
                    setTimeout(function () {
                        console.log('Some error occured');
                        transactionReceiptAsync(txHash, resolve, reject);
                    }, DEFAULT_INTERVAL);
                }
            }
        } catch (e) {
            reject(e);
        }
    };
    return new Promise(function (resolve, reject) {
        transactionReceiptAsync(txHash, resolve, reject);
    });
}
