"use client"; // Required for Next.js if using App Router

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L, { LatLngExpression } from "leaflet";
import { ItineraryItem } from "../types/itineraryPlan";

interface MapComponentProps {
  locations: ItineraryItem[];
}

// Custom Marker Icon (Fix for Leaflet Marker not loading)
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41], // Marker size
  iconAnchor: [12, 41], // Positioning
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Component to dynamically update the map center
const SetMapView = ({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const Map = ({ locations }: MapComponentProps) => {
  console.log("Locations:", locations);

  if (!locations || locations.length === 0) {
    return <p>No locations available</p>;
  }

  // Ensure we have valid latitude and longitude values
  const validLocations = locations.filter(
    (place) => place.lat !== undefined && place.lon !== undefined
  );

  if (validLocations.length === 0) {
    return <p>No valid coordinates available</p>;
  }

  const center: LatLngExpression = [
    validLocations[0].lat,
    validLocations[0].lon,
  ];

  // Convert valid locations to an array of lat/lon pairs for the polyline
  const polylinePositions: LatLngExpression[] = validLocations.map((place) => [
    place.lat,
    place.lon,
  ]);

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: "400px", width: "100%" }}
    >
      <SetMapView center={center} zoom={10} />

      <TileLayer
        url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=9aae5e7f02e045cfaaf6879208937f71`}
      />

      {/* Render markers */}
      {validLocations.map((place, index) => (
        <Marker key={index} position={[place.lat, place.lon]} icon={customIcon}>
          <Popup>{place.day}</Popup>
        </Marker>
      ))}

      {/* Render Polyline connecting locations */}
      {validLocations.length > 1 && (
        <Polyline
          positions={polylinePositions}
          pathOptions={{ color: "blue", weight: 4, opacity: 0.8 }}
        />
      )}
    </MapContainer>
  );
};

export default Map;
