var embedSketchfab = function(modelId, modelTitle, modelAuthor) {
  document.getElementById("modelView").innerHTML = `<div class="sketchfab-embed-wrapper">
    <iframe title="A 3D model" src="https://sketchfab.com/models/${modelId}/embed" frameborder="0" allow="autoplay; fullscreen; vr" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
    <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;">
      <a href="https://sketchfab.com/3d-models/${modelId}" target="_blank" style="font-weight: bold; color: #1CAAD9;">${modelTitle}</a>
      by <a href="https://sketchfab.com/${modelAuthor}" target="_blank" style="font-weight: bold; color: #1CAAD9;">${modelAuthor}</a>
      on <a href="https://sketchfab.com" target="_blank" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a>
    </p></div>`;
}

var map = L.map("mapView");

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

$.getJSON("https://areong.github.io/taiwan-culture-3dscan/data/models.geojson", function(geoJsonData) {
  // Read GeoJSON and create a marker cluster group.
  var geoJsonLayer = L.geoJSON(geoJsonData, {
    onEachFeature: function(feature, layer) {
      layer.bindTooltip(feature.properties.title)
        .bindPopup(feature.properties.title)
        .on("click", function(e) {
          embedSketchfab(feature.properties.model, feature.properties.title, feature.properties.author);
        });
    }});
  var markerClusterGroup = L.markerClusterGroup().addLayer(geoJsonLayer).addTo(map);

  // Fit the map to the bounds of all features.
  map.fitBounds(geoJsonLayer.getBounds(), {animate: false});

  // Randomly show up a model and zoom the map to it.
  let randomIndex = Math.floor(Math.random() * geoJsonData.features.length);
  let selectedFeature = geoJsonData.features[randomIndex];
  embedSketchfab(selectedFeature.properties.model, selectedFeature.properties.title, selectedFeature.properties.author);
  let selectedLayer = geoJsonLayer.getLayers()[randomIndex];
  markerClusterGroup.zoomToShowLayer(selectedLayer, function() {selectedLayer.openPopup();});
});
