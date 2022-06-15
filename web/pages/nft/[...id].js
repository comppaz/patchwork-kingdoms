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
   // create featurecCollection of feature GeoJSON Objects  
   const featureCollection = createGeoJSONFeatureCollection(features);
  
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
        // three types of circles based on specific threshold
        'circle-opacity': 0,
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#fff',
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          200,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          750,
          40
        ]
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
        'circle-color': '#00ffff',
        'circle-opacity': 0,
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
   });
  
   return () => {
     mapboxMap.remove();
   };
  }
 }, [router.query.id]);

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
  console.log(properties)
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
    
    <div className="relative pt-4 bg-white overflow-hidden">
      <div ref={mapNode} style={{ width: "auto", height: "82vh" }} />
    </div>
    <Slideover data={data}></Slideover>
    </>
  )
}

export default NFT