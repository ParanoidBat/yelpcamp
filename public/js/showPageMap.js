mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
    container: 'details-map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});


new mapboxgl.Marker().setLngLat(coordinates).addTo(map)