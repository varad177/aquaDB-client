import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import Modal, { setAppElement } from 'react-modal';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic25laGFkMjgiLCJhIjoiY2x0czZid3AzMG42YzJqcGNmdzYzZmd2NSJ9.BuBkmVXS61pvHErosbGCGA';

// Set the app element for react-modal
setAppElement('#root');

const MapComponent = ({ setFilters }) => {
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Initialize the map
  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: 'map', // The ID of the div to attach the map
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [78.9629, 22.5937],
      zoom: 3, // Default zoom level
    });

    // Add navigation controls to the map
    mapInstance.addControl(new mapboxgl.NavigationControl());

    // Set the map instance in state
    setMap(mapInstance);

    // Cleanup map instance on unmount
    return () => mapInstance.remove();
  }, []);

  // Handle map click event
  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat;
    console.log('Map clicked at:', lat, lng);

    // Set the selected location in state and update filters
    setSelectedLocation({ lat, lng });
    setFilters({
      lat,
      long: lng,
    });
  };

  // Set up the map click event listener
  useEffect(() => {
    if (map) {
      map.on('click', handleMapClick);
    }

    // Cleanup on component unmount
    return () => {
      if (map) {
        map.off('click', handleMapClick); // Remove click event listener
      }
    };
  }, [map]);

  return (
    <div className="relative">
      {/* Map container */}
      <div id="map" style={{ width: '100%', height: '500px' }} className="rounded-lg shadow-xl mb-6 z-0"></div>
    </div>
  );
};

export default MapComponent;
