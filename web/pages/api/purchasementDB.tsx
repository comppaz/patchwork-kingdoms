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
            const { tokenId, purchaserMail, currentDate, salePrice, minPrice } = req.body;
            const result = await prisma.PurchaserInformation.create({
                data: {
                    purchasedTokenId: tokenId,
                    email: purchaserMail,
                    dateOfSale: currentDate,
                    salePrice: salePrice,
                    minPrice: minPrice,
                },
            });
            console.log(result);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error occured when trying to update data.' });
        }
    } else if (req.method === 'GET') {
        try {
            console.log('GETTING');
            const { tokenId } = req.query;
            console.log(tokenId);
            const result = await prisma.PurchaserInformation.findUnique({
                where: {
                    purchasedTokenId: Number(tokenId),
                },
            });
            console.log(result);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: 'Error occured when trying to receive data.' });
        }
    } else {
        return res.status(405).send({ message: 'Wrong message type was sent!' });
    }
}
