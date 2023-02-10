import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../scripts/emailService';

export default async function emailHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only post request allowed' });
    }
    try {
        const { typeId, parameter } = req.body;
        console.log(typeId);
        sendEmail(typeId, parameter);
        return res.status(200).json({ message: 'Contact Email Sent Successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({ message: errorMessage });
    }
}
