import { useState, useEffect } from 'react';

export default function Statistics({ stats }) {
    const [overallFunds, setOverallFunds] = useState(0);
    const [overallOwner, setOverallOwner] = useState(0);
    /** calculate overall stats based on incoming dataset  */
    useEffect(() => {
        console.log('yeah');
        if (stats !== undefined) {
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
        setOverallFunds(overallFunds);
    };

    const roundETHValue = eth => {
        return eth.toFixed(2);
    };

    return (
        <div>
            <h3 className="text-xl text-gray-500">Summaries of all nfts.</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Proceeds raised to date in ETH</dt>
                    <dd className="mt-1 text-3xl tracking-tight font-semibold text-gray-900">{roundETHValue(overallFunds)}</dd>
                </div>
                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total NFT Owner</dt>
                    <dd className="mt-1 text-3xl tracking-tight font-semibold text-gray-900">{overallOwner}</dd>
                </div>
            </dl>
        </div>
    );
}
