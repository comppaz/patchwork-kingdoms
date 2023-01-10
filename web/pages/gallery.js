import { useEffect, useState, useContext } from 'react';
import NftGallery from '../components/NftGallery';
import kingdoms from '../data/kingdoms';
import MintComponent from '../components/donation/MintComponent';
import PurchasementGallery from '../components/PurchasementGallery';
import { getConnectedWallet, getItem } from '../lib/contractInteraction';
import { escrowContractWSS } from '../lib/contractInteraction';
import ResponseModal from '../components/donation/ResponseModal';
import ModalContext from '../context/ModalContext';
import AddressContext from '../context/AddressContext';

export default function Gallery() {
    const [data, setData] = useState([]);
    const {
        updateData: updateModalData,
        data: modalData,
        isOpen: isResponseModalOpen,
        setIsOpen: setResponseModalOpen,
        setIsLoading,
    } = useContext(ModalContext);
    const { walletAddress, updateWalletAddress, walletStatus, updateWalletStatus, emittingAddress } = useContext(AddressContext);

    const [isModalOpen, setIsModalOpen] = useState();

    function buildNftList() {
        let ret = [];
        for (let i = 1; i < 1001; i++) {
            ret.push({
                key: i,
                title: kingdoms[i].title,
                imageUrl: `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.fra1.digitaloceanspaces.com/thumbnail/${i}.png`,
                tokenId: i,
                openseaUrl: `https://opensea.io/assets/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/${i}`,
                highresDownloadUrl: '',
            });
        }

        return ret;
    }

    useEffect(() => {
        (async () => {
            const { address, status } = await getConnectedWallet();
            updateWalletAddress(address);
            updateWalletStatus(status);
        })();
    }, []);

    useEffect(() => {
        setIsModalOpen(false);
        setData(buildNftList());
        setWalletListener();
    }, [walletAddress]);

    useEffect(() => {
        subscribeToPurchasementEvent();
        subscribeToDepositEvent();
    }, [emittingAddress]);

    function setWalletListener() {
        if (window.ethereum) {
            // Listen to Event
            window.ethereum.on('accountsChanged', accounts => {
                if (accounts.length > 0) {
                    updateWalletAddress(accounts[0]);
                    updateWalletStatus('Successfully logged in!');
                } else {
                    updateWalletAddress('');
                    updateWalletStatus('Connect to Metamask first.');
                }
            });
        } else {
            // Metamask is not installed in Browser
            updateWalletAddress('');
            updateWalletStatus('You must install Metamask, a virtual Ethereum wallet, in your browser before connecting.');
        }
    }

    const subscribeToPurchasementEvent = async () => {
        escrowContractWSS.events.Donated({}, async (error, data) => {
            setIsModalOpen(false);
            setIsLoading(false);
            if (error) {
                console.log(error);
            } else {
                console.log('PURCHASEMENT EVENT WAS EMITTED SUCCESSFULLY');
                // check that walletAddres is set and equals the emittingAddress
                if (walletAddress !== '' && walletAddress === emittingAddress) {
                    updateModalData({
                        heading: 'Thank you for your purchase!',
                        txhash: data.transactionHash,
                        title: 'Transaction complete',
                        isProcessing: false,
                        id: data.tokenId,
                        transactionType: { isDeposit: false, isPurchase: true },
                    });
                    setTimeout(() => {
                        setResponseModalOpen(true);
                    }, 500);
                }
            }
        });
    };

    const subscribeToDepositEvent = async () => {
        escrowContractWSS.events.Deposited({}, async (error, data) => {
            setIsModalOpen(false);
            setIsLoading(false);
            if (error) {
                console.log(error);
            } else {
                console.log('DEPOSIT EVENT WAS EMITTED SUCCESSFULLY');
                // check that walletAddres is set and equals the emittingAddress
                if (walletAddress !== '' && walletAddress === emittingAddress) {
                    updateModalData({
                        heading: 'Congrats, your NFT is up for sale!',
                        txhash: data.transactionHash,
                        title: 'Transaction complete',
                        isProcessing: false,
                        id: data.tokenId,
                        transactionType: { isDeposit: true, isPurchase: false },
                    });
                    setTimeout(() => {
                        setResponseModalOpen(true);
                    }, 500);
                }
            }
        });
    };

    return (
        <div className="flex flex-col py-2">
            <MintComponent
                heading="Mint a Test Token"
                caption="Mint a token to test the deposit and purchasement functionalities."
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}></MintComponent>
            <PurchasementGallery
                heading="Up for Sale"
                caption="The following Patchwork Kingdoms are up for sale."
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}></PurchasementGallery>
            <NftGallery
                heading="Patchwork Kingdoms Gallery"
                caption="All Patchwork Kingdoms that have been minted."
                nfts={data}></NftGallery>

            <ResponseModal />
        </div>
    );
}
