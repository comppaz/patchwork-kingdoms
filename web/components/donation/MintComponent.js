import { useState, useEffect, useContext } from 'react';
import { connectWallet, getConnectedWallet, setWalletListener } from '../../lib/contractInteraction';
import { mintTestToken, getOwnedTestNfts } from '../../lib/testTokenInteraction';
import Modal from './Modal';
import Image from 'next/image';
import AddressContext from '../../context/AddressContext';
import useUser from '../../lib/useUser';

export default function MintComponent({}) {
    /*
    const [ownedNfts, setOwnedNfts] = useState([]);
    const [selectedNft, setSelectedNft] = useState(null);
    const [transactionType, setTransactionType] = useState({});
    const { walletAddress, walletStatus } = useContext(AddressContext);

    //called only once
    useEffect(() => {
        (async () => {
            if (walletAddress) {
                setOwnedNfts(await getOwnedTestNfts(walletAddress));
            }
        })();
    }, [walletAddress, walletStatus, isModalOpen]);

    const connectWalletButtonPressed = async () => {
        await connectWallet();
    };*/
    const { user } = useUser();

    const onMintPressed = async () => {
        console.log(user.account);
        if (user.account) {
            console.log('Starting Mint');
            await mintTestToken(user.account);
        }
    };

    return (
        <div className="bg-white mx-auto p-8">
            <button
                onClick={() => {
                    onMintPressed();
                }}
                className="cursor-pointer py-2 px-4 text-gray-400 hover:text-gray-500 font-bold border border-black">
                <span className="sr-only">Mint Test Token</span>
                Mint Test Token
            </button>
            {/** 
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
                                <p className="text-md text-gray-500">{walletStatus}</p>
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
                                                                setTransactionType({ isDeposit: true, isPurchase: false });
                                                                setIsModalOpen(true);
                                                                setSelectedNft(el);
                                                            }}
                                                            className=" mt-2 p-1 rounded-sm bg-teal-500 text-white cursor-pointer hover:text-gray-300">
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
            </div>*/}
        </div>
    );
}
