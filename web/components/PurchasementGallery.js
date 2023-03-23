import { useEffect, useState, useContext } from 'react';
import { getItems } from '../lib/contractInteraction';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper';
import { Loading } from './Loading';
import { injected } from './_web3';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import checkExpirationDate from '../lib/checkExpirationDate';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { calculateMinPrice, convertExpirationToDate } from '../lib/calculateDonationInteraction';
import useUser from '../lib/useUser';
import Modal from './donation/Modal';
import kingdoms from '../data/kingdoms';
import cron from 'cron';

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
            setDepositedNfts(await getItems());
        })();
    }, [isModalOpen]);

    console.log(depositedNfts);

    useEffect(() => {
        if (depositedNfts) {
            const job = new cron.CronJob('0 */10 * * * *', async function () {
                // check for expiration
                let isTokenExpired = await checkExpirationDate(depositedNfts, Math.floor(Date.now() / 1000));
                if (isTokenExpired) {
                    setDepositedNfts(await getItems());
                }
            });
            job.start();
        }
    }, [depositedNfts]);

    useEffect(async () => {
        if (user?.isLoggedIn) {
            setSignedIn(true);
        } else {
            setSignedIn(false);
        }
    }, [user]);

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
            <div className="mx-auto pt-12 pb-4 px-4 max-w-7xl sm:px-6 lg:pt-24 lg:pb-4">
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
                            modules={[Autoplay, Pagination]}
                            loop={false}
                            loopFillGroupWithBlank={true}
                            pagination={{
                                clickable: true,
                            }}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: true,
                            }}
                            className="w-100 h-100"
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 0,
                                    slidesPerGroup: 1,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 0,
                                    slidesPerGroup: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 0,
                                    slidesPerGroup: 3,
                                },
                            }}>
                            {depositedNfts.map((el, index) => (
                                <SwiperSlide className="block py-6 px-4 sm:p-12" key={el.itemId}>
                                    <Image
                                        className=" rounded-md"
                                        height={300}
                                        width={300}
                                        layout="responsive"
                                        src={el.imageUrl}
                                        alt={'NFT Image'}
                                    />
                                    <div className="grid grid-flow-row ">
                                        <div className="text-md grid grid-flow-col">
                                            <p className="py-4 font-bold font-medium">
                                                {kingdoms[el.tokenId].title && kingdoms[el.tokenId].title.replace('Patchwork Kingdom ', '')}
                                            </p>
                                            <div className="text-right">
                                                <button
                                                    onClick={() => {
                                                        if (!user?.isLoggedIn) {
                                                            signIn();
                                                        }
                                                        setTransactionType({ isDeposit: false, isPurchase: true });
                                                        setIsModalOpen(true);
                                                        setSelectedNft(el);
                                                    }}
                                                    className="mt-2 py-1 w-16 rounded-md bg-teal-500 text-white cursor-pointer font-bold hover:bg-teal-600">
                                                    Buy
                                                </button>
                                                <div className="mt-2 text-md text-right text-gray-600 text-xs">
                                                    <span className="font-bold ">Min. Price:</span>{' '}
                                                    {calculateMinPrice(el.price / 10 ** 18).minPrice} ETH{' '}
                                                    <div className="text-gray-500">
                                                        *Available for purchase until {convertExpirationToDate(el.expiration)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <Loading></Loading>
                    )}
                    <p className="text-md text-gray-500 text-center">
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
