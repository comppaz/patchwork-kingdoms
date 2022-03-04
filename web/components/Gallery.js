export default function Gallery({ nfts: nfts }) {
    return (
        <div className="bg-white">
            <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
                <div className="space-y-12">
                    <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your Collection</h2>
                        <p className="text-xl text-gray-500">
                            All Patchwork Kingdoms that belong to you.
                        </p>
                    </div>
                    {nfts && nfts.length &&
                        <ul
                            role="list"
                            className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8"
                        >
                            {nfts.map((nft) => (
                                <li key={nft.title}>
                                    <div className="space-y-4">
                                        <div className="aspect-w-3 aspect-h-3">
                                            <img className="object-cover shadow-lg rounded-lg" src={nft.imageUrl} alt="" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-lg leading-6 font-medium space-y-1">
                                                <h3>{nft.title}</h3>
                                                <p className="text-indigo-600">Token Id: {nft.tokenId}</p>
                                            </div>
                                            <ul role="list" className="flex space-x-5">
                                                <li>
                                                    <a href={nft.openseaUrl} target="_blank" className="text-gray-400 hover:text-gray-500">
                                                        <span className="sr-only">Opensea</span>
                                                        View on Opensea
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href={nft.highresDownloadUrl} target="_blank" className="text-gray-400 hover:text-gray-500">
                                                        <span className="sr-only"> Download High-Res</span>
                                                        Download High-Res
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>}
                </div>
            </div>
        </div>
    )

}