import Image from 'next/image';

const partners = [
    {
        imageUrl: '/images/partners/unicef_logo.jpeg',
        url: 'https://www.unicef.org/',
        alt: 'Unicef Logo',
    },
    {
        imageUrl: '/images/partners/itu.png',
        url: 'https://www.itu.int',
        alt: 'ITU Logo',
    },
    {
        imageUrl: '/images/partners/wondros.png',
        url: 'https://www.wondros.com/',
        alt: 'Wondros Logo',
    },
    {
        imageUrl: '/images/partners/metagood.png',
        url: 'https://www.metagood.com/',
        alt: 'Metagood Logo',
    },
    {
        imageUrl: '/images/partners/ethereum_foundation.png',
        url: 'https://ethereum.org/en/foundation/',
        alt: 'Ethereum Foundation Logo',
    },
    {
        imageUrl: '/images/partners/cfc.jpeg',
        url: 'https://cfc-stmoritz.com/',
        alt: 'CFC St. Moritz Logo',
    },
];

export default function LogoCloud() {
    return (
        <>
            <div className="bg-white">
                <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm font-light text-gray-500 tracking-wide">
                        <a className="text-teal-900 underline" target="_blank" href="https://gigaconnect.org/" rel="noreferrer">
                            Giga
                        </a>{' '}
                        (a UNICEF/ITU partnership) is developing this NFT collection in partnership with{' '}
                        <a className="text-teal-900 underline" target="_blank" href="https://snowcrash.com/" rel="noreferrer">
                            Snowcrash Labs
                        </a>
                        .
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-1">
                        <div className="col-span-1 flex justify-center md:col-span-1 lg:col-span-1">
                            <Image
                                src="/images/partnership.png"
                                alt="Picture of the author"
                                layout="intrinsic"
                                width={350}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="grid grid-cols-4 gap-2 md:grid-cols-8 lg:grid-cols-8">
                        {partners.map(partner => (
                            <div key={partner.alt} className="col-span-1 flex justify-center md:col-span-1 lg:col-span-1 py-4">
                                <a target="_blank" href={partner.url} rel="noreferrer">
                                    <img className="h-9" src={partner.imageUrl} alt={partner.alt} />
                                </a>
                            </div>
                        ))}
                        <div className="col-span-1 flex justify-center md:col-span-1 lg:col-span-1 py-4">
                            <a target="_blank" href="https://craft-clarity.com/" rel="noreferrer">
                                <img className="h-9" src="/images/partners/craft_clarity.png" alt="Craft Clarity Logo" />
                            </a>
                        </div>
                        <div className="col-span-1 flex justify-center md:col-span-1 lg:col-span-1 py-4">
                            <a target="_blank" href="https://sagefdn.org/" rel="noreferrer">
                                <img className="h-9" src="/images/partners/sage.jpeg" alt="Sage Foundation Logo" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
