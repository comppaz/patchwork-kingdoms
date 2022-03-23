import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';


var pageCounter = 100;
const pageIncrement = 100;

export default function NftGallery({nfts:nfts, heading:heading, caption:caption}) {    
    const [allnfts, setAllnfts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if(nfts === undefined){
            console.log("not ready");
        } else {
            if(nfts.length > 0 && allnfts.length === 0 ){
                setAllnfts(nfts.slice(0,pageIncrement));
                setHasMore(true);
                
                if(nfts.length < pageIncrement)
                    setHasMore(false);
            }

            if(nfts.length === 0 && allnfts.length === 0){
                console.log("wuttttttttttt");
                setHasMore(false);
            }
            console.log("ready");
            console.log(nfts.length);
            console.log(allnfts.length);
        }
        //  else if(nfts.length > 0){
        //     console.log(allnfts.length);
        //     
        // }
        // else if(nfts.length === 0){
        //     setHasMore(false);
        // } else if(allnfts.length > 0){
        //     setAllnfts(nfts.slice(0,pageIncrement));
        // }
        // else if(allnfts.length === 0 && nfts.length > 0){
        //     setAllnfts(nfts.slice(0,pageIncrement));
        //     console.log("here");
        //     console.log(allnfts.length);
        //     console.log(nfts.length);
        // }
    });

    

    function fetchData(){
        setAllnfts(allnfts.concat(nfts.slice(pageCounter, pageCounter + pageIncrement)));
        pageCounter = pageCounter + pageIncrement;

        if(pageCounter === nfts.length)
            setHasMore(false);
    }

    return (
        <InfiniteScroll
          dataLength={allnfts.length} //This is important field to render the next data
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen all the Kingdoms.</b>
            </p>
          }
        >
        <div className="bg-white">
            <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
                <div className="space-y-12">
                    <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{heading}</h2>
                        <p className="text-xl text-gray-500">
                            {caption}
                        </p>
                    </div>
                    {allnfts &&
                        <ul
                            role="list"
                            className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8"
                        >
                            {allnfts.map((nft) => (
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
                                                    {(nft.highresDownloadUrl != '' ?
                                                        (<a href={nft.highresDownloadUrl} target="_blank" className="text-gray-400 hover:text-gray-500"><span className="sr-only"> Download High-Res</span>Download High-Res</a>)
                                                        : (<span></span>)
                                                    )}
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
        </InfiniteScroll>
    )

}