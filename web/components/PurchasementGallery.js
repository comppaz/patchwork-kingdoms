import { useEffect, useState, useContext } from 'react';
import { checkExpirationDate, getItems } from '../lib/contractInteraction';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
import { Loading } from './Loading';
import { injected } from './_web3';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import AddressContext from '../context/AddressContext';
import { calculateMinPrice, convertExpirationToDate } from '../lib/calculateDonationInteraction';
import useUser from '../lib/useUser';
import Modal from './donation/Modal';

export default function PurchasementGallery({
    heading: heading,
    caption: caption,
    isModalOpen: isModalOpen,
    setIsModalOpen: setIsModalOpen,
}) {
    const [selectedNft, setSelectedNft] = useState(null);
    const [depositedNfts, setDepositedNfts] = useState([]);
    const [transactionType, setTransactionType] = useState({});
    const { activate } = useWeb3React();
    const [signedIn, setSignedIn] = useState(false);
    const { user } = useUser();
    toast.configure();

    useEffect(() => {
        (async () => {
            // Event hören und updaten
            setDepositedNfts(await getItems());
        })();
    }, [isModalOpen]);

    useEffect(async () => {
        if (user?.isLoggedIn) {
            setSignedIn(true);
        } else {
            setSignedIn(false);
        }
    }, [user]);

    /*
    useEffect(() => {
        
        if (depositedNfts) {
            const job = new CronJob('0 /10 * * * *', async function () {
                // check for expiration
                let isTokenExpired = checkExpirationDate(walletAddress, depositedNfts, Math.floor(Date.now() / 1000));
                if (isTokenExpired) {
                    setDepositedNfts(await getItems());
                }
            });
            job.start();
        }
    }, [depositedNfts]);*/

    async function signIn() {
        if (!window.web3) {
        }

        if (signedIn) {
            mutateUser(
                await fetchJson(
                    '/api/logout',
                    {
                        method: 'POST',
                    },
                    false,
                ),
            );
            await deactivate(injected);
            return setSignedIn(false);
        } else {
            await activate(injected, err => {
                toast.error(err.message, { position: 'top-right' });
            });
        }
    }

    return (
        <div className="bg-white">
            <div className="mx-auto pt-12 pb-4 px-4 max-w-7xl sm:px-6 lg:px-8 lg:pt-24 lg:pb-4">
                <div className="space-y-12">
                    <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{heading}</h2>
                        <p className="text-xl text-gray-500">{caption}</p>
                    </div>
                    {selectedNft && (
                        <Modal
                            transactionType={transactionType}
                            setTransactionType={setTransactionType}
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            nft={selectedNft}
                        />
                    )}
                    {depositedNfts ? (
                        <Swiper
                            key={1}
                            modules={[Navigation, Pagination]}
                            slidesPerView={3}
                            spaceBetween={30}
                            slidesPerGroup={3}
                            loop={true}
                            loopFillGroupWithBlank={true}
                            pagination={{
                                clickable: true,
                            }}
                            navigation
                            className="w-100 h-100">
                            {depositedNfts.map((el, index) => (
                                <SwiperSlide className="block" key={el.itemId}>
                                    <Image
                                        className=" rounded-md"
                                        height={300}
                                        width={300}
                                        layout="responsive"
                                        src={el.url}
                                        alt={'Test Token Image'}
                                    />
                                    <div className="grid grid-flow-col ">
                                        <div className="text-md text-gray-500">PWK #{el.tokenId}</div>
                                        <div className=" text-md text-right text-gray-600 font-bold">
                                            Min. price: {calculateMinPrice(el.price / 10 ** 18).minPrice} ETH{' '}
                                            <button
                                                onClick={() => {
                                                    console.log(user);
                                                    if (!user?.isLoggedIn) {
                                                        console.log('SIGN IN!!');
                                                        signIn();
                                                    }
                                                    setTransactionType({ isDeposit: false, isPurchase: true });
                                                    setIsModalOpen(true);
                                                    setSelectedNft(el);
                                                }}
                                                className=" mt-2 p-1 rounded-sm bg-teal-500 text-white cursor-pointer hover:bg-teal-600">
                                                Buy
                                            </button>
                                            <div className="text-xs text-gray-500">
                                                *Available for purchase until {convertExpirationToDate(el.expiration)}
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <Loading></Loading>
                    )}
                    <p className=" text-md text-gray-500 text-center">
                        See more on{' '}
                        <span className=" cursor-pointer text-md text-gray-500 hover:text-gray-700 underline">
                            <a href="https://opensea.io/collection/patchworkkingdoms" target="_blank" rel="noreferrer">
                                Opensea
                            </a>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
