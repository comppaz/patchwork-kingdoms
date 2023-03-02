import React from 'react';

interface IDonationContext {
    donationData: DonationData;
    updateDonationData: (data: DonationData) => void;
    purchasementData: PurchasementData;
    updatePurchasementData: (data: PurchasementData) => void;
}
export const DonationContext = React.createContext<IDonationContext>({
    donationData: {
        tokenId: 0,
        timeframe: 0,
        donatorMail: '',
        dateOfListing: null,
    },
    updateDonationData: () => {},

    purchasementData: {
        itemId: 0,
        dateOfSale: null,
        salePrice: 0,
        purchaserMail: '',
    },
    updatePurchasementData: () => {},
});

export const DonationProvider = ({ children }) => {
    const [donationData, setDonationData] = React.useState({
        tokenId: 0,
        timeframe: 0,
        donatorMail: '',
        dateOfListing: null,
    });

    const updateDonationData = (data: DonationData) => {
        console.log('Are we updating donation data?');
        console.log(data);
        console.log(typeof data);
        setDonationData(data);
    };

    const [purchasementData, setPurchasementData] = React.useState({
        itemId: 0,
        dateOfSale: null,
        salePrice: 0,
        purchaserMail: '',
    });

    const updatePurchasementData = (data: PurchasementData) => {
        console.log('Are we updating purchaseement data?');
        console.log(data);
        console.log(typeof data);
        setPurchasementData(data);
    };

    return (
        <DonationContext.Provider value={{ donationData, updateDonationData, purchasementData, updatePurchasementData }}>
            {children}
        </DonationContext.Provider>
    );
};

export default DonationContext;
