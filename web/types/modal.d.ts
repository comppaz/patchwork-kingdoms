interface ModalData {
    heading: string;
    isProcessing: boolean;
    title: string;
    id: null | number;
    txhash: string;
    transactionType: {
        isDeposit: boolean;
        isPurchase: boolean;
    };
}
