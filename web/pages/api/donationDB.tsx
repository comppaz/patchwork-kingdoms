const { PrismaClient } = require('@prisma/client');
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = req.session.user;

    if (!user || user.isLoggedIn === false) {
        res.status(401).end();
        return;
    }
    if (req.method === 'POST') {
        try {
            const { nftId, donatorMail, currentDate, timeframe, minPrice, address } = req.body;
            const result = await prisma.DonatorInformation.upsert({
                where: {
                    donatedTokenId: nftId,
                },
                create: {
                    donatedTokenId: nftId,
                    email: donatorMail,
                    dateOfListing: currentDate,
                    timeframe: timeframe,
                    minPrice: minPrice,
                    address: address,
                },
                update: {
                    email: donatorMail,
                    dateOfListing: currentDate,
                    timeframe: timeframe,
                    minPrice: minPrice,
                    address: address,
                },
            });
            console.log(result);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error occured when trying to update data.' });
        }
    } else {
        return res.status(405).send({ message: 'Wrong message type was sent!' });
    }
}
