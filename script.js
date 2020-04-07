var embedSketchfab = function(modelId, modelTitle, modelAuthor) {
  return `<div class="sketchfab-embed-wrapper">
    <iframe title="A 3D model" src="https://sketchfab.com/models/${modelId}/embed" frameborder="0" allow="autoplay; fullscreen; vr" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
    <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;">
      <a href="https://sketchfab.com/3d-models/200-${modelId}" target="_blank" style="font-weight: bold; color: #1CAAD9;">${modelTitle}</a>
      by <a href="https://sketchfab.com/${modelAuthor}" target="_blank" style="font-weight: bold; color: #1CAAD9;">${modelAuthor}</a>
      on <a href="https://sketchfab.com" target="_blank" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a>
    </p></div>`;
}

var map = L.map('mapView').setView([25.048, 121.526], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

$.getJSON("https://areong.github.io/taiwan-culture-3dscan/data/models.geojson", function(geojsonData) {
  L.markerClusterGroup().addLayer(L.geoJSON(geojsonData, {
    onEachFeature: function(feature, layer) {
      layer.bindTooltip(feature.properties.title);
      layer.bindPopup(
        feature.properties.title);
      layer.on("click", function(e) {
        document.getElementById("modelView").innerHTML = embedSketchfab(feature.properties.model, feature.properties.title, feature.properties.author);
      })
    }
  })).addTo(map);
});
