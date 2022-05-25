import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import fetchStrapi from '../../lib/fetchStrapi'
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 

const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.032, 38.913]
      },
      properties: {
        title: 'School #1',
        description: 'Country / Location'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.414, 37.776]
      },
      properties: {
        title: 'School #2',
        description: 'Country / Location'
      }
    }
  ]
};

const NFT = () => {
  const router = useRouter()
   // this is where the map instance will be stored after initialization
   const [map, setMap] = useState();

   // React ref to store a reference to the DOM node that will be used
   // as a required parameter `container` when initializing the mapbox-gl
   // will contain `null` by default
   const mapNode = useRef(null);

 useEffect(async () => {

  if (router.query.id) {
   const tokenId = router.query.id[0]
    
   //const data = await import(`api/metadata/Patchwork Kingdoms #${tokenId} - metadata.json.json`)
   const data = await import(`../api/metadata/${tokenId}.json`)
   console.log(data)
   const node = mapNode.current;
       // if the window object is not found, that means
       // the component is rendered on the server
       // or the dom node is not initialized, then return early
   if (typeof window === "undefined" || node === null) return;

       // otherwise, create a map instance
   const mapboxMap = new mapboxgl.Map({
     container: node,
           accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
           style: "mapbox://styles/auntey/cl2ro01a1000014p3vktrma9u",
     center: [-74.5, 40],
     zoom: 2,
     controls: true
   });

   mapboxMap.addControl(new mapboxgl.NavigationControl({showCompass:false}), 'bottom-right');

   for (const feature of data['schools']) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';
    console.log(feature)
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el).setLngLat([feature.lon, feature.lat]).setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
          `<h3>${feature.school_name}</h3><p>Description</p>`
        )
    ).addTo(mapboxMap);
  }

  for (const feature of data['schools_no_data']) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';
    console.log(feature)
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el).setLngLat([feature.lon, feature.lat]).setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
          `<h3>${feature.school_name}</h3><p>Description</p>`
        )
    ).addTo(mapboxMap);
  }
       // save the map object to React.useState
   setMap(mapboxMap);

       return () => {
     mapboxMap.remove();
   };
  }
 }, [router.query.id]);

  // useEffect(async () => {
  //   if (router.query.id) {
  //     const tokenId = router.query.id[0]
  //     console.debug(tokenId)
  //   }
  // }, [router.query.id])


  return (
    <div className="relative pt-4 bg-white overflow-hidden">
      <div ref={mapNode} style={{ width: "auto", height: "82vh" }} />
    </div>
  )
}

export default NFT