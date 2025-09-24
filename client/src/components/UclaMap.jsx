// UclaMap.jsx
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useState, useRef, useEffect } from "react";
import EventPopup from "./EventPopup";
import EventCreator from "./EventCreator";
import LiveEvents from "./LiveEvents";
import MapStyleToggle from "./MapStyleToggle";

const center = { lat: 34.0722, lng: -118.4441 };
const bounds = {
  north: 34.07634,
  south: 34.06204,
  west: -118.45666,
  east: -118.43353,
};

const baseMapOptions = {
  restriction: { latLngBounds: bounds },
  clickableIcons: false,
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: true,
};

export default function UclaMap() {
  const { isLoaded } = useJsApiLoader({
    id: "ucla-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    
  });
  console.log("API Key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);


  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const circleRef = useRef(null);
  const [initialEventId, setInitialEventId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On first mount, grab ?eventId=… if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("eventId");
    if (eventId) setInitialEventId(eventId);
  }, []);

  // When map loads, store the instance
  const handleMapLoad = (map) => {
    map.setOptions({
      ...baseMapOptions,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
      },
    });
    setMapInstance(map);
  };

  // User clicks on the map: place a small circle and show the “Create Event” popup
  const handleMapClick = (e) => {
    const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setSelectedLocation(latLng);
    setShowForm(false);

    // Remove any old “preview” circle
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }

    // Draw a small blue circle at the click location
    if (mapInstance && window.google) {
      circleRef.current = new window.google.maps.Circle({
        map: mapInstance,
        center: latLng,
        radius: 10,
        fillColor: "#3b82f6",
        fillOpacity: 0.7,
        strokeColor: "#1d4ed8",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: false,
        zIndex: 1,
      });
    }
  };

  const handleConfirm = () => {
    setShowForm(true);
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    setShowForm(false);

    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
  };

  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <>
      <MapStyleToggle map={mapInstance} setIsDarkMode={setIsDarkMode} />

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100vh" }}
        center={center}
        zoom={16}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
        options={baseMapOptions}
      >
        {/* Live events from Firestore */}
        <LiveEvents
          refreshKey={refreshKey}
          initialEventId={initialEventId}
          isDarkMode={isDarkMode}
        />

        {/* Create‐Event popup if the user has clicked on the map and hasn’t confirmed yet */}
        {selectedLocation && !showForm && (
          <EventPopup
            key={isDarkMode ? "dark" : "light"}
            position={selectedLocation}
            onConfirm={handleConfirm}
            onCancel={clearSelection}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Once the user clicks “Yes” to Confirm, show the EventCreator form */}
      {showForm && selectedLocation && (
        <EventCreator
          key={selectedLocation.lat + "-" + selectedLocation.lng} // Force remount
          location={selectedLocation}
          onClose={clearSelection}
          triggerRefresh={() => setRefreshKey((k) => k + 1)}
        />
      )}
      </GoogleMap>
    </>
  );
}
