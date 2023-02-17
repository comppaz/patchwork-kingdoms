const { PrismaClient } = require('@prisma/client');
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { donatedTokenId, email, dateOfListing } = req.body;
            console.log(req.body);
            const result = await prisma.DonatorInformation.create({
                data: {
                    donatedTokenId: donatedTokenId,
                    email: email,
                    dateOfListing: dateOfListing,
                },
            });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: 'Error occured when trying to update data.' });
        }
    } else if (req.method === 'GET') {
        try {
            const { tokenId } = req.query;
            const result = await prisma.DonatorInformation.findUnique({
                where: {
                    donatedTokenId: Number(tokenId),
                },
            });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: 'Error occured when trying to receive data.' });
        }
    } else {
        return res.status(405).send({ message: 'Wrong message type was sent!' });
    }
}
