import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Slideover from '../../components/Slideover';
import Popup from '../../components/Popup';
import ReactDOM from "react-dom";
import colorToStyleMapping from '../../data/colorToStyleMapping';
import { XIcon, ChevronUpIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline'
import getNftFromJsonBins from '../../lib/getNftFromJsonBins';


const NFT = () => {
  const router = useRouter()
  const [data, setData] = useState();
  const mapNode = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);

 useEffect(async () => {

  console.log(router.query.id)
  if (router.query.id) {

   const tokenId = router.query.id[0]
   const node = mapNode.current;

   if (typeof window === "undefined" || node === null) return;

   const data = await getNftFromJsonBins(tokenId);
   //const data = await import(`../api/metadata/${tokenId}.json`)
   const features = data['schools'].concat(data['schools_no_data']);
   // create featurecCollection of feature GeoJSON Objects
   const featureCollection = createGeoJSONFeatureCollection(features);
   // get and add current statistics values
   data.statistics = await getNFTStatistics(tokenId);

   setData(data);

   let colorPalette = data.attributes[0]["value"];

   const mapboxMap = new mapboxgl.Map({
     container: node,
           accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
           style: colorToStyleMapping[colorPalette].style_url,
     center: [-74.5, 40],
     zoom: 2,
     controls: true
   });




   mapboxMap.on('load', () => {

    mapboxMap.addControl(new mapboxgl.NavigationControl({showCompass:false}), 'bottom-right');

    mapboxMap.addSource('schools', {
      type: 'geojson',
      data: featureCollection,
      cluster: true,
      // max zoom to cluster points on
      clusterMaxZoom: 10,
      // default is 50 --> radius of each cluster
      clusterRadius: 50
    });

    // draw clustered points
    mapboxMap.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'schools',
      filter: ['has', 'point_count'],
      paint: {
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#fff',
        'circle-color': colorToStyleMapping[colorPalette].point_color_value,
        'circle-radius': 20,
      }
    });

    mapboxMap.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'schools',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
      },
      paint: {
        'text-color': '#fff',
      }
      });

    // draw unclustered points
    mapboxMap.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'schools',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': colorToStyleMapping[colorPalette].point_color_value,
        'circle-radius': 10,
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#fff'
      }
      });
      // inspect a cluster on click
      mapboxMap.on('click', 'clusters', (e) => {
        const features = mapboxMap.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        mapboxMap.getSource('schools').getClusterExpansionZoom(clusterId,(err, zoom) => {
          if (err) return;
          // in case there is no error
          mapboxMap.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
          });
        }
        );
      });
      // open pop up on unclustered point
      mapboxMap.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;

        // pop up is always visible on same location when zooming out
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        generatePopup(mapboxMap, coordinates, properties)
      });
      mapboxMap.on('mouseenter', 'clusters', () => {
        mapboxMap.getCanvas().style.cursor = 'pointer';
      });
      mapboxMap.on('mouseleave', 'clusters', () => {
        mapboxMap.getCanvas().style.cursor = '';
      });

      setLoading(false);
   });

   return () => {
     mapboxMap.remove();
   };
  }
 }, [router.query.id]);

  const getNFTStatistics = async(tokenId) => {

    const response = await fetch('/api/getNFTStatistics', {
      method: 'POST',
      body: JSON.stringify({
        tokenId
      }),
      headers: {
      'Content-Type': 'application/json'
      },
    });

    const res = await response.json();
    return res;

  }

const createGeoJSONFeatureCollection = (initFeatures) => {

  let resultFeatures = [];

  initFeatures.forEach((element, index) => {
    // TODO geoJSONObject Model auslagern
    let geoJSONObject = {};
    geoJSONObject.type = "Feature",
    geoJSONObject.properties = {};
    geoJSONObject.properties.cluster = true;
    geoJSONObject.properties.cluster_id = index;
    geoJSONObject.properties.country_name = element.country_name;
    geoJSONObject.properties.school_name = element.school_name;
    geoJSONObject.properties.connectivity = element.connectivity;
    geoJSONObject.geometry = {};
    geoJSONObject.geometry.type = "Point",
    geoJSONObject.geometry.coordinates = [element.lon, element.lat];
    resultFeatures.push(geoJSONObject)
  });
  let featureCollection = {};
  featureCollection.features = resultFeatures;
  featureCollection.type = "FeatureCollection"
  return featureCollection;
}

const generatePopup = (map, coordinates, properties) => {
  const el = document.createElement('div');
  el.className = 'marker';
  const popupNode = document.createElement("div")

  ReactDOM.render(
  <Popup
    title={properties.school_name}
    country={properties.country_name}
    lng={coordinates[0]}
    lat={coordinates[1]}
    connectionStatus={properties.connectivity}
  />,
    popupNode
  )
  new mapboxgl.Popup({ offset: 25, closeButton: false })
    .setLngLat([coordinates[0], coordinates[1]])
    .setDOMContent(
      popupNode
    )
    .addTo(map);

  /*
  new mapboxgl.Marker(el).setLngLat([coordinates[0], coordinates[1]]).setPopup(    new mapboxgl.Popup({ offset: 25, closeButton: false }) // add popups
      .setDOMContent(
        popupNode
      )
  ).addTo(map);*/
}

  return (<>

    {loading && <div className='flex h-screen'>

          <div className='m-auto'><svg role="status" className="-mt-24 w-12 h-12 text-gray-400 animate-spin dark:text-gray-600 fill-teal-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
  </div>
      </div>}
    <div className="relative pt-4 bg-white overflow-hidden">
      {!isDialogOpen ?
      <div>
        {/* mobile screens: open dialog panel from bottom */}
        <button
          onClick={() => {setDialogOpen(true)}}
          className='inline-flex items-center visible px-8 py-3 text-xl sm:invisible absolute z-10 bottom-10 left-5 bg-white text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
          >

          <span className="text-left pr-4">Learn more about <br /><span className="font-bold text-teal-600">{data?.name.split('|')[1]}</span></span>
        <span class="inline-flex items-center w-6 h-6">
              <ChevronUpIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
            </span>
        </button>
        {/* desktop screens: open dialog panel from left side */}
        <button
          onClick={() => {setDialogOpen(true)}}
          className='inline-flex items-center visible px-8 py-3 text-xl invisible sm:visible absolute z-10 top-10 left-5 w-45 bg-white text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
          >
          <span className="text-left pr-4">Learn more about <br /><span className="font-bold text-teal-600">{data?.name.split('|')[1]}</span></span>
          <span class="inline-flex items-center w-6 h-6">
              <ChevronRightIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
            </span>
        </button>
      </div>
      : null
      }
       <div ref={mapNode} style={{ width: "auto", height: "82vh" }} />
    </div>
  {!loading && <Slideover data={data} isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen}></Slideover>}
    </>
  )
}

export default NFT
