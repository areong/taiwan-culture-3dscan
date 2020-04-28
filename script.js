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

  let getRandomFeatureIndex = function() {
    return Math.floor(Math.random() * geoJsonData.features.length);
  };

  // Select a feature index.
  let featureIndex = 0;

  // Zoom to model, open the popup, and embed the model.
  let showModel = function(index) {
    let selectedFeature = geoJsonData.features[index];
    embedSketchfab(selectedFeature.properties.model, selectedFeature.properties.title, selectedFeature.properties.author);
    let selectedLayer = geoJsonLayer.getLayers()[index];
    markerClusterGroup.zoomToShowLayer(selectedLayer, function() {selectedLayer.openPopup();});
  };

  let showNextModel = function() {
    featureIndex = (featureIndex + 1) % geoJsonData.features.length;
    showModel(featureIndex);
  }

  let showPreviousModel = function() {
    featureIndex = (featureIndex - 1 + geoJsonData.features.length) % geoJsonData.features.length;
    showModel(featureIndex);
  }

  let showRandomModel = function() {
    showModel(getRandomFeatureIndex());
  }

  L.easyButton('glyphicon-home', function() {
    map.fitBounds(geoJsonLayer.getBounds());
  }, "View all models").addTo(map);

  let nextModelButton = L.easyButton('glyphicon-forward', showNextModel, "Show next model");
  let previousModelButton = L.easyButton('glyphicon-backward', showPreviousModel, "Show previous model");
  let randomModelButton = L.easyButton('glyphicon-random', showRandomModel, "Show random model");
  L.easyBar([nextModelButton, previousModelButton, randomModelButton]).addTo(map);

  // Fit the map to the bounds of all features.
  map.fitBounds(geoJsonLayer.getBounds(), {animate: false});

  // Randomly show up a model and zoom the map to it.
  randomIndex = getRandomFeatureIndex();
  showModel(featureIndex);
});
