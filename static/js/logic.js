url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
d3.json(url).then(createMarkers);

function createMap(earthquakes)
{
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var baseMaps = {
        "Street Map": streetmap
    };

    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    var map = L.map("map",{
        center: [36.77, -119.41],
        zoom: 12,
        layers:[streetmap,earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps,{
        collapsed: true
    }).addTo(map);
      // Add legend
      var legend = L.control({ position: 'bottomright' });
      legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                  '<li style="background-color:' + setColor(grades[i] + 1) + '"></li> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }
      
          return div;
      };

    legend.addTo(map);
}



function createMarkers(response)
{
    var quakes = response.features;
    var quakeMarkers = [];
      

    for(var index = 0; index < quakes.length; index++)
    {
        var quake = quakes[index];
        var magnitude = quake.properties.mag;
        var depth = quake.geometry.coordinates[2];
        var markerOptions = {
            radius: setRadius(magnitude),
            fillColor: setColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
         };
        var quakeMarker = L.circle([quake.geometry.coordinates[1],quake.geometry.coordinates[0]], markerOptions)
            .bindPopup("<h3>Location: " + quake.properties.place + "<br>Magnitude: "+magnitude+"<br>Depth: "+depth+"</h3>");
        quakeMarkers.push(quakeMarker);

    }
    const mapLayer = L.layerGroup(quakeMarkers);
    createMap(mapLayer);
}

function setRadius(magnitude)
{
    return magnitude * 5000;
}

function setColor(depth)
{
    if(depth > 90)
    {
        color = '#FF4136';
    }
    else if (depth > 70)
    {
        color = '#FF7F11';
    }
    else if (depth > 50)
    {
        color = '#FFB700';
    }
    else if (depth > 30)
    {
        color = '#FFD47F';
    }
    else if (depth > 10)
    {
        color = '#ABD99E';
    }
    else
    {
        color = '#006D2C';
    }
    return color;
}