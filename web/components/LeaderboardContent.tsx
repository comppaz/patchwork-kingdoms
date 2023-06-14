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
                        Weekly Rank <br />
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
                    <th scope="col" className="px-3 py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-6 sm:pr-3">
                        PWK <br />
                        <span className="sm:invisible pl-0 pr-3">
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
                        <p className="invisible">a</p>
                    </th>
                    <th scope="col" className="hidden sm:table-cell py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        NFT ID
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
                        <p className="hidden sm:flex">Funds raised to date (ETH/USD)</p>
                        <p className="visible sm:hidden">Funds raised</p>
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

                    {/** empty col for address */}
                    <th className="hidden sm:table-cell"></th>
                    {/** name col */}
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <p className="hidden sm:flex">Patchwork Kingdom Royalty </p>
                        <p className="visible sm:hidden">PWK Royalty</p>
                        <p className="invisible">a</p>
                    </th>
                    {/** CTA button */}
                    <th scope="col" className="hidden lg:table-cell py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                    {/** OpenSea button */}
                    <th scope="col" className="py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                </tr>
            </thead>
            {/** table with simple pagination */}
            <tbody className="divide-y divide-gray-200 bg-white">
                {tableData.slice(currentStartNft, currentPage * maxEntriesOnPage).map(nft => (
                    <tr key={nft.nft_id}>
                        <td className=" px-3 py-4 text-sm text-gray-500">
                            {nft.rank == 1 && <p className="text-center text-2xl">🥇</p>}{' '}
                            {nft.rank == 2 && <p className="text-center text-2xl">🥈</p>}{' '}
                            {nft.rank == 3 && <p className="text-center text-2xl">🥉</p>}
                            <p className=" text-center">
                                {' '}
                                <span>{nft.rank}</span>
                                <span className="hidden sm:table-cell">({calculateRankChanges(nft)})</span>
                            </p>{' '}
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
                            <dl className="lg:hidden">
                                <dt className="sr-only sm:hidden">ID</dt>
                                <dd className="mt-1 mb-1 truncate whitespace-nowrap  text-xs font-small text-gray-900 sm:pl-6 sm:hidden">
                                    ID:
                                    <a href={`/nft/${nft.nft_id}`}>{nft.nft_id}</a>
                                </dd>
                            </dl>
                        </td>
                        <td className="hidden sm:table-cell whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            <a href={`/nft/${nft.nft_id}`}>{nft.nft_id}</a>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <p className="hidden sm:flex">
                                {roundPriceValue(nft.eth, 3)} ETH / {roundPriceValue(convertToUSD(nft.eth), 3)} $
                            </p>
                            <p className="visible sm:hidden">{roundPriceValue(nft.eth, 2)} ETH</p>
                        </td>

                        {/** address col */}
                        <td className="hidden md:table-cell whitespace-nowrap py-4 text-sm text-gray-500">
                            <a href={nft.nft_owner_url.replace('https://opensea.io/', 'https://etherscan.io/address/')}>
                                {`${nft.nft_owner_url.replace('https://opensea.io/', '').substr(0, 12)}...${nft.nft_owner_url
                                    .replace('https://opensea.io/', '')
                                    .substr(20)}`}
                            </a>
                        </td>

                        {/** name col */}
                        <td className="hidden sm:table-cell whitespace-nowrap py-4 text-sm text-gray-500">
                            <a href={nft.nft_owner_url}>
                                {!nft.nft_owner_name && nft.nft_owner_url ? <p>Unnamed</p> : <p>{nft.nft_owner_name}</p>}
                            </a>
                        </td>

                        {/** CTA col */}
                        <td className="hidden lg:table-cell whitespace-nowrap pr-3 py-4 text-sm text-gray-500 text-center">
                            <a
                                href={`/nft/${nft.nft_id}`}
                                target="_blank"
                                className="bg-gray-100 border hover:bg-teal-700 hover:text-white text-black font-bold py-2 px-4 ml-2 rounded center"
                                rel="noreferrer">
                                View NFT
                            </a>
                        </td>

                        {/** OpenSeaButton col */}
                        <td className="whitespace-nowrap pr-3 py-4 pl-3 text-sm text-gray-500 text-left">
                            <a
                                href={`https://opensea.io/assets/ethereum/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/${nft.nft_id}`}
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
