import Image from 'next/image';
import React from 'react';
import { Transition } from '@headlessui/react';

const stats = [
    { label: 'Total Supply Of NFTs', value: '1000' },
    { label: 'Original Minting Price', value: '0.175 ETH' },
];

export default function About() {
    const [showDetails, setShowDetails] = React.useState(false);

    return (
        <>
            <div className="relative bg-white py-8 sm:py-12">
                <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-24 lg:items-start">
                    <div className="relative sm:py-16 lg:py-0">
                        <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl  sm:px-6 lg:px-0 lg:max-w-none lg:py-20">
                            {/* Testimonial card*/}
                            <div className="relative rounded-2xl shadow-xl overflow-hidden">
                                <Image
                                    src="/images/dollhouse.png"
                                    alt="Picture of the author"
                                    layout="responsive"
                                    width={512}
                                    height={512}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
                        {/* Content area */}
                        <div className="pt-12 sm:pt-16 lg:pt-20">
                            <h2 className="text-3xl text-gray-900 font-extrabold tracking-tight sm:text-4xl">
                                Our <span className="text-teal-600">NFT</span> Collection
                            </h2>
                            <div className="mt-6 text-gray-500 space-y-6">
                                <p className="text-lg">
                                    We’ve partnered with data visualization scientist, designer and artist{' '}
                                    <strong className="tracking-wide">Nadieh Bremer</strong>. Bremer effectively ‘paints’ with data that{' '}
                                    <a className="text-teal-900 underline" target="_blank" href="https://gigaconnect.org/" rel="noreferrer">
                                        Giga
                                    </a>{' '}
                                    has collected from schools themselves, creating a unique and visually striking collection of 1,000 NFTs
                                    called the Patchwork Kingdoms. These works are inspired by real information about school connectivity,
                                    which you can see on Giga&apos;s{' '}
                                    <a
                                        className="text-teal-900 underline"
                                        target="_blank"
                                        href="https://www.projectconnect.world"
                                        rel="noreferrer">
                                        Project Connect
                                    </a>{' '}
                                    site.
                                </p>
                                <p className="text-base leading-7">
                                    Half of the world is not connected to the internet, and this NFT collection shows exactly that
                                    disparity. Each Patchwork Kingdom has a world ‘above’ representing connected schools and a world ‘below’
                                    representing unconnected schools. The squares in the hidden pale “reflection” city represent a lack of
                                    connectivity contrasted with the “vibrant” connectivity in schools in the upright city. Data is the
                                    “paint” Bremer uses to show how many children are still in need of life-changing connectivity.
                                </p>
                            </div>
                        </div>

                        {/* Stats section */}
                        <div className="mt-10">
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
                                {stats.map(stat => (
                                    <div key={stat.label} className="border-t-2 border-gray-100 pt-6">
                                        <dt className="text-base font-medium text-gray-500">{stat.label}</dt>
                                        <dd className="text-3xl font-extrabold tracking-tight text-gray-900">{stat.value}</dd>
                                        {stat.value === '1000' ? (
                                            <small className="font-thin"> (1 reserved for artist - mint #1)</small>
                                        ) : null}
                                    </div>
                                ))}
                            </dl>
                            <div className="mt-10">
                                <a
                                    onClick={e => {
                                        e.preventDefault();
                                        setShowDetails(!showDetails);
                                    }}
                                    className="text-base font-medium text-teal-600 cursor-pointer">
                                    {' '}
                                    Learn more about the artwork <span aria-hidden="true">&rarr;</span>{' '}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Transition
                show={showDetails}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div className="bg-white overflow-hidden">
                    <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                        <div className="hidden lg:block bg-gray-50 absolute top-0 bottom-0 left-3/4 w-screen" />
                        <div className="mx-auto text-base max-w-prose lg:grid lg:grid-cols-2 lg:gap-8 lg:max-w-none">
                            <div>
                                <h2 className="text-base text-teal-400 font-semibold tracking-wide uppercase">About</h2>
                                <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                    The Artwork
                                </h3>
                            </div>
                        </div>
                        <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-8">
                            <div className="relative lg:row-start-1 lg:col-start-2">
                                <div className="relative text-base mx-auto max-w-prose lg:max-w-none">
                                    <figure>
                                        <div className="aspect-w-12 aspect-h-7 lg:aspect-none  rounded-2xl shadow-xl overflow-hidden">
                                            <Image
                                                src="/images/chaos.png"
                                                alt="Picture of the author"
                                                layout="responsive"
                                                width={512}
                                                height={512}
                                            />
                                        </div>
                                    </figure>
                                </div>
                            </div>
                            <div className="mt-8 lg:mt-0">
                                <div className="mt-5 prose prose-indigo text-gray-500 mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1">
                                    <p>
                                        Each kaleidoscopic square represents one school. Square placement in the city represents
                                        connectivity. The symbol within each square is chosen randomly. The faster the speed, the more
                                        complex the symbol.
                                    </p>
                                    <p>
                                        Each symbol has between 2-4 &quot;complexity levels&quot; with new elements added to each complexity
                                        level. For example, the slowest speeds might be a single circle, medium speeds get two concentric
                                        circles and the high speeds (but not in the top 10% of speeds) get three concentric circles.
                                    </p>
                                    <p>
                                        When two schools with a fast speed have been algorithmically placed above one another, they,
                                        together, blossom into a full flower with a wreath of petals. Two schools with fast internet placed
                                        side-by-side are configured to become a rainbow.
                                    </p>
                                    <p>
                                        Bremer incorporates data for 283,000 schools from 21 countries which Giga has collected on its live
                                        map and each one of the 1,000 Patchwork Kingdoms represents a subset of these schools. You can
                                        collect one or several, and you can have a snapshot of Giga’s work as the project evolves. The team
                                        hopes to add many more features to these NFTs over time, including the ability to collect individual
                                        schools, to connect your Patchwork Kingdom to others, and to watch the network of kingdoms grow as
                                        we give every child access to information, opportunity, and choice.
                                    </p>
                                    {/* <button onclick="location.href='https://www.visualcinnamon.com/collection/patchwork-kingdoms/'">Visit Page Now</button> */}
                                </div>
                                <div className="mt-8 lg:mt-0">
                                    <div className="mt-5">
                                        <a
                                            href="https://www.visualcinnamon.com/collection/patchwork-kingdoms/"
                                            target="_blank"
                                            className="underline text-teal-600"
                                            rel="noreferrer">
                                            Detailed blog by Nadieh Bremer
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
            <div className="bg-white py-16 lg:py-24">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative py-24 px-8 bg-teal-600 rounded-xl shadow-2xl overflow-hidden lg:px-16 lg:grid lg:grid-cols-2 lg:gap-x-8">
                        <div className="absolute inset-0 opacity-40 filter saturate-0 mix-blend-multiply">
                            <Image
                                src="/images/dollhouse.png"
                                alt="Picture of the author"
                                layout="fill"
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                        <div className="relative lg:col-span-1">
                            <h2 className="text-3xl text-white font-bold">About Giga</h2>
                            <blockquote className="mt-6 text-white">
                                <p className="text-lg font-normal sm:text-2xl">
                                    Some 2.9 billion people (of which around 1.3 billion are children) do not have access to the Internet.
                                    This lack of connectivity means exclusion, marked by the lack of access to the wealth of information
                                    available online, fewer resources to learn and to grow, and limited opportunities for the most
                                    vulnerable children and youth to fulfill their potential.
                                </p>
                                <footer className="mt-6">
                                    <p className="flex flex-col font-light">
                                        <span>
                                            Giga, a collaboration between UNICEF and ITU, is working to connect every school in the world to
                                            the internet and give every young person access to information, opportunity, and choice.
                                            <br />
                                        </span>
                                        <span className="mt-1">
                                            Giga{' '}
                                            <a
                                                className="underline"
                                                href="https://gigaconnect.org/scaling-ai-to-map-every-school-on-the-planet/"
                                                target="_blank"
                                                rel="noreferrer">
                                                uses satellite imagery and machine learning
                                            </a>{' '}
                                            to map schools and their connectivity, new types of financing, including experimentations with
                                            cryptocurrencies, to help fund, and blockchain-based solutions to monitor and{' '}
                                            <a
                                                className="underline"
                                                target="_blank"
                                                href="https://www.weforum.org/agenda/2021/06/how-connectivity-credits-could-help-billions-get-online/"
                                                rel="noreferrer">
                                                report on connectivity
                                            </a>
                                            .
                                        </span>
                                    </p>
                                </footer>
                            </blockquote>
                        </div>
                        <div className="relative lg:col-span-1">
                            <div id="responsiveVideoWrapper" className="relative h-0 pb-fluid-video mt-12">
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl shadow-teal-50"
                                    src="https://www.youtube-nocookie.com/embed/YGXkUfkFM9g?modestbranding=1&autohide=1&controls=0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
