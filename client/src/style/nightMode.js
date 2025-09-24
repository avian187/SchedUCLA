export const nightModeStyle = [
  // Base canvas
  { elementType: "geometry", stylers: [{ color: "#0b1220" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#d1d1d1" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1220" }] },

  // Administrative
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#3f4c60" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5e7380" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7a869a" }],
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7c8c9f" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2a2f3a" }],
  },

  // Landscape (ALL)
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{ color: "#1b2a3a" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [{ color: "#263545" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [{ color: "#3d5162" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry.fill",
    stylers: [{ color: "#1e2e3a" }],
  },

  // Points of Interest
  {
    featureType: "poi",
    elementType: "geometry.fill",
    stylers: [{ color: "#293b51" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a5bac6" }],
  },
  {
    featureType: "poi.business",
    elementType: "geometry.fill",
    stylers: [{ color: "#2e4057" }],
  },
  {
    featureType: "poi.attraction",
    elementType: "geometry.fill",
    stylers: [{ color: "#334866" }],
  },

  // Parks
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#173d33" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6d9b89" }],
  },

  // Roads
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#3b4b5c" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2d3948" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#b0c5d2" }],
  },

  // Highways
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#455c77" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2d3e50" }],
  },

  // Arterials
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [{ color: "#334256" }],
  },

  // Local roads
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [{ color: "#2a3342" }],
  },

  // Transit
  {
    featureType: "transit",
    elementType: "geometry.fill",
    stylers: [{ color: "#1a2535" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#899fb1" }],
  },

  // Water
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#0e1c2c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4e647d" }],
  },
];
