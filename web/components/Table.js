import Loading from "./Loading"
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";

export default function Table({data}) {
    const [tableData, setTableData] = useState();
    const minPages = 1;
    const maxPages = 10;
    const maxEntriesOnPage = 100;
    const [currentStartNft, setCurrentStartNft] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setTableData(data)
        console.log('TESR')
    }, [data, tableData, currentPage, currentStartNft]);
    
    const sortDataByRankDown = (attribute) => {
        console.log('SORTING')
        tableData.sort((currentNft, previousNft) => {
            return previousNft[attribute] - currentNft[attribute];
        });
        setTableData([...tableData]);
    }

    const sortDataByRankUp = (attribute) => {
        tableData.sort((currentNft, previousNft) => {
            return currentNft[attribute] - previousNft[attribute];
        });
        setTableData([...tableData]);
    }

    const setNext = () => {
        console.log("SETTING NEXT PAGE")
        if(currentPage != maxPages){
            setCurrentPage(currentPage + 1);
            setCurrentStartNft(currentStartNft + maxEntriesOnPage);
            console.log(currentStartNft * currentPage - 1)
        }
    }

    const setPrevious = () => {
        console.log("SETTING PREV PAGE")
        if(currentPage != minPages){
            setCurrentPage(currentPage - 1);
            setCurrentStartNft(currentStartNft - maxEntriesOnPage);
            console.log(currentStartNft * currentPage - 1)
        }
    }

    const roundETHValue = (eth) => {
        return eth.toFixed(2);
    }  
       
    return (
    <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
            <br/>
            <h1 className="text-xl font-semibold text-gray-900">Leaderboard</h1>
            <p className="mt-2 text-sm text-gray-700">
                A list of all nfts and it's current ranking.
            </p>
            </div>
        </div>
        <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {tableData? 
                    <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        #NFT
                        <br/>
                            <span>
                                <button onClick={() => {sortDataByRankDown("nft_id")}} class="inline-flex items-center w-4 h-4">
                                    <ChevronUpIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                </button>                            
                                <button onClick={() => {sortDataByRankUp("nft_id")}} class="inline-flex items-center w-4 h-4">
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                </button>       
                            </span>
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Funds raised to date
                        <br/>
                            <span>
                                <button onClick={() => {sortDataByRankDown("eth")}} class="inline-flex items-center w-4 h-4">
                                    <ChevronUpIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                </button>                            
                                <button onClick={() => {sortDataByRankUp("eth")}} class="inline-flex items-center w-4 h-4">
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                </button>       
                            </span>  
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Rank
                        <br/>
                            <span>
                                <button onClick={() => {sortDataByRankDown("rank")}} class="inline-flex items-center w-4 h-4">
                                    <ChevronUpIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                </button>                            
                                <button onClick={() => {sortDataByRankUp("rank")}} class="inline-flex items-center w-4 h-4">
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                </button>       
                            </span>                    
                        </th>
                    </tr>
                    </thead>
                        {/** 
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {tableData.map((nft) => (
                            <tr key={nft.nft_id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    {nft.nft_id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{nft.eth}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{nft.rank}</td>
                                </tr>
                            ))}
                        </tbody>*/}
                        {/** table with simple pagination */}
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {tableData.slice(((currentStartNft)), currentPage*(maxEntriesOnPage)).map((nft) => (
                            <tr key={nft.nft_id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    {nft.nft_id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{roundETHValue(nft.eth)}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{nft.rank}</td>
                                </tr>
                            ))}
                        </tbody>

                </table>
                : <Loading/>}
                </div>
                {/** Navigation for Paging */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                        onClick={() => {setPrevious()}}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                        Previous
                        </button>
                        <p className="text-sm text-gray-700">
                            page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{maxPages}</span>
                        </p>
                        <button
                        onClick={() => {setNext()}}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                        Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                        <p className="text-sm text-gray-700">
                            Currently on page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{maxPages}</span>
                        </p>
                        </div>
                        <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                            onClick={() => {setPrevious()}}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                            onClick={() => {setNext()}}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
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
    )
}