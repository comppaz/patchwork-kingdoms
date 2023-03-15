import { useEffect, useState, useContext } from 'react';
import useUser from '../lib/useUser';
import useOwnedNfts from '../lib/useOwnedNfts';
import NftGallery from '../components/NftGallery';
import ModalContext from '../context/ModalContext';
import AddressContext from '../context/AddressContext';
import { escrowContractWSS } from '../lib/contractInteraction';
import ResponseModal from '../components/donation/ResponseModal';
import Image from 'next/image';
import Modal from '../components/donation/Modal';
import { getOwnedTestNfts } from '../lib/testTokenInteraction';
import kingdoms from '../data/kingdoms';

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

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [testNfts, setTestNfts] = useState([]);
    const [selectedTestToken, setSelectedTestToken] = useState(null);
    const [transactionType, setTransactionType] = useState({});

    useEffect(() => {
        if (!process.env.PROD_FLAG && user && user.account) {
            console.log('DASHBOARD');
            console.log(user.account);

            (async () => {
                setTestNfts(await getOwnedTestNfts(user.account));
            })();
        }
    }, [user]);

    useEffect(() => {
        setIsModalOpen(false);
    }, []);

    useEffect(() => {
        subscribeToDepositEvent();
    }, [emittingAddress]);

    const subscribeToDepositEvent = async () => {
        console.log('SUBSCRIBING TO DEPOSIT?');
        escrowContractWSS.events.Deposited({}, async (error, data) => {
            setIsModalOpen(false);
            setIsLoading(false);
            if (error) {
                console.log(error);
            } else {
                console.log('DEPOSIT EVENT WAS EMITTED SUCCESSFULLY');
                console.log(user);
                // check that user is set and equals the emittingAddress
                if (user && user.account !== '' && user.account === emittingAddress) {
                    updateModalData({
                        heading: 'Congrats, your NFT is up for sale!',
                        txhash: data.transactionHash,
                        title: 'Transaction complete',
                        isProcessing: false,
                        id: data.tokenId,
                        transactionType: { isDeposit: true, isPurchase: false },
                    });

                    await fetch('/api/completeDonation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            tokenId: data.returnValues.tokenId,
                            txHash: data.transactionHash,
                        }),
                    });

                    setTimeout(() => {
                        setResponseModalOpen(true);
                    }, 500);
                }
            }
        });
    };

    // activates testing component only in dev stage
    if (!process.env.PROD_FLAG) {
        if (!user?.isLoggedIn) {
            return (
                <div className="min-h-full pt-16 pb-12 flex flex-col bg-white">
                    <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-16 mt-8">
                            <div className="text-center">
                                <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide">
                                    Please sign in through Metamask
                                </p>

                                <p className="mt-2 text-base text-gray-500">When you sign in, you&apos;ll be able to see your NFTs.</p>
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
                {selectedTestToken && (
                    <Modal
                        transactionType={transactionType}
                        setTransactionType={setTransactionType}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        nft={selectedTestToken}
                    />
                )}
                <p className="text-md text-gray-500">Your Test Token:</p>
                {testNfts ? (
                    <section className="overflow-hidden text-gray-700">
                        <div className="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
                            <div className="flex flex-wrap -m-1 md:-m-2">
                                {testNfts.map((el, index) => (
                                    <div className="flex flex-wrap w-1/3" key={index}>
                                        <div className=" w-full p-1 md:p-2">
                                            <Image
                                                className="block object-cover object-center shadow-lg rounded-lg"
                                                width={300}
                                                height={300}
                                                src={el.url}
                                                layout="responsive"
                                                alt={'Test Token Image'}
                                            />
                                            <div className="grid grid-flow-row ">
                                                <div className="text-md grid grid-flow-col">
                                                    <p className="py-4 font-bold font-medium">
                                                        {kingdoms[el.tokenId].title &&
                                                            kingdoms[el.tokenId].title.replace('Patchwork Kingdom ', '')}
                                                    </p>
                                                    <div className="text-right">
                                                        <button
                                                            onClick={() => {
                                                                setTransactionType({ isDeposit: true, isPurchase: false });
                                                                setIsModalOpen(true);
                                                                setSelectedTestToken(el);
                                                            }}
                                                            className="mt-2 py-1 w-16 rounded-md bg-teal-500 text-white cursor-pointer font-bold hover:bg-teal-600">
                                                            Donate
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className="text-md text-gray-500">You currently do not own test tokens. Please mint some tokens first.</div>
                )}
            </div>
        );
    }

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
