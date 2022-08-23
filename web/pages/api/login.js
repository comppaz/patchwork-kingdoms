import { ethers } from 'ethers';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

const web3 = createAlchemyWeb3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}`);

async function loginRoute(req, res) {
    console.log(`Received new login request: ${JSON.stringify(req.body)}`);

    const message = 'I want to login to Patchwork Kingdoms.';
    let actualAddress = ethers.utils.verifyMessage(message, req.body.signature).toLowerCase();

    if (actualAddress === req.body.account.toLowerCase()) {
        console.log('User is legit');

        const nfts = await web3.alchemy.getNfts({ owner: actualAddress, contractAddresses: [process.env.CONTRACT_ADDRESS] });

        let user = {
            isLoggedIn: true,
            account: actualAddress,
            totalNfts: nfts.totalCount,
        };

        req.session.user = user;
        await req.session.save();
        res.json(user);
    }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
