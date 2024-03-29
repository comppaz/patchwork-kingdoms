interface EmailParameter {
    subject: string;
    text?: string;
    html?: string;
    to: string;
    from: string;
}

/**
 * who donates a PWK
 */
interface ToSellerParams {
    tokenId: string;
    receiver: string;
    itemDetails: string;
    dateOfListing: Date;
    timeframe: number;
    listingPrice: number;
}

/**
 * whose PWK got sold
 */
interface ToDonatorParams {
    tokenId: string;
    receiver: string;
    itemDetails: string;
    dateOfListing: Date;
    dateOfSale: Date;
    listingPrice: number;
    salePrice: number;
    timeDuration: number;
}

/**
 * the one who buys a PWK
 */
interface ToBuyerParams {
    tokenId: string;
    receiver: string;
    itemDetails: string;
    dateOfSale: Date;
    salePrice: number;
}

/**
 * donation modal data to set for context variables
 */
interface DonationData {
    tokenId: number;
    timeframe: number;
    donatorMail: string;
    dateOfListing: Date;
}
/**
 * purchasement modal data to set for context variables
 */
interface PurchasementData {
    itemId: number;
    dateOfSale: Date;
    salePrice: number;
    purchaserMail: string;
}
