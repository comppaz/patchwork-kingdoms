import { useEffect, useState, useContext } from 'react';
import NftGallery from '../components/NftGallery';
import kingdoms from '../data/kingdoms';
import MintComponent from '../components/donation/MintComponent';
import PurchasementGallery from '../components/PurchasementGallery';
import { getConnectedWallet, getItem } from '../lib/contractInteraction';
import { escrowContractWSS } from '../lib/contractInteraction';
import ResponseModal from '../components/donation/ResponseModal';
import ModalContext from '../context/ModalContext';

export default function Gallery() {
    const [data, setData] = useState([]);
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('');
    const { updateData: updateModalData, data: modalData, setIsOpen: setResponseModalOpen } = useContext(ModalContext);

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
            setAddress(address);
            setStatus(status);
        })();
    }, []);

    useEffect(async () => {
        setIsModalOpen(false);
        setData(buildNftList());
        setListener();
        subscribeToPurchasementEvent();
        subscribeToDepositEvent();
    }, [address, modalData.isOpen]);

    function setListener() {
        if (window.ethereum) {
            // Listen to Event
            window.ethereum.on('accountsChanged', accounts => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                    setStatus('Successfully logged in!');
                } else {
                    setAddress('');
                    setStatus('Connect to Metamask first.');
                }
            });
        } else {
            // Metamask is not installed in Browser
            setAddress('');
            setStatus('You must install Metamask, a virtual Ethereum wallet, in your browser before connecting.');
        }
    }

    const subscribeToPurchasementEvent = async () => {
        escrowContractWSS.events.Donated({}, async (error, data) => {
            if (error) {
                console.log(error);
            } else {
                console.log('PURCHASEMENT EVENT WAS EMITTED SUCCESSFULLY');
                console.log(data);
                setIsModalOpen(false);
                updateModalData({
                    heading: 'Purchasement Transaction completed successfully',
                    txhash: data.transactionHash,
                    title: 'Purchasement',
                    isProcessing: false,
                });
                setResponseModalOpen(true);
            }
        });
    };

    const subscribeToDepositEvent = async () => {
        escrowContractWSS.events.Deposited({}, async (error, data) => {
            if (error) {
                console.log(error);
            } else {
                console.log('DEPOSIT EVENT WAS EMITTED SUCCESSFULLY');
                console.log(data);
                setIsModalOpen(false);
                updateModalData({
                    heading: 'Deposit Transaction completed successfully',
                    txhash: data.transactionHash,
                    title: 'Deposit',
                    isProcessing: false,
                });
                setResponseModalOpen(true);
            }
        });
    };

    return (
        <div className="flex flex-col py-2">
            <MintComponent
                heading="Mint a Test Token"
                caption="Mint a token to test the deposit and purchasement functionalities."
                status={status}
                walletAddress={address}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}></MintComponent>
            <PurchasementGallery
                heading="Up for Sale"
                caption="The following Patchwork Kingdoms are up for sale."
                status={status}
                walletAddress={address}
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
