import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 
import Slideover from '../../components/Slideover';
import Popup from '../../components/Popup';
import ReactDOM from "react-dom";


const NFT = () => {
  const router = useRouter()
   const [map, setMap] = useState();
   const [data, setData] = useState();
   const mapNode = useRef(null);

 useEffect(async () => {

  
  if (router.query.id) {
  
   const tokenId = router.query.id[0]
   const node = mapNode.current;
   
   if (typeof window === "undefined" || node === null) return;

   const data = await import(`../api/metadata/${tokenId}.json`)
   const features = data['schools'].concat(data['schools_no_data']);

   setData(data);
   
   const mapboxMap = new mapboxgl.Map({
     container: node,
           accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
           style: "mapbox://styles/auntey/cl2ro01a1000014p3vktrma9u",
     center: [-74.5, 40],
     zoom: 2,
     controls: true
   });

   mapboxMap.on('load', () => {

    mapboxMap.addControl(new mapboxgl.NavigationControl({showCompass:false}), 'bottom-right');
 
    for (const feature of features) {
     generateMarker(mapboxMap, feature);
   }
 
    setMap(mapboxMap);
   
   });
  
   return () => {
     mapboxMap.remove();
   };
  }
 }, [router.query.id]);


const generateMarker = (map, feature) => {
  const el = document.createElement('div');
  el.className = 'marker';
  
  const popupNode = document.createElement("div")
  ReactDOM.render(
    <Popup
     title={feature.school_name}
     country={feature.country_name}
     lat={feature.lat}
     lng={feature.lon}
     connectionStatus={feature.connectivity}
    />,
    popupNode
  )

  new mapboxgl.Marker(el).setLngLat([feature.lon, feature.lat]).setPopup(
    new mapboxgl.Popup({ offset: 25, closeButton: false }) // add popups
      .setDOMContent(
        popupNode
      )
  ).addTo(map);
} 

  return (<>
    
    <div className="relative pt-4 bg-white overflow-hidden">
      <div ref={mapNode} style={{ width: "auto", height: "82vh" }} />
    </div>
    <Slideover data={data}></Slideover>
    </>
  )
}

export default NFT