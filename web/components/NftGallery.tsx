import { useEffect, useState, FunctionComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from 'next/image';
import Loading from './Loading';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import Modal from './donation/Modal';
import kingdoms from '../data/kingdoms';

var pageCounter = 100;
const pageIncrement = 100;

interface IProps {
    nfts: any[];
    heading: string;
    caption: string;
    footer: string;
    isDonateActivate: boolean;
    isModalOpen?: boolean;
    setIsModalOpen?: (isOpen: boolean) => void;
}

export const NftGallery: FunctionComponent<IProps> = ({
    nfts: nfts,
    heading: heading,
    caption: caption,
    footer: footer,
    isDonateActivate: isDonateActivated,
    isModalOpen: isModalOpen,
    setIsModalOpen: setIsModalOpen,
}) => {
    const [allnfts, setAllnfts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const [selectedNft, setSelectedNft] = useState(null);
    const [transactionType, setTransactionType] = useState({});

    const shareUrl = 'https://www.patchwork-kingdoms.com/gallery';
    const shareTitle = 'Patchwork Kingdom NFT';
    const shareDescription = 'This is my Patchwork Kingdom NFT!';

    useEffect(() => {
        if (nfts === undefined) {
            console.log('not ready');
        } else {
            if (nfts.length > 0 && allnfts.length === 0) {
                setAllnfts(nfts.slice(0, pageIncrement));
                setHasMore(true);

                if (nfts.length < pageIncrement) setHasMore(false);
            }

            if (nfts.length === 0 && allnfts.length === 0) {
                setHasMore(false);
            }
        }
    });

    function fetchData() {
        setAllnfts(allnfts.concat(nfts.slice(pageCounter, pageCounter + pageIncrement)));
        pageCounter = pageCounter + pageIncrement;

        if (pageCounter === nfts.length) setHasMore(false);
    }

    return (
        <div className="bg-white">
            <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:pt-10 lg:pb-24">
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
                    </div>
                    <InfiniteScroll
                        dataLength={allnfts.length} // This is important field to render the next data
                        next={fetchData}
                        hasMore={hasMore}
                        loader={<Loading />}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>{footer}</b>
                            </p>
                        }>
                        {allnfts && (
                            <ul
                                role="list"
                                className="mt-2 mb-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8">
                                {allnfts.map((nft, index) => (
                                    <li key={index}>
                                        <div className="space-y-4">
                                            <div className="aspect-w-3 aspect-h-3">
                                                <a href={`/nft/${nft.tokenId}`}>
                                                    <Image
                                                        className="object-cover shadow-lg rounded-lg"
                                                        //layout="fill"
                                                        layout="responsive"
                                                        width={300}
                                                        height={300}
                                                        src={nft.imageUrl}
                                                        alt={nft.title + ' NFT Image'}
                                                    />
                                                </a>
                                                <div className="grid grid-flow-row ">
                                                    <div className="text-md grid grid-flow-col">
                                                        <p className="py-4 font-bold font-medium">
                                                            {kingdoms[nft.tokenId].title &&
                                                                kingdoms[nft.tokenId].title.replace('Patchwork Kingdom ', '')}
                                                        </p>
                                                        <div className="text-right">
                                                            <button
                                                                onClick={() => {
                                                                    setTransactionType({ isDeposit: true, isPurchase: false });
                                                                    setIsModalOpen(true);
                                                                    setSelectedNft(nft);
                                                                }}
                                                                className="mt-2 py-1 w-16 rounded-md bg-teal-500 text-white cursor-pointer font-bold hover:bg-teal-600">
                                                                Donate
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {/** 
                                                {isDonateActivated ? (
                                                    <div>
                                                        <div className="flex flex-row justify-between items-start ">
                                                            <h3 className="text-lg leading-6 font-medium space-y-1">{nft.title}</h3>
                                                            <button
                                                                onClick={() => {
                                                                    setTransactionType({ isDeposit: true, isPurchase: false });
                                                                    setIsModalOpen(true);
                                                                    setSelectedNft(nft);
                                                                }}
                                                                className="mt-2 py-1 w-16 rounded-md bg-teal-500 text-white cursor-pointer font-bold hover:bg-teal-600">
                                                                Donate
                                                            </button>
                                                        </div>
                                                        <p className="text-indigo-600">Token Id: {nft.tokenId}</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-lg leading-6 font-medium space-y-1">
                                                        <h3>{nft.title}</h3>
                                                        <p className="text-indigo-600">Token Id: {nft.tokenId}</p>
                                                    </div>
                                                )}*/}
                                                <ul role="list" className="flex space-x-5">
                                                    <li>
                                                        <a href={`/nft/${nft.tokenId}`} className="text-gray-400 hover:text-gray-500">
                                                            <span className="sr-only">Learn More</span>
                                                            Learn More
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href={nft.openseaUrl}
                                                            target="_blank"
                                                            className="text-gray-400 hover:text-gray-500"
                                                            rel="noreferrer">
                                                            <span className="sr-only">Opensea</span>
                                                            View on Opensea
                                                        </a>
                                                    </li>
                                                    <li>
                                                        {nft.highresDownloadUrl != '' ? (
                                                            <a
                                                                href={nft.highresDownloadUrl}
                                                                target="_blank"
                                                                className="text-gray-400 hover:text-gray-500"
                                                                rel="noreferrer">
                                                                <span className="sr-only"> Download High-Res</span>Download High-Res
                                                            </a>
                                                        ) : (
                                                            <span></span>
                                                        )}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
};

export default NftGallery;
