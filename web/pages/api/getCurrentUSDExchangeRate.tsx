import { NextApiRequest, NextApiResponse } from 'next';

export default async function getCurrentUSDExchangeRate(req: NextApiRequest, res: NextApiResponse) {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
    const options = {
        method: 'GET',
    };

    const response = await fetch(url, options);
    const result = await response.json();
    res.json(result.ethereum.usd);
}
