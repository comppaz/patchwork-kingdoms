const sgMail = require('@sendgrid/mail');
import * as dotenv from 'dotenv';
import { emailType } from './setEmailContentDetails';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async function (typeId: number, parameter: ToBuyerParams | ToDonatorParams | ToSellerParams) {
    console.log(`SENDING EMAIL FROM EMAIL SERVICE for type ` + typeId);
    console.log(parameter);

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
