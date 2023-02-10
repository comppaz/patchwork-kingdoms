export async function setToSellerEmail(parameter: ToSellerParams): Promise<EmailParameter> {
    return {
        subject: 'Your PWK has been successfully listed for Donation!',
        text: `Dear ${parameter.receiver},

        We are pleased to inform you that the Patchwork Kingdoms NFT that you recently listed on our website has been successfully processed. Giga truly appreciates your generosity and support of our mission.
        
        Here is a summary of the item details:
        
        •	Item Details: ${parameter.itemDetails}                          
        •	Date of Listing: ${parameter.dateOfListing}
        •	Time Frame: ${parameter.timeframe}
        •	Listing Price: ${parameter.listingPrice}
        
        All the proceeds from the sale of your Patchwork Kingdom NFT would go to fund the Giga initiative, to connect every school to the internet and every young person to information, opportunity and choice.
        
        We will update you once your listed Patchwork Kingdom NFT is successfully sold. Thank you again for supporting the Giga mission and for your commitment to making a difference. 
        
        Best regards,
        Giga.
        `,
        to: 'simona@craft-clarity.com',
        from: 'antonio@craft-clarity.com',
    };
}

export async function setToDonatorEmail(parameter: ToDonatorParams): Promise<EmailParameter> {
    return {
        subject: 'Your PWK has been Successfully Donated! ',
        text: `Dear (Seller Name),

        We are thrilled to inform you that the Patchwork Kingdoms NFT that you recently listed for donation has been successfully sold! We would like to extend our heartfelt gratitude for your generosity and for supporting the Giga mission.
        
        Here is a summary of the donation details:
        
        •	Item Details: ${parameter.itemDetails}                            (Note: add PWK image if possible)
        •	Date of Listing: ${parameter.dateOfListing}
        •	Date of Sale: ${parameter.dateOfSale}
        •	Listing Price: ${parameter.dateOfListing}
        •	Sale Price: ${parameter.salePrice}
        •	Time Duration: ${parameter.timeDuration}
        
        
        As a token of our appreciation, you have received an NFT token that recognizes you as a ‘Giga Friend’ who shares Giga’s values of bridging the digital divide and supporting universal school connectivity. 
        
        All the funds you have raised will go towards funding Giga’s mission of connecting every young person to information, opportunity, and choice.
        
        Once again, thank you for your generosity and for supporting the Giga cause. We look forward to your continued support in the future.
        
        Best regards,
        Giga.
        `,
        to: parameter.receiver,
        from: '',
    };
}

export async function setToBuyerEmail(parameter: ToBuyerParams): Promise<EmailParameter> {
    return {
        subject: '',
        text: '',
        to: parameter.receiver,
        from: '',
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
