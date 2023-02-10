interface EmailParameter {
    subject: string;
    text: string;
    to: string;
    from: string;
}

interface ToSellerParams {
    receiver: string;
    itemDetails: string;
    dateOfListing: Date;
    timeframe: number;
    listingPrice: number;
}

interface ToDonatorParams {
    receiver: string;
    itemDetails: string;
    dateOfListing: Date;
    dateOfSale: Date;
    listingPrice: number;
    salePrice: number;
    timeDuration: number;
}

interface ToBuyerParams {
    receiver: string;
    itemDetails: string;
    dateOfSale: Date;
    salePrice: number;
}
