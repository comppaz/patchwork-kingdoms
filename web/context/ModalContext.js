import React from 'react';

export const ModalContext = React.createContext({
    isOpen: false,
    data: {
        heading: '',
        txhash: '',
        isProcessing: false,
        title: '',
    },
    updateData: () => {},
    setIsOpen: () => {},
});

export const ModalProvider = ({ children }) => {
    const [data, setData] = React.useState({
        heading: '',
        txhash: '',
        isProcessing: false,
        title: '',
    });

    const [isOpen, setIsOpen] = React.useState(false);

    const updateData = data => {
        setData(data);
    };

    return <ModalContext.Provider value={{ updateData, data, isOpen, setIsOpen }}>{children}</ModalContext.Provider>;
};

export default ModalContext;
