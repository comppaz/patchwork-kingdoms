import React from 'react';

interface IModalContext {
    isOpen: boolean;
    data: any; // TODO: add type
    isLoading: boolean;
    updateData: (data: any) => void; // TODO: add type
    setIsOpen: (isOpen: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
}
export const ModalContext = React.createContext<IModalContext>({
    isOpen: false,
    data: {
        heading: '',
        txhash: '',
        isProcessing: false,
        title: '',
        id: null,
        transactionType: { isDeposit: false, isPurchase: false },
    },
    isLoading: false,
    updateData: () => {},
    setIsOpen: () => {},
    setIsLoading: () => {},
});

export const ModalProvider = ({ children }) => {
    const [data, setData] = React.useState({
        heading: '',
        txhash: '',
        isProcessing: false,
        title: '',
        id: null,
        transactionType: { isDeposit: false, isPurchase: false },
    });

    const [isOpen, setIsOpen] = React.useState(false);

    const updateData = data => {
        setData(data);
    };

    const [isLoading, setIsLoading] = React.useState(false);

    return (
        <ModalContext.Provider value={{ updateData, data, isOpen, setIsOpen, isLoading, setIsLoading }}>{children}</ModalContext.Provider>
    );
};

export default ModalContext;
