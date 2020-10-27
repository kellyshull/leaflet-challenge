var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryURL).then(data => {
    console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});





function createFeatures(earthquakeData) {


    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and mag of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.title +
            "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p><hr>" + "<p>" + "Depth: " + feature.geometry.coordinates[2] + "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer,
        style: style
    });

    function pointToLayer(feature, latlng) {
        return new L.circle(latlng,
            {fillColor: colorCircle(feature.properties.mag),
            radius: myRadius(feature.properties.mag)});
    }

    function style(quakeFeatures) {
        return {
            weight: 1.5
        }
    }

    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
    };

    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}

// put color function outside of the other functions
function colorCircle(magnitude) {
    if (magnitude > 5) {
        return "red"
    }
    else if (magnitude > 4) {
        return "orange"
    }
    else if (magnitude > 3) {
        return "yellow"
    }
    else if (magnitude > 2) {
        return "lightgreen"
    }
    else if (magnitude > 1) {
        return "green"
    }
    else {
        return "white";
    }
};

// radius function

function myRadius(magnitude) {
    return magnitude*20000;
}