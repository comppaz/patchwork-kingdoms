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

        const purchaseData = await prisma.PurchaserInformation.findUnique({
            where: {
                purchasedTokenId: Number(tokenId),
            },
        });

        let toBuyerParameter: ToBuyerParams = {
            tokenId,
            receiver: purchaseData.email,
            itemDetails: 'Some Token',
            dateOfSale: purchaseData.dateOfSale,
            salePrice: purchaseData.salePrice,
        };

        await sendEmail(emailTypeMap.toBuyer, toBuyerParameter);

        const donationData = await prisma.DonatorInformation.findUnique({
            where: {
                donatedTokenId: Number(tokenId),
            },
        });

        let toDonatorParameter: ToDonatorParams = {
            tokenId,
            receiver: donationData.email,
            itemDetails: '',
            dateOfListing: donationData.dateOfListing,
            dateOfSale: purchaseData.dateOfSale,
            listingPrice: 0,
            salePrice: purchaseData.salePrice,
            timeDuration: donationData.timeframe,
        };

        await sendEmail(emailTypeMap.toDonator, toDonatorParameter);

        // update columns of salePrice and if isSold in DonatorInformation
        const result = await prisma.DonatorInformation.update({
            where: {
                donatedTokenId: Number(tokenId),
            },
            data: {
                isSold: true,
                salePrice: purchaseData.salePrice,
            },
        });

        return res.status(200).json({ message: 'Purchase completed successfully!' });
    } else {
        return res.status(405).send({ message: 'Wrong message type was sent!' });
    }
}
