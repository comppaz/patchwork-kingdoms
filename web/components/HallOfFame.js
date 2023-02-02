import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HallOfFame({}) {
    const [seller, setSeller] = useState([]);

    /** calculate overall stats based on incoming dataset  */
    useEffect(() => {}, []);

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
                        <a className="inline-flex font-medium underline text-gray-500 hover:text-gray-900">Dashboard</a>
                    </Link>
                    .
                </p>
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">1</dt>
                    <dd className="mt-1 text-3xl tracking-tight font-semibold text-gray-900"></dd>
                </div>
                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">2</dt>
                    <dd className="mt-1 text-3xl tracking-tight font-semibold text-gray-900"></dd>
                </div>
                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">3</dt>
                    <dd className="mt-1 text-3xl tracking-tight font-semibold text-gray-900"></dd>
                </div>
            </dl>
        </div>
    );
}
