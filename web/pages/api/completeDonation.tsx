const { PrismaClient } = require('@prisma/client');
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { emailTypeMap } from '../../lib/emailService/setEmailContentDetails';
import { sendEmail } from '../../lib/emailService/emailService';
import checkIfTxLegit from '../../lib/txCheck';

const prisma = new PrismaClient();

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = req.session.user;

    if (!user || user.isLoggedIn === false) {
        res.status(401).end();
        return;
    }
    if (req.method === 'POST') {
        const { tokenId, txHash } = req.body;

        if (process.env.PROD_FLAG && !checkIfTxLegit(txHash)) {
            res.status(401).end();
            return;
        }

        const donationData = await prisma.DonatorInformation.findUnique({
            where: {
                donatedTokenId: Number(tokenId),
            },
        });

        let toSellerParams: ToSellerParams = {
            tokenId,
            receiver: donationData.email,
            itemDetails: '',
            dateOfListing: donationData.dateOfListing,
            timeframe: donationData.timeframe,
            listingPrice: donationData.minPrice,
        };

        await sendEmail(emailTypeMap.toSeller, toSellerParams);

        return res.status(200).json({ message: 'Purchase completed successfully!' });
    } else {
        return res.status(405).send({ message: 'Wrong message type was sent!' });
    }
}
