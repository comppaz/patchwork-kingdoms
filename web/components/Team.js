import { fetchStrapi } from '../lib/fetchData';
import { useState, useEffect } from 'react';

export default function Team() {
    const [partners, setPartners] = useState([]);
    const [advisors, setAdvisors] = useState([]);
    const [artist, setArtist] = useState(null);

    useEffect(async () => {
        let artistRes = await fetchStrapi('artist');
        let teamRes = await fetchStrapi('team-members');
        let advisorsRes = await fetchStrapi('advisors');

        setArtist(artistRes.data);
        setPartners(teamRes.data);
        setAdvisors(advisorsRes.data);
    }, []);

    return (
        <>
            <div className="bg-white">
                <div className="max-w-7xl mx-auto py-12 px-4 text-center sm:px-6 lg:px-8 lg:py-24">
                    <div className="space-y-12">
                        <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                The <span className="text-teal-600">Patchwork Kingdoms </span>Team
                            </h2>
                        </div>
                        {artist && artist.attributes ? (
                            <div className="space-y-6">
                                <img
                                    className="h-40 w-40 mx-auto rounded-full xl:w-56 xl:h-56"
                                    src={artist.attributes.Image.data.attributes.url}
                                    alt=""
                                />
                                <div className="space-y-2">
                                    <div className="text-lg leading-6 font-medium space-y-1">
                                        <h3>{artist.attributes.Name}</h3>
                                        <p className="text-teal-600">{artist.attributes.Role}</p>
                                    </div>
                                    <ul role="list" className="flex justify-center space-x-5">
                                        {artist.attributes.TwitterUrl ? (
                                            <li>
                                                <a href={artist.attributes.TwitterUrl} className="text-gray-400 hover:text-gray-500">
                                                    <span className="sr-only">Twitter</span>
                                                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                                    </svg>
                                                </a>
                                            </li>
                                        ) : null}

                                        {artist.attributes.Website ? (
                                            <li>
                                                <a href={artist.attributes.Website} className="text-gray-400 hover:text-gray-500">
                                                    <span className="sr-only">Website</span>

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                                        />
                                                    </svg>
                                                </a>
                                            </li>
                                        ) : null}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            false
                        )}
                        <ul
                            role="list"
                            className="mx-auto space-y-16 sm:grid sm:grid-cols-2 sm:gap-8 sm:space-y-0 lg:grid-cols-5 lg:max-w-7xl">
                            {partners.map(person => (
                                <li key={person.attributes.Name}>
                                    <div className="space-y-6">
                                        <img
                                            className="mx-auto h-40 w-40 rounded-full xl:w-56 xl:h-56"
                                            src={person.attributes.Image.data.attributes.url}
                                            alt=""
                                        />
                                        <div className="space-y-2">
                                            <div className="text-lg leading-6 font-medium space-y-1">
                                                <h3>{person.attributes.Name}</h3>
                                                <p className="text-teal-600">{person.attributes.Role}</p>
                                            </div>
                                            <ul role="list" className="flex justify-center space-x-5">
                                                {person.attributes.TwitterUrl ? (
                                                    <li>
                                                        <a
                                                            href={person.attributes.TwitterUrl}
                                                            className="text-gray-400 hover:text-gray-500">
                                                            <span className="sr-only">Twitter</span>
                                                            <svg
                                                                className="w-5 h-5"
                                                                aria-hidden="true"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20">
                                                                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                                            </svg>
                                                        </a>
                                                    </li>
                                                ) : null}

                                                {person.attributes.LinkedinUrl ? (
                                                    <li>
                                                        <a
                                                            href={person.attributes.LinkedinUrl}
                                                            className="text-gray-400 hover:text-gray-500">
                                                            <span className="sr-only">LinkedIn</span>
                                                            <svg
                                                                className="w-5 h-5"
                                                                aria-hidden="true"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </a>
                                                    </li>
                                                ) : null}
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-white">
                <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
                        <div className="space-y-5 sm:space-y-4 mx-auto">
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Meet Our Advisors</h2>
                        </div>
                        <div className="mx-auto lg:col-span-2">
                            <ul role="list" className="space-y-12 sm:grid sm:grid-cols-3 sm:gap-12 sm:space-y-0 lg:gap-x-8">
                                {advisors.map(person => (
                                    <li key={person.attributes.Name}>
                                        <div className="flex items-center space-x-4 lg:space-x-6">
                                            <img
                                                className="w-16 h-16 rounded-full lg:w-20 lg:h-20"
                                                src={person.attributes.Image.data.attributes.url}
                                                alt=""
                                            />
                                            <div className="font-medium text-lg leading-6 space-y-1">
                                                <h3>{person.attributes.Name}</h3>
                                                <p className="text-gray-400">{person.attributes.Role}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 px-8 gap-24 lg:grid-cols-2 lg:gap-24 lg:px-24 mt-8 max-w-7xl mx-auto">
                <div className="space-y-8 mx-auto">
                    <div className="relative text-base max-w-prose mx-auto lg:mt-0 lg:max-w-none">
                        <blockquote className="relative bg-white rounded-lg shadow-lg">
                            <div className="rounded-xl shadow-1xl px-6 py-8 sm:px-10 sm:pt-10 sm:pb-8">
                                <div className="h-24">
                                    <img src="/images/GIGA_allcolour_RGB_horizontal.png" alt="Workcation" className="h-24 py-2" />
                                </div>
                                <div className="relative text-base font-normal h-auto xl:h-64 tracking-wide text-gray-700 font-medium">
                                    <p className="relative">
                                        Giga, a UNICEF and ITU partnership, aims to connect every school in the world to the Internet by
                                        2030. Working with 19 countries (and growing), Giga maps school connectivity in real-time, advises
                                        on appropriate technical solutions, creates models for innovative financing, and supports
                                        governments contracting for school connectivity. To date, Giga has mapped over 1 million schools,
                                        connected over 3,000 schools, and mobilized over $200 million for connectivity.
                                    </p>
                                </div>
                            </div>
                        </blockquote>
                    </div>
                </div>
                <div className="space-y-8 mx-auto">
                    <div className="relative text-base max-w-prose mx-auto lg:mt-0 lg:max-w-none">
                        <blockquote className="relative bg-white rounded-lg shadow-lg">
                            <div className="rounded-xl shadow-1xl px-6 py-8 sm:px-10 sm:pt-10 sm:pb-8">
                                <div className="h-24">
                                    <img src="/images/SNOWCRASH-LOGO-BLACK.png" alt="Workcation" className="h-16 py-2" />
                                </div>
                                <div className="relative text-base font-normal tracking-wide h-auto xl:h-64 text-gray-700 font-medium">
                                    <p className="relative">
                                        Bremer’s art is made in collaboration with Snowcrash Labs, a fully integrated premier digital
                                        platform and creative production studio providing conceptualization, state-of-the-art production
                                        facilities, marketing, minting and sales services. Our infrastructure is based on Solana, a secure
                                        and environmentally responsible blockchain. We’ve developed an intuitive platform with simple,
                                        consumer-friendly, and sustainable methods for acquiring and interacting with NFT art.
                                    </p>
                                </div>
                            </div>
                        </blockquote>
                    </div>
                </div>
            </div>
        </>
    );
}
