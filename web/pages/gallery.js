import { useEffect, useState } from 'react';
import NftGallery from '../components/NftGallery';
import kingdoms from '../data/kingdoms';
import MintComponent from '../components/donation/MintComponent';
import PurchasementGallery from '../components/PurchasementGallery';
import { getConnectedWallet } from '../lib/contractInteraction';
import { escrowContractWSS } from '../lib/contractInteraction';
import ResponseModal from '../components/donation/ResponseModal';
import Router from 'next/router';

export default function Gallery() {
    const [data, setData] = useState([]);
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('');
    const [transactionType, setTransactionType] = useState({ isDeposit: false, isPurchasement: false });

    // opened when event is triggered
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [eventResponse, setEventResponse] = useState({});

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

    useEffect(async () => {
        const { address, status } = await getConnectedWallet();
        setAddress(address);
        setStatus(status);
    }, []);

    useEffect(async () => {
        console.log('here');
        setIsModalOpen(false);
        setData(buildNftList());
        setListener();
        subscribeToPurchasementEvent();
        subscribeToDepositEvent();
    }, [address, isTransactionModalOpen, eventResponse]);

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
        escrowContractWSS.events.Donated({}, (error, data) => {
            if (error) {
                console.log(error);
            } else {
                console.log('PURCHASEMENT EVENT WAS EMITTED SUCCESSFULLY');
                setIsModalOpen(false);
                setEventResponse(data);
                setIsTransactionModalOpen(true);
                setTransactionType({ isPurchasement: true });
            }
        });
    };

    const subscribeToDepositEvent = async () => {
        setIsModalOpen(false);
        escrowContractWSS.events.Deposited({}, async (error, data) => {
            if (error) {
                console.log(error);
            } else {
                console.log('DEPOSIT EVENT WAS EMITTED SUCCESSFULLY');
                setIsModalOpen(false);
                setEventResponse(data);
                setIsTransactionModalOpen(true);
                setTransactionType({ isDeposit: true });
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

            {transactionType.isDeposit && isTransactionModalOpen && (
                <ResponseModal
                    title="Deposit"
                    heading="Deposit Transaction completed successfully"
                    txhash={eventResponse.transactionHash}
                    open={isTransactionModalOpen}
                    setOpen={setIsTransactionModalOpen}
                    isProcessing={false}></ResponseModal>
            )}
            {/** Purchasement Event */}
            {transactionType.isPurchasement && isTransactionModalOpen && (
                <ResponseModal
                    title="Purchasement"
                    heading="Purchasement Transaction completed successfully"
                    txhash={eventResponse.transactionHash}
                    open={isTransactionModalOpen}
                    setOpen={setIsTransactionModalOpen}
                    isProcessing={false}></ResponseModal>
            )}
        </div>
    );
}
