import Loading from './Loading';
import { useState, useEffect } from 'react';
import Statistics from './Statistics';
import LeaderboardFooter from './LeaderboardFooter';
import LeaderboardContent from './LeaderboardContent';
import HallOfFame from './HallOfFame';
import Link from 'next/link';

export default function Leaderboard({ data, fixedAuctionValue, roundPriceValue, convertToUSD, donators }) {
    const minHallOfFameDonators = 1;

    const [tableData, setTableData] = useState([]);
    const [currentStartNft, setCurrentStartNft] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isHallOfFame, setIsHallOfFame] = useState(false);
    const [successfulDonators, setSuccessfulDonators] = useState([]);

    /** sort incoming dataset according to its ranking */
    useEffect(() => {
        if (data !== undefined) {
            setTableData(
                data.sort((currentNft, previousNft) => {
                    return currentNft.rank - previousNft.rank;
                }),
            );
        }
    }, [data]);

    useEffect(() => {
        if (donators !== undefined && donators.length !== 0) {
            donators.forEach(don => {
                if (!don.isSold) {
                    setIsHallOfFame(false);
                } else {
                    setIsHallOfFame(true);
                    successfulDonators.push(don);
                }
            });
        }
    }, [donators]);

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

    const calculateRankChanges = nft => {
        let rankChange = 0;
        let rankChangeResult: string;
        if (nft.weeklyRank) {
            rankChange = nft.rank - nft.weeklyRank;
        }
        // modify output with respective sign for each value
        switch (true) {
            case rankChange > 0:
                rankChangeResult = '+'.concat(rankChange.toString());
                break;
            case rankChange < 0:
                break;
            case rankChange === 0:
                rankChangeResult = '+-'.concat(rankChange.toString());
                break;
        }
        return rankChangeResult;
    };

    const totalDonators = donators => {
        let totalDonators = new Set(
            donators.map(don => {
                don.address;
                console.log(don.address);
            }),
        ).size;
        console.log(totalDonators);
        return totalDonators;
    };

    return (
        <div className="bg-white">
            <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6  lg:py-24">
                <div className="space-y-5 sm:space-y-4">
                    <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Leaderboard</h2>
                        {isHallOfFame ? (
                            <>
                                <div className="grid grid-cols-3 gap-4">
                                    <h4 className="col-span-2 text-2xl font-extrabold tracking-tight sm:text-xl">Hall of Fame</h4>
                                </div>
                                <HallOfFame donators={successfulDonators} />
                            </>
                        ) : null}
                        {/**
                         */}
                        <h4 className="text-2xl font-extrabold tracking-tight sm:text-xl">Summaries</h4>
                        <Statistics
                            stats={tableData}
                            fixedAuctionValue={fixedAuctionValue}
                            roundPriceValue={roundPriceValue}
                            convertToUSD={convertToUSD}
                        />
                        <h4 className="text-2xl font-extrabold tracking-tight sm:text-xl">Patchwork Kingdom Royalty Ranks 👑</h4>
                    </div>
                    {/** desktop view */}
                    <div className="hidden sm:inline-block min-w-full py-2 align-middle">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            {tableData ? (
                                <LeaderboardContent
                                    sortDataByRankDown={sortDataByRankDown}
                                    sortDataByRankUp={sortDataByRankUp}
                                    tableData={tableData}
                                    calculateRankChanges={calculateRankChanges}
                                    roundPriceValue={roundPriceValue}
                                    convertToUSD={convertToUSD}
                                    currentStartNft={currentStartNft}
                                    currentPage={currentPage}
                                />
                            ) : (
                                <Loading />
                            )}
                        </div>
                        <LeaderboardFooter
                            currentStartNft={currentStartNft}
                            setCurrentStartNft={setCurrentStartNft}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                    {/** mobile view */}
                    <div className="visible sm:hidden">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            {tableData ? (
                                <LeaderboardContent
                                    sortDataByRankDown={sortDataByRankDown}
                                    sortDataByRankUp={sortDataByRankUp}
                                    tableData={tableData}
                                    calculateRankChanges={calculateRankChanges}
                                    roundPriceValue={roundPriceValue}
                                    convertToUSD={convertToUSD}
                                    currentStartNft={currentStartNft}
                                    currentPage={currentPage}
                                />
                            ) : (
                                <Loading />
                            )}
                        </div>
                        <LeaderboardFooter
                            currentStartNft={currentStartNft}
                            setCurrentStartNft={setCurrentStartNft}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
