const sgMail = require('@sendgrid/mail');
import * as dotenv from 'dotenv';
import { emailType, setToBuyerEmail, setToDonatorEmail, setToSellerEmail } from '../lib/setEmailContentDetails';
dotenv.config();

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

export const sendEmail = async function (typeId: number, parameter: ToBuyerParams | ToDonatorParams | ToSellerParams) {
    console.log(`SENDING EMAIL FROM EMAIL SERVICE for type ` + typeId);
    let emailToSend = await emailType[typeId](parameter);
    try {
        await sgMail.send(emailToSend);
    } catch (error: any) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body);
        }
    }
};
