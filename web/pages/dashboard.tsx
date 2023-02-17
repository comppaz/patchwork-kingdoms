import { useEffect, useState, useContext } from 'react';
import useUser from '../lib/useUser';
import useOwnedNfts from '../lib/useOwnedNfts';
import NftGallery from '../components/NftGallery';
import ModalContext from '../context/ModalContext';
import AddressContext from '../context/AddressContext';
import { escrowContractWSS } from '../lib/contractInteraction';
import ResponseModal from '../components/donation/ResponseModal';
import { emailTypeMap } from '../lib/setEmailContentDetails';
import DonationContext from '../context/DonationContext';

export default function Dashboard() {
    const { user } = useUser();

    const { nfts } = useOwnedNfts(user);

    const {
        updateData: updateModalData,
        data: modalData,
        isOpen: isResponseModalOpen,
        setIsOpen: setResponseModalOpen,
        setIsLoading,
    } = useContext(ModalContext);

    const { emittingAddress } = useContext(AddressContext);
    const { donationData } = useContext(DonationContext);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsModalOpen(false);
    }, []);

    useEffect(() => {
        subscribeToDepositEvent();
    }, [emittingAddress]);

    const prepareEmail = async (typeId: number, parameter: ToDonatorParams | ToBuyerParams | ToSellerParams) => {
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

    const subscribeToDepositEvent = async () => {
        escrowContractWSS.events.Deposited({}, async (error, data) => {
            setIsModalOpen(false);
            setIsLoading(false);
            if (error) {
                console.log(error);
            } else {
                console.log('DEPOSIT EVENT WAS EMITTED SUCCESSFULLY');
                // check that user is set and equals the emittingAddress
                if (user.account !== '' && user.account === emittingAddress) {
                    updateModalData({
                        heading: 'Congrats, your NFT is up for sale!',
                        txhash: data.transactionHash,
                        title: 'Transaction complete',
                        isProcessing: false,
                        id: data.tokenId,
                        transactionType: { isDeposit: true, isPurchase: false },
                    });

                    // send E-Mail to the one who donated a token
                    let toSellerTypeId = emailTypeMap.toSeller;
                    let toSellerParams: ToSellerParams = {
                        receiver: donationData.donatorMail,
                        itemDetails: '',
                        dateOfListing: donationData.dateOfListing,
                        timeframe: 0,
                        listingPrice: 0,
                    };
                    prepareEmail(toSellerTypeId, toSellerParams);

                    setTimeout(() => {
                        setResponseModalOpen(true);
                    }, 500);
                }
            }
        });
    };

    if (!user?.isLoggedIn) {
        return (
            <div className="min-h-full pt-16 pb-12 flex flex-col bg-white">
                <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-16 mt-8">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide">Please sign in through Metamask</p>

                            <p className="mt-2 text-base text-gray-500">When you sign in, you&apos;ll be able to see your NFTs.</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (user?.isLoggedIn && !user?.totalNfts) {
        return (
            <div className="min-h-full pt-16 pb-12 flex flex-col bg-white">
                <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-16 mt-8">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide">
                                You are not a member of Patchwork Kingdoms yet.
                            </p>

                            <p className="mt-2 text-base text-gray-500">
                                Become part of the community by buying one on{' '}
                                <a
                                    href="https://opensea.io/collection/patchworkkingdoms"
                                    target="_blank"
                                    className="underline"
                                    rel="noreferrer">
                                    Opensea
                                </a>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <NftGallery
                heading="Your Kingdoms"
                caption="All Patchwork Kingdoms that belong to you."
                nfts={nfts}
                footer="Yay! You have seen all your Kingdoms."
                isDonateActivate={true}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}></NftGallery>
            <ResponseModal />
        </div>
    );
}
