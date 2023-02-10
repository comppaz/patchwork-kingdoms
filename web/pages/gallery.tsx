import { useEffect, useState, useContext } from 'react';
import useUser from '../lib/useUser';
import NftGallery from '../components/NftGallery';
import kingdoms from '../data/kingdoms';
import MintComponent from '../components/donation/MintComponent';
import PurchasementGallery from '../components/PurchasementGallery';
import { getConnectedWallet, getItem } from '../lib/contractInteraction';
import { escrowContractWSS } from '../lib/contractInteraction';
import ResponseModal from '../components/donation/ResponseModal';
import ModalContext from '../context/ModalContext';
import AddressContext from '../context/AddressContext';
import { emailType, emailTypeMap } from '../lib/setEmailContentDetails';

export default function Gallery() {
    const { user } = useUser();

    const [data, setData] = useState([]);
    const {
        updateData: updateModalData,
        data: modalData,
        isOpen: isResponseModalOpen,
        setIsOpen: setResponseModalOpen,
        setIsLoading,
    } = useContext(ModalContext);
    const { emittingAddress } = useContext(AddressContext);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
        console.log(ret);
        return ret;
    }

    /*
    useEffect(() => {
        (async () => {
            const { address, status } = await getConnectedWallet();
            updateWalletAddress(address);
            updateWalletStatus(status);
        })();
    }, []);*/

    useEffect(() => {
        setIsModalOpen(false);
        setData(buildNftList());
    }, []);

    useEffect(() => {
        subscribeToPurchasementEvent();
    }, [emittingAddress]);

    const subscribeToPurchasementEvent = async () => {
        escrowContractWSS.events.Donated({}, async (error, data) => {
            setIsModalOpen(false);
            setIsLoading(false);
            if (error) {
                console.log(error);
            } else {
                console.log('PURCHASEMENT EVENT WAS EMITTED SUCCESSFULLY');
                // check that user's address is set and equals the emittingAddress
                if (user.account !== '' && user.account === emittingAddress) {
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

    const testEmail = async () => {
        console.log('testing email');
        let typeId = emailTypeMap.toSeller;
        let parameter: ToSellerParams = {
            receiver: 'simona@craft-clarity.com',
            itemDetails: 'Some Token',
            dateOfListing: new Date(),
            timeframe: 12,
            listingPrice: 12,
        };

        const response = await fetch('/api/emailHandler', {
            method: 'POST',
            body: JSON.stringify({
                typeId,
                parameter,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const res = await response.json();
        console.log(res);
        return res;
    };

    return (
        <div className="flex flex-col">
            <button
                onClick={() => {
                    testEmail();
                }}>
                TEST EMAIL
            </button>
            {/** only needed for testing 
            <MintComponent
                heading="Mint a Test Token"
                caption="Mint a token to test the deposit and purchasement functionalities."
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}></MintComponent>*/}
            <PurchasementGallery
                heading="Up for Sale"
                caption="Limited time offers of Patchwork Kingdoms that have generously been donated to Giga by their owners. If you purchase these from this website directly, 100% of the funds you pay are donated to UNICEF."
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}></PurchasementGallery>
            <NftGallery
                heading="Patchwork Kingdoms Gallery"
                caption=" All Patchwork Kingdoms in the collection."
                nfts={data}
                footer="Yay! You have seen all the Kingdoms."
                isDonateActivate={false}></NftGallery>

            <ResponseModal />
        </div>
    );
}
