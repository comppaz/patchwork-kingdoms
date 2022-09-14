import Loading from './Loading';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import Link from 'next/link';
import Statistics from './Statistics';

export default function Table({ data, exchangeRate }) {
    const [tableData, setTableData] = useState();
    const minPages = 1;
    const maxPages = 10;
    const maxEntriesOnPage = 100;
    const [currentStartNft, setCurrentStartNft] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    /** sort incoming dataset according to its ranking */
    useEffect(() => {
        if (data !== undefined && exchangeRate !== 0) {
            setTableData(
                data.sort((currentNft, previousNft) => {
                    currentNft.usd = convertToUSD(currentNft.eth, exchangeRate);
                    return currentNft.rank - previousNft.rank;
                }),
            );
        }
    }, [data, exchangeRate]);

    /** update the displayed data */
    useEffect(() => {
        setTableData(data);
    }, [tableData, currentPage, currentStartNft]);
    const sortDataByRankDown = attribute => {
        tableData.sort((currentNft, previousNft) => {
            return previousNft[attribute] - currentNft[attribute];
        });
        setTableData([...tableData]);
    };

    const sortDataByRankUp = attribute => {
        tableData.sort((currentNft, previousNft) => {
            return currentNft[attribute] - previousNft[attribute];
        });
        setTableData([...tableData]);
    };

    const setNext = () => {
        if (currentPage != maxPages) {
            setCurrentPage(currentPage + 1);
            setCurrentStartNft(currentStartNft + maxEntriesOnPage);
        }
    };

    const setPrevious = () => {
        if (currentPage != minPages) {
            setCurrentPage(currentPage - 1);
            setCurrentStartNft(currentStartNft - maxEntriesOnPage);
        }
    };

    const roundPriceValue = price => {
        if (price) {
            return price.toFixed(2);
        }
    };

    const convertToUSD = (eth, exchangeRate) => {
        return eth * exchangeRate;
    };

    return (
        <div className="bg-white">
            <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
                <div className="space-y-12">
                    <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Leaderboard</h2>
                        <Statistics stats={tableData} />
                        <p className="text-xl text-gray-500">A list of all nfts and its current ranking.</p>
                    </div>
                    {/** desktop view */}
                    <div className="hidden sm:inline-block min-w-full py-2 align-middle">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            {tableData ? (
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"></th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Rank
                                                <br />
                                                <span>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankDown('rank');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronUpIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankUp('rank');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                </span>
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                NFT Id
                                                <br />
                                                <span>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankDown('nft_id');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronUpIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankUp('nft_id');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                </span>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Funds raised to date (ETH/USD)
                                                <br />
                                                <span>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankDown('eth');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronUpIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankUp('eth');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                </span>
                                            </th>

                                            <th></th>

                                            <th scope="col" className="py-3.5 text-left text-sm font-semibold text-gray-900">
                                                {' '}
                                                Current Owner{' '}
                                            </th>

                                            <th scope="col" className="py-3.5  text-left text-sm font-semibold text-gray-900 sm:pl-6"></th>
                                            <th
                                                scope="col"
                                                className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"></th>
                                        </tr>
                                    </thead>
                                    {/** table with simple pagination */}
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {tableData.slice(currentStartNft, currentPage * maxEntriesOnPage).map(nft => (
                                            <tr key={nft.nft_id}>
                                                <td className="p-0 m-0 text-sm font-medium text-gray-900 w-32 ">
                                                    <Link href={`/nft/${nft.nft_id}`}>
                                                        <a className="p-0 m-0">
                                                            <Image
                                                                width={100}
                                                                height={100}
                                                                className="shadow-sm rounded-sm p-0 m-0"
                                                                layout="fixed"
                                                                src={`https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.fra1.digitaloceanspaces.com/thumbnail/${nft.nft_id}.png`}
                                                                alt={nft.title + ' NFT Image'}
                                                            />
                                                        </a>
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{nft.rank}</td>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    <a href={`/nft/${nft.nft_id}`}>{nft.nft_id}</a>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {roundPriceValue(nft.eth)} ETH / {roundPriceValue(nft.usd)} $
                                                </td>

                                                <td className="whitespace-nowrap py-4 text-sm text-gray-500">
                                                    <a
                                                        href={nft.nft_owner_url.replace(
                                                            'https://opensea.io/',
                                                            'https://etherscan.io/address/',
                                                        )}>
                                                        {`${nft.nft_owner_url
                                                            .replace('https://opensea.io/', '')
                                                            .substr(0, 12)}...${nft.nft_owner_url
                                                            .replace('https://opensea.io/', '')
                                                            .substr(20)}`}
                                                    </a>
                                                </td>

                                                <td className="whitespace-nowrap py-4 text-sm text-gray-500">
                                                    <a href={nft.nft_owner_url}>
                                                        {!nft.nft_owner_name && nft.nft_owner_url ? (
                                                            <p>Unnamed</p>
                                                        ) : (
                                                            <p>{nft.nft_owner_name}</p>
                                                        )}
                                                    </a>
                                                </td>

                                                <td className="whitespace-nowrap pr-3 py-4 text-sm text-gray-500 text-center">
                                                    <a
                                                        href={`/nft/${nft.nft_id}`}
                                                        target="_blank"
                                                        className="bg-gray-100 border hover:bg-teal-700 hover:text-white text-black font-bold py-2 px-4 ml-2 rounded center"
                                                        rel="noreferrer">
                                                        View NFT
                                                    </a>
                                                </td>
                                                <td className="whitespace-nowrap py-4 pl-3 text-sm text-gray-500 text-left">
                                                    <a
                                                        href={`https://opensea.io/assets/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/${nft.nft_id}`}
                                                        target="_blank"
                                                        rel="noreferrer">
                                                        <Image
                                                            src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg"
                                                            alt="Opensea Thumbnail Logo"
                                                            width={20}
                                                            height={20}></Image>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <Loading />
                            )}
                        </div>
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => {
                                        setPrevious();
                                    }}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Previous
                                </button>
                                <p className="text-sm text-gray-700">
                                    page <span className="font-medium">{currentPage}</span> of{' '}
                                    <span className="font-medium">{maxPages}</span>
                                </p>
                                <button
                                    onClick={() => {
                                        setNext();
                                    }}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Currently on page <span className="font-medium">{currentPage}</span> of{' '}
                                        <span className="font-medium">{maxPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => {
                                                setPrevious();
                                            }}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setNext();
                                            }}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Next</span>
                                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/** mobile view */}
                    <div className="visible sm:hidden">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            {tableData ? (
                                <table className="max-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                NFT
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Rank
                                                <br />
                                                <span>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankDown('rank');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronUpIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankUp('rank');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                </span>
                                            </th>
                                            {/** 
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                NFT Id
                                                <br />
                                                <span>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankDown('nft_id');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronUpIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankUp('nft_id');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                </span>
                                            </th>
                                            */}
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Funds raised (in ETH)
                                                <br />
                                                <span>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankDown('eth');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronUpIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            sortDataByRankUp('eth');
                                                        }}
                                                        className="inline-flex items-center w-4 h-4">
                                                        <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </button>
                                                </span>
                                            </th>

                                            <th scope="col" className="py-3.5 text-left text-sm font-semibold text-gray-900">
                                                {' '}
                                                Transaction Details{' '}
                                            </th>

                                            <th scope="col" className="py-3.5  text-left text-sm font-semibold text-gray-900 sm:pl-6"></th>
                                            <th
                                                scope="col"
                                                className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"></th>
                                        </tr>
                                    </thead>
                                    {/** table with simple pagination */}
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {tableData.slice(currentStartNft, currentPage * maxEntriesOnPage).map(nft => (
                                            <tr key={nft.nft_id}>
                                                <td className="p-0 m-0 text-sm font-medium text-gray-900 w-32 ">
                                                    <Link href={`/nft/${nft.nft_id}`}>
                                                        <a className="p-0 m-0">
                                                            <Image
                                                                width={100}
                                                                height={100}
                                                                className="shadow-sm rounded-sm p-0 m-0"
                                                                layout="fixed"
                                                                src={`https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.fra1.digitaloceanspaces.com/thumbnail/${nft.nft_id}.png`}
                                                                alt={nft.title + ' NFT Image'}
                                                            />
                                                        </a>
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{nft.rank}</td>
                                                {/** 
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    <a href={`/nft/${nft.nft_id}`}>{nft.nft_id}</a>
                                                </td>
                                                */}
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {roundETHValue(nft.eth)}
                                                </td>
                                                {/** 
                                                <td className="whitespace-nowrap py-4 text-sm text-gray-500">
                                                    <a
                                                        href={nft.nft_owner_url.replace(
                                                            'https://opensea.io/',
                                                            'https://etherscan.io/address/',
                                                        )}>
                                                        {`${nft.nft_owner_url
                                                            .replace('https://opensea.io/', '')
                                                            .substr(0, 12)}...${nft.nft_owner_url
                                                            .replace('https://opensea.io/', '')
                                                            .substr(20)}`}
                                                    </a>
                                                </td>
                                                <td className="whitespace-nowrap pr-3 py-4 text-sm text-gray-500 text-center">
                                                    <a
                                                        href={`/nft/${nft.nft_id}`}
                                                        target="_blank"
                                                        className="bg-gray-100 border hover:bg-teal-700 hover:text-white text-black font-bold py-2 px-4 ml-2 rounded center"
                                                        rel="noreferrer">
                                                        View NFT
                                                    </a>
                                                </td>
                                                */}
                                                <td className="whitespace-nowrap py-4 pl-3 text-sm text-gray-500 text-left">
                                                    <a
                                                        href={`https://opensea.io/assets/ethereum/0xd24a7c412f2279b1901e591898c1e96c140be8c5/${nft.nft_id}`}
                                                        target="_blank"
                                                        rel="noreferrer">
                                                        <Image
                                                            src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg"
                                                            alt="Opensea Thumbnail Logo"
                                                            width={20}
                                                            height={20}></Image>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <Loading />
                            )}
                        </div>
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => {
                                        setPrevious();
                                    }}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Previous
                                </button>
                                <p className="text-sm text-gray-700">
                                    page <span className="font-medium">{currentPage}</span> of{' '}
                                    <span className="font-medium">{maxPages}</span>
                                </p>
                                <button
                                    onClick={() => {
                                        setNext();
                                    }}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Currently on page <span className="font-medium">{currentPage}</span> of{' '}
                                        <span className="font-medium">{maxPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => {
                                                setPrevious();
                                            }}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setNext();
                                            }}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Next</span>
                                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
