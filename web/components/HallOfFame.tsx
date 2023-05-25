import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HallOfFame({ donators }) {
    const [rankedDonators, setRankedDonators] = useState([]);

    useEffect(() => {
        donators.forEach(don => {
            const obj = rankedDonators.find(el => el.address === don.address);
            if (obj) {
                obj.salePrice = obj.salePrice + don.salePrice;
            } else {
                rankedDonators.push(don);
            }
        });
        setRankedDonators(
            rankedDonators.sort((currentNft, previousNft) => {
                return previousNft.salePrice - currentNft.salePrice;
            }),
        );
    }, [donators]);

    console.log(rankedDonators);

    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                <h3 className="col-span-2 text-xl text-gray-500">
                    A list of generous Royalty members who have directly donated their PWK to Giga. By donating, all the proceeds from their
                    PWK sale have gone to UNICEF to help support Giga&apos;s mission in connecting schools.
                </h3>
                <p className="text-md text-gray-500 font-bold">
                    Want to join the Hall of Fame? Donate your PWK today. Go to your{' '}
                    <Link href="/dashboard">
                        <a target="_blank" className=" text-teal-500 inline-flex font-medium underline hover:text-teal-700">
                            Dashboard
                        </a>
                    </Link>
                    .
                </p>
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {rankedDonators.slice(0, 3).map((don, index) => (
                    <div className=" w-13/15 px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6" key={index}>
                        <dt className="text-sm font-medium text-gray-500 truncate">Rank: {index + 1}</dt>
                        <dd className="text-sm font-medium text-gray-500 truncate">Total Sale: {don.salePrice} ETH</dd>
                        <dd className="text-sm font-medium text-gray-500 truncate">
                            Address: {`${don.address.replace(don.address.substr(12, 24), '...')}`}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
