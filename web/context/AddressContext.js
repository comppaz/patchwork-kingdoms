import React from 'react';

export const AddressContext = React.createContext({
    walletAddress: '',
    updateWalletAddress: address => {},

    walletStatus: '',
    updateWalletStatus: status => {},

    emittingAddress: '',
    updateEmittingAddress: emittingAddress => {},
});

export const AddressProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = React.useState('');
    const [walletStatus, setWalletStatus] = React.useState('');
    const [emittingAddress, setEmittingAddress] = React.useState('');

    const updateWalletAddress = address => {
        setWalletAddress(address);
    };

    const updateWalletStatus = status => {
        setWalletStatus(status);
    };

    const updateEmittingAddress = address => {
        setEmittingAddress(address);
    };

    return (
        <AddressContext.Provider
            value={{ walletAddress, updateWalletAddress, walletStatus, updateWalletStatus, emittingAddress, updateEmittingAddress }}>
            {children}
        </AddressContext.Provider>
    );
};

export default AddressContext;
