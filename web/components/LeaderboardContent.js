import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function LeaderboardContent({
    sortDataByRankDown,
    sortDataByRankUp,
    tableData,
    calculateRankChanges,
    roundPriceValue,
    convertToUSD,
    currentStartNft,
    currentPage,
}) {
    const maxEntriesOnPage = 100;

    return (
        <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Rank (changes weekly) <br />
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
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        PWK{' '}
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
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
                        Patchwork Kingdom Royalty{' '}
                    </th>

                    <th scope="col" className="py-3.5  text-left text-sm font-semibold text-gray-900 sm:pl-6"></th>
                    <th scope="col" className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"></th>
                </tr>
            </thead>
            {/** table with simple pagination */}
            <tbody className="divide-y divide-gray-200 bg-white">
                {tableData.slice(currentStartNft, currentPage * maxEntriesOnPage).map(nft => (
                    <tr key={nft.nft_id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {nft.rank == 1 && <span>🥇</span>} {nft.rank == 2 && <span>🥈</span>} {nft.rank == 3 && <span>🥉</span>}
                            {nft.rank} ({calculateRankChanges(nft)})
                        </td>
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
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            <a href={`/nft/${nft.nft_id}`}>{nft.nft_id}</a>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {roundPriceValue(nft.eth, 3)} ETH / {roundPriceValue(convertToUSD(nft.eth), 3)} $
                        </td>

                        <td className="whitespace-nowrap py-4 text-sm text-gray-500">
                            <a href={nft.nft_owner_url.replace('https://opensea.io/', 'https://etherscan.io/address/')}>
                                {`${nft.nft_owner_url.replace('https://opensea.io/', '').substr(0, 12)}...${nft.nft_owner_url
                                    .replace('https://opensea.io/', '')
                                    .substr(20)}`}
                            </a>
                        </td>

                        <td className="whitespace-nowrap py-4 text-sm text-gray-500">
                            <a href={nft.nft_owner_url}>
                                {!nft.nft_owner_name && nft.nft_owner_url ? <p>Unnamed</p> : <p>{nft.nft_owner_name}</p>}
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
    );
}
