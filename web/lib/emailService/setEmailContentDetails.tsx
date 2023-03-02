import Mustache from 'mustache';
import DepositEmail from './templates/html/deposit.html';
import SoldEmail from './templates/html/sold.html';
import PurchaseEmail from './templates/html/purchase.html';
import { DateTime } from 'luxon';
import kingdoms from '../../data/kingdoms';

function timeframeToString(expires_in: number): string {
    let result = {
        years_diff: 0,
        months_diff: 0,
        days_diff: 0,
        hours_diff: 0,
    };

    if (expires_in) {
        result.years_diff = Math.floor(expires_in / 31536000);
        result.months_diff = Math.floor((expires_in % 31536000) / 2628000);
    }

    return result.years_diff + ' years, ' + result.months_diff + ' months';
}

export async function setToSellerEmail(parameter: ToSellerParams): Promise<EmailParameter> {
    let renderedHtml = Mustache.render(DepositEmail, {
        TOKEN_THUMBNAIL_URL: `https://${process.env.BUCKET_NAME}.fra1.digitaloceanspaces.com/thumbnail/${parameter.tokenId}.png`,
        TOKEN_NAME: `${kingdoms[parameter.tokenId].title.replace('Patchwork Kingdom ', '')}`,
        LISTING_DATE: DateTime.fromISO(parameter.dateOfListing).toLocaleString(DateTime.DATETIME_MED),
        TIMEFRAME: timeframeToString(parameter.timeframe),
        LISTING_PRICE: `to be determined`,
    });

    return {
        subject: 'Your PWK has been successfully donated! ',
        html: renderedHtml,
        to: parameter.receiver,
        from: 'no-reply@patchwork-kingdoms.com',
    };
}

export async function setToDonatorEmail(parameter: ToDonatorParams): Promise<EmailParameter> {
    let renderedHtml = Mustache.render(SoldEmail, {
        TOKEN_THUMBNAIL_URL: `https://${process.env.BUCKET_NAME}.fra1.digitaloceanspaces.com/thumbnail/${parameter.tokenId}.png`,
        TOKEN_NAME: `${kingdoms[parameter.tokenId].title.replace('Patchwork Kingdom ', '')}`,
        LISTING_DATE: DateTime.fromISO(parameter.dateOfListing).toLocaleString(DateTime.DATETIME_MED),
        TIMEFRAME: timeframeToString(parameter.timeDuration),
        LISTING_PRICE: `${parameter.listingPrice} ETH`,
    });

    return {
        subject: 'Your PWK has been successfully sold! ',
        html: renderedHtml,
        to: parameter.receiver,
        from: 'no-reply@patchwork-kingdoms.com',
    };
}

export async function setToBuyerEmail(parameter: ToBuyerParams): Promise<EmailParameter> {
    let renderedHtml = Mustache.render(PurchaseEmail, {
        TOKEN_THUMBNAIL_URL: `https://${process.env.BUCKET_NAME}.fra1.digitaloceanspaces.com/thumbnail/${parameter.tokenId}.png`,
        TOKEN_NAME: `${kingdoms[parameter.tokenId].title.replace('Patchwork Kingdom ', '')}`,
        LISTING_DATE: DateTime.fromISO(parameter.dateOfSale).toLocaleString(DateTime.DATETIME_MED),
        LISTING_PRICE: `${parameter.salePrice} ETH`,
    });

    return {
        subject: 'Your purchase does make a difference!',
        html: renderedHtml,
        to: parameter.receiver,
        from: 'no-reply@patchwork-kingdoms.com',
    };
}

export const emailTypeMap = {
    toSeller: 1,
    toDonator: 2,
    toBuyer: 3,
};

export const emailType = {
    1: setToSellerEmail,
    2: setToDonatorEmail,
    3: setToBuyerEmail,
};
