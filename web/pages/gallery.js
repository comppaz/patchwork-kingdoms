import { useEffect, useState, setLoading } from 'react';
import useAllNfts from '../lib/useAllNfts';
import NftGallery from '../components/NftGallery';
import kingdoms from '../data/kingdoms';

export default function Gallery() {
    const [data, setData] = useState([]);

    function buildNftList() {
        let ret = [];
        for (let i = 1; i < 1001; i++) {
            ret.push({
                key: i,
                title: kingdoms[i].title,
                imageUrl: `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.fra1.digitaloceanspaces.com/thumbnail/${i}.png`,
                tokenId: i,
                openseaUrl: `https://opensea.io/assets/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/${i}`,
                highresDownloadUrl: '',
            });
        }

        return ret;
    }

    useEffect(() => {
        setData(buildNftList());
    }, []);

    return (
        <div className="flex flex-col py-2">
            <NftGallery
                heading="Patchwork Kingdoms Gallery"
                caption="All Patchwork Kingdoms that have been minted."
                nfts={data}></NftGallery>
        </div>
    );
}
