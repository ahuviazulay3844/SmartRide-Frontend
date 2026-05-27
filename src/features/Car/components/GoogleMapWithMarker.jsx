import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import '../Style/GoogleMapWithMarker.css';

const whiteMinimalStyle = [
  { elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#cccccc" }] },
  { featureType: "landscape", stylers: [{ color: "#ffffff" }] }
];

const GoogleMapWithMarker = ({ carLocation, carTitle }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
    language: 'iw',
    region: 'IL'
  });

  const position = useMemo(() => ({
    lat: parseFloat(carLocation?.latitude || 0),
    lng: parseFloat(carLocation?.longitude || 0)
  }), [carLocation]);

  if (!isLoaded) return <div className="loading-map">טוען מפה...</div>;

  return (
    <div className="map-container-style">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={position}
        zoom={16}
        options={{ disableDefaultUI: true, zoomControl: true, styles: whiteMinimalStyle }}
      >
 <MarkerF
  position={position}
  title={carTitle}
  optimized={false} 
  icon={{
    url: '/assets/car_icon_purple.png',
    // google.maps.SymbolPath.CIRCLE, 
    scaledSize: new window.google.maps.Size(45, 45), 
    anchor: new window.google.maps.Point(22.5, 22.5),
    origin: new window.google.maps.Point(0, 0)
  }}
/>
      </GoogleMap>
    </div>
  );
};

export default GoogleMapWithMarker;