import { useState, useEffect } from 'react';

export default function Statistics({ stats, fixedAuctionValue, roundPriceValue, convertToUSD }) {
    var [overallFunds, setOverallFunds] = useState(0);
    var [overallOwner, setOverallOwner] = useState(0);

    /** calculate overall stats based on incoming dataset  */
    useEffect(() => {
        if (stats && stats.length !== 0) {
            if (overallFunds === 0) {
                calculateOverallFunds(stats);
            }
            if (overallOwner === 0) {
                calculateOverallOwner(stats);
            }
        }
    }, [stats]);

    const calculateOverallOwner = stats => {
        let allOwners = stats.reduce((resultOwner, current) => {
            // count only if nft is sold and has valid owner url
            if (current.nft_owner_url !== '') {
                resultOwner[current.nft_owner_url] !== undefined
                    ? (resultOwner[current.nft_owner_url] += 1)
                    : (resultOwner[current.nft_owner_url] = 1);
            }
            return resultOwner;
        }, {});
        overallOwner = Object.keys(allOwners).length;
        setOverallOwner(overallOwner);
    };

    const calculateOverallFunds = stats => {
        stats.forEach(nft => {
            overallFunds += nft.eth;
        });
        overallFunds += fixedAuctionValue;
        setOverallFunds(overallFunds);
    };

    return (
        <div>
            <h3 className="text-xl text-gray-500">
                The leadership board of the PWK Royalty, displaying the rankings as per the highest funds raised to date.
            </h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Proceeds raised to date</dt>
                    <dd className="mt-1 text-3xl tracking-tight font-semibold text-gray-900">{roundPriceValue(overallFunds, 2)} ETH</dd>
                </div>
                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate"> Total unique PWK owners</dt>
                    <dd className="mt-1 text-3xl tracking-tight font-semibold text-gray-900">{overallOwner}</dd>
                </div>
            </dl>
        </div>
    );
}
