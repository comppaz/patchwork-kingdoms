const { PrismaClient } = require('@prisma/client');
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const result = await prisma.DonatorInformation.findMany({});
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
