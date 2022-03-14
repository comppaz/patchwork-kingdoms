import { useEffect, useState, setLoading } from 'react'
import useAllNfts from '../lib/useAllNfts'
import NftGallery from '../components/NftGallery';

export default function Gallery() {
  // const [data, setData] = useState([])
  
  // useEffect(() => {
  //   fetch('api/gallery')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data.data)
  //       setData(data.data)
  //       // setData([{image: "/a1.jpg", hash: "123"}, {image: "/a2.jpg", hash: "321"}, {image: "/a3.jpg", hash: "456"}])
  //     })
  // }, []);
  const { nfts } = useAllNfts();

  return (
    <div className="flex flex-col py-2">
      <NftGallery heading="Patchwork Kingdoms Gallery" caption="All Patchwork Kingdoms that have been minted." nfts={nfts}></NftGallery>
    </div>

  )
}
