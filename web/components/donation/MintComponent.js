import { useState, useEffect } from 'react';
import { connectWallet, getConnectedWallet, setWalletListener } from '../../lib/contractInteraction';
import { mintTestToken, getOwnedTestNfts } from '../../lib/testTokenInteraction';
import Modal from './Modal';
import ResponseModal from './ResponseModal';
import Image from 'next/image';

export default function MintComponent({
    heading: heading,
    caption: caption,
    status: status,
    walletAddress: walletAddress,
    isModalOpen: isModalOpen,
    setIsModalOpen: setIsModalOpen,
}) {
    const [ownedNfts, setOwnedNfts] = useState([]);
    const [modalOpen, setModalOpen] = useState(true);
    const [responseModalOpen, setResponseModalOpen] = useState(false);
    const [selectedNft, setSelectedNft] = useState(null);
    const [mintState, setMintState] = useState({ transactionFinished: false, txhash: '', status: '', nft: {} });
    const [transactionType, setTransactionType] = useState({});

    //called only once
    useEffect(async () => {
        console.log(isModalOpen);

        if (walletAddress) {
            setOwnedNfts(await getOwnedTestNfts(walletAddress));
        }
    }, [walletAddress]);

    const connectWalletButtonPressed = async () => {
        await connectWallet();
    };

    const onMintPressed = async () => {
        console.log('Starting Mint');
        if (walletAddress) {
            const result = await mintTestToken(walletAddress);
            setMintState({ transactionFinished: true, txhash: result.hash, status: '', nft: {} });
            setResponseModalOpen(true);
        }
    };

    return (
        <div className="bg-white">
            <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
                <div className="space-y-12">
                    <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{heading}</h2>
                        <p className="text-xl text-gray-500">{caption}</p>
                        {selectedNft && (
                            <Modal
                                transactionType={transactionType}
                                setTransactionType={setTransactionType}
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                                nft={selectedNft}
                                status={status}
                                walletAddress={walletAddress}
                            />
                        )}

                        {walletAddress.length > 0 ? (
                            <p className="text-md text-gray-500">You are currently connected and able to mint!</p>
                        ) : (
                            <div>
                                <button
                                    type="button"
                                    className="cursor-pointer py-2 px-4 text-gray-400 hover:text-gray-500 font-bold border border-black"
                                    onClick={() => connectWalletButtonPressed()}>
                                    {' '}
                                    Connect
                                </button>
                                <p className="text-md text-gray-500">{status}</p>
                            </div>
                        )}
                        <div>
                            <button
                                onClick={() => {
                                    onMintPressed();
                                }}
                                className="cursor-pointer py-2 px-4 text-gray-400 hover:text-gray-500 font-bold border border-black">
                                <span className="sr-only">Mint</span>
                                Mint
                            </button>
                            <p className="text-md text-gray-500">Your Test Token:</p>
                            {ownedNfts ? (
                                <section className="overflow-hidden text-gray-700">
                                    <div className="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
                                        <div className="flex flex-wrap -m-1 md:-m-2">
                                            {ownedNfts.map((el, index) => (
                                                <div className="flex flex-wrap w-1/3" key={index}>
                                                    <div className=" w-full p-1 md:p-2">
                                                        <Image
                                                            className="block object-cover object-center shadow-lg rounded-lg"
                                                            width={300}
                                                            height={300}
                                                            src={el.url}
                                                            alt={'Test Token Image'}
                                                        />
                                                        <p className="text-md text-gray-500">TestToken #{el.tokenId}</p>
                                                        <button
                                                            onClick={() => {
                                                                //setModalOpen(true);
                                                                setTransactionType({ isDeposit: true, isPurchasement: false });
                                                                setIsModalOpen(true);
                                                                setSelectedNft(el);
                                                            }}
                                                            className="cursor-pointer text-gray-400 hover:text-gray-500">
                                                            <span className="sr-only">Donate</span>
                                                            Donate
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            ) : (
                                <div className="text-md text-gray-500">
                                    You currently do not own test tokens. Please mint some tokens first.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
