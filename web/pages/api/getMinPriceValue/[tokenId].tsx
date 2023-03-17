import { NextApiRequest, NextApiResponse } from 'next';
const axios = require('axios');

export default async function getMinPriceValue(req: NextApiRequest, res: NextApiResponse) {
    let options = {
        method: 'GET',
        url: 'https://deep-index.moralis.io/api/v2/nft/',
        params: { chain: 'eth', format: 'decimal' },
        headers: {
            accept: 'application/json',
            'X-API-Key': process.env.MORALIS_API_KEY,
        },
    };
    const { tokenId } = req.query;
    const tokenAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    options.url = options.url.concat(tokenAddress).concat('/').concat(tokenId.toString()).concat('/transfers');
    let response = await axios(options);
    const data = await response.data;
    let lastMinPriceValue = 0;
    if (data.result == undefined || data.result.length == 0) {
        console.log('error no transaction found');
    } else {
        // sort all sales according to the their timestamps
        data.result.reduce((a, b) => (a.block_timestamp > b.block_timestamp ? a : b));
        // latest sale
        if (process.env.PROD_FLAG) {
            lastMinPriceValue = data.result[0].value;
        } else {
            // Overwrite for testing
            lastMinPriceValue = 1500000000000000;
        }
    }
    return res.send({ status: 200, message: lastMinPriceValue });
}
