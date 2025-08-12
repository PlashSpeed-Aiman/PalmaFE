import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

// Define the props interface for the Map component
interface MapProps {
  trees?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    type: string;
  }>;
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
}

// Sample data if no trees are provided
const sampleTrees = [
  { id: 'T001', latitude: 3.1390, longitude: 101.6869, type: 'Mature' },
  { id: 'T002', latitude: 3.1392, longitude: 101.6872, type: 'Young' },
  { id: 'T003', latitude: 3.1395, longitude: 101.6875, type: 'Mature' },
  { id: 'T004', latitude: 3.1398, longitude: 101.6878, type: 'Mature' },
];

const Map: React.FC<MapProps> = ({ 
  trees = sampleTrees, 
  center = [101.6869, 3.1390], // Default center (Kuala Lumpur area)
  zoom = 14 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize the map
  useEffect(() => {
    // Set the Mapbox access token from environment variables
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

    if (!map.current && mapContainer.current) {
      // Create a new map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite with streets style
        center: center,
        zoom: zoom
      });

      // Add navigation controls (zoom in/out)
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Set up event listener for when the map has loaded
      map.current.on('load', () => {
        setMapLoaded(true);
      });
    }

    // Cleanup function to remove the map when component unmounts
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom]);

  // Add markers for trees when map is loaded and trees data changes
  useEffect(() => {
    if (mapLoaded && map.current) {
      // Remove any existing markers
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers[0]) {
        markers[0].remove();
      }

      // Add markers for each tree
      trees.forEach(tree => {
        // Create a marker element
        const markerElement = document.createElement('div');
        markerElement.className = `tree-marker ${tree.type.toLowerCase()}`;
        markerElement.style.width = '20px';
        markerElement.style.height = '20px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.border = '2px solid white';
        
        // Create a popup with tree information
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <strong>Tree ID:</strong> ${tree.id}<br>
            <strong>Type:</strong> ${tree.type}<br>
            <strong>Coordinates:</strong> ${tree.latitude.toFixed(4)}°, ${tree.longitude.toFixed(4)}°
          `);

        // Add the marker to the map
        new mapboxgl.Marker(markerElement)
          .setLngLat([tree.longitude, tree.latitude])
          .setPopup(popup)
          .addTo(map.current!);
      });
    }
  }, [mapLoaded, trees]);

  return (
    <div>
      <div ref={mapContainer} style={{ height: '400px', borderRadius: '3px' }} />
    </div>
  );
};

export default Map;