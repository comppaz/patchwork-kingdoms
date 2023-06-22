import axios from 'axios';

export default async function checkIfTxLegit(txHash: string) {
    const response = await axios.get(
        `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${process.env.ETHERSCAN_API_KEY}`,
    );
    const result = response.data.result;

    if (result && result.from === process.env.NEXT_PUBLIC_ESCROW_DEPLOYMENT_ADDRESS) {
        return true;
    }
    return false;
}
