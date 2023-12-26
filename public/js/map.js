let mapToken = mpToken;
//Step 1: initialize communication with the platform
// Replace variable YOUR_API_KEY with your own apikey

var platform = new H.service.Platform({
  apikey: "mapToken",
});
var defaultLayers = platform.createDefaultLayers();
//Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(
  document.getElementById("mapContainer"),
  defaultLayers.vector.normal.map,
  {
    center: {
      lat: 26,
      lng: 75,
    },
    zoom: 4,
    pixelRatio: window.devicePixelRatio || 1,
  }
);
// This adds a resize listener to make sure that the map occupies the whole container
window.addEventListener("resize", () => map.getViewPort().resize());
//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);
