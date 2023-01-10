import { useEffect, useState, useContext } from 'react';
import { getItems } from '../lib/contractInteraction';
import Modal from './donation/Modal';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import AddressContext from '../context/AddressContext';

export default function PurchasementGallery({
    heading: heading,
    caption: caption,
    isModalOpen: isModalOpen,
    setIsModalOpen: setIsModalOpen,
}) {
    const [selectedNft, setSelectedNft] = useState(null);
    const [depositedNfts, setDepositedNfts] = useState([]);
    const [transactionType, setTransactionType] = useState({});
    const { walletAddress, updateWalletAddress, walletStatus } = useContext(AddressContext);
    useEffect(() => {
        (async () => {
            setDepositedNfts(await getItems());
        })();
    }, [walletAddress, walletStatus, isModalOpen]);

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

                                    <p className="text-md text-gray-500">TestToken #{el.tokenId}</p>
                                    <div>
                                        <span className="text-gray-600"> {el.price / 10 ** 18} ETH </span>
                                        <button
                                            onClick={() => {
                                                setTransactionType({ isDeposit: false, isPurchase: true });
                                                setIsModalOpen(true);
                                                setSelectedNft(el);
                                            }}
                                            className="cursor-pointer underline text-teal-500 hover:text-teal-700">
                                            <span className="sr-only">Buy</span>
                                            Buy
                                        </button>
                                    </div>
                                </SwiperSlide>
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
