import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import LControlGeocoder from 'leaflet-control-geocoder';

// Import marker images using ES modules
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix the default icon issue in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const GeocoderControl = () => {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
      geocoder: LControlGeocoder.nominatim(),
    }).addTo(map);

    // Style the control
    const controlContainer = geocoder.getContainer();
    controlContainer.style.position = 'absolute';
    controlContainer.style.top = '10px';
    controlContainer.style.right = '10px';
    controlContainer.style.zIndex = '1000'; // Ensure it's above other controls

    // Adjust the control size
    controlContainer.style.width = 'auto';
    controlContainer.style.height = 'auto';

    // Add event listener for location search
    geocoder.on('markgeocode', function(e) {
      const { center } = e.geocode;
      map.setView(center, 13);
      L.marker(center).addTo(map)
        .bindPopup('Searched Location')
        .openPopup();
    });
  }, [map]);

  return null;
};

const LiveMap = () => {
  const position = [51.505, -0.09]; // Default position (latitude, longitude)

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          Default Location <br /> Customizable.
        </Popup>
      </Marker>
      <GeocoderControl />
    </MapContainer>
  );
};

export default LiveMap;
