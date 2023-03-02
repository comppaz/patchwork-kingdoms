import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../scripts/emailService';
import axios from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';

export default withIronSessionApiRoute(emailHandler, sessionOptions);

async function emailHandler(req: NextApiRequest, res: NextApiResponse) {
    /*
    console.log('EMAIL HANDLER KICKINGGG');
    const user = req.session.user;

    if (!user || user.isLoggedIn === false) {
        res.status(401).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only post request allowed' });
    }
    try {
        console.log('TRYING IN EMAIL HANDLING');
        const { typeId, parameter, txHash } = req.body;
        console.log(req.body);
        // check if txHash is valid for this contractAdress
        console.log(txHash);
        if (!checkIfTxLegit(txHash)) {
            return;
        }
        sendEmail(typeId, parameter);
        return res.status(200).json({ message: 'Contact Email Sent Successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({ message: errorMessage });
    }*/
}

async function checkIfTxLegit(txHash: string) {
    console.log(txHash);
    const response = await axios.get(
        `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
    );
    const result = response.data.result;
    console.log(response);
    if (result.from === process.env.NEXT_PUBLIC_ESCROW_DEPLOYMENT_ADDRESS) {
        return true;
    }
    return false;
}
