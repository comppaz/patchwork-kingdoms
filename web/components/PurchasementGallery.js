import { useEffect, useState } from 'react';
import { getItems } from '../lib/contractInteraction';
import Modal from './donation/Modal';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
export default function PurchasementGallery({
    heading: heading,
    caption: caption,
    status: status,
    walletAddress: walletAddress,
    isModalOpen: isModalOpen,
    setIsModalOpen: setIsModalOpen,
}) {
    const [selectedNft, setSelectedNft] = useState(null);
    const [depositedNfts, setDepositedNfts] = useState([]);
    const [transactionType, setTransactionType] = useState({});

    useEffect(() => {
        (async () => {
            setDepositedNfts(await getItems());
        })();
    }, []);

    return (
        <div className="bg-white">
            <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
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
                            status={status}
                            walletAddress={walletAddress}
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
                                <div key={index}>
                                    <SwiperSlide className="block">
                                        <Image
                                            className=" rounded-md"
                                            height={300}
                                            width={300}
                                            layout="responsive"
                                            src={el.url}
                                            alt={'Test Token Image'}
                                        />

                                        <p className="text-md text-gray-500">TestToken #{el.tokenId}</p>

                                        <button
                                            onClick={() => {
                                                setTransactionType({ isDeposit: false, isPurchasement: true });
                                                setIsModalOpen(true);
                                                setSelectedNft(el);
                                            }}
                                            className="cursor-pointer text-gray-400 hover:text-gray-500">
                                            <span className="sr-only">Buy</span>
                                            Buy
                                        </button>
                                    </SwiperSlide>
                                </div>
                            ))}
                        </Swiper>
                    ) : (
                        <div>Loading?</div>
                    )}
                </div>
            </div>
        </div>
    );
}
