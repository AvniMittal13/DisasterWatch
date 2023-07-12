var defaultLatitude = 23.41605;
var defaultLongitude = 77.47552;

var currentLatitude = defaultLatitude;
var currentLongitude = defaultLongitude;

// Map initialization 
var map = L.map('map').setView([defaultLatitude, defaultLongitude], 5);



/*==============================================
            TILE LAYER and WMS
================================================*/
//osm layer
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
// osm.addTo(map);
// map.addLayer(osm)

// water color 
var watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
});
// watercolor.addTo(map)

// dark map 
var dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});
// dark.addTo(map)

// google street 
googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
// googleStreets.addTo(map);

//google satellite
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
googleSat.addTo(map)

var wms = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
    layers: 'geoapp:admin',
    format: 'image/png',
    transparent: true,
    attribution: "wms test"
});



/*==============================================
                    MARKER
================================================*/
var myIcon = L.icon({
    iconUrl: 'img/red_marker.png',
    iconSize: [40, 40],
});
var singleMarker = L.marker([defaultLatitude, defaultLongitude], { draggable: true });
var popup = singleMarker.bindPopup('This is the Selected Location').openPopup()
popup.addTo(map);

// Update the popup content with the marker's current coordinates
singleMarker.on('dragend', function (event) {
    var marker = event.target;
    var position = marker.getLatLng();
    marker.getPopup().setContent("Latitude: " + position.lat + "<br>Longitude: " + position.lng).openOn(map);
    currentLatitude = position.lat;
    currentLongitude = position.lng;
  });

var secondMarker = L.marker([29.3949, 83.1240], { draggable: true });

console.log(singleMarker.toGeoJSON())


/*==============================================
            GEOJSON
================================================*/
// var pointData = L.geoJSON(pointJson).addTo(map)
// var lineData = L.geoJSON(lineJson).addTo(map)
// var polygonData = L.geoJSON(polygonJson, {
//     onEachFeature: function (feature, layer) {
//         layer.bindPopup(`<b>Name: </b>` + feature.properties.name)
//     },
//     style: {
//         fillColor: 'red',
//         fillOpacity: 1,
//         color: '#c0c0c0',
//     }
// }).addTo(map);



/*==============================================
                LAYER CONTROL
================================================*/
var baseMaps = {
    "OSM": osm,
    "Water color map": watercolor,
    'Dark': dark,
    'Google Street': googleStreets,
    "Google Satellite": googleSat,
};
var overlayMaps = {
    "First Marker": singleMarker,
};
// map.removeLayer(singleMarker)

L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);


/*==============================================
                LEAFLET EVENTS
================================================*/
map.on('mouseover', function () {
    console.log('your mouse is over the map')
})

map.on('mousemove', function (e) {
    document.getElementsByClassName('coordinate')[0].innerHTML = 'lat: ' + e.latlng.lat + 'lng: ' + e.latlng.lng;
    console.log('lat: ' + e.latlng.lat, 'lng: ' + e.latlng.lng)
})


/*==============================================
                STYLE CUSTOMIZATION
================================================*/

let getWeatherData = async () => {
    console.log("innnnn")
    let response = await fetch('/current_weather', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            'latitude': currentLatitude,
            'longitude':currentLongitude
        })
    })

    let data = await response.json()
    return data
} 

let makeRequest = async (route, payload) => {
    print("innnnn")
    let response = await fetch(route, {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(payload)
    })

    let data = await response.json()
    return data
} 

let predictForestFire = async () => {
    var div = document.getElementById("forest-fire");

    // get weather data 
    let weather_data = await getWeatherData();
    console.log(weather_data)
    console.log(weather_data.Temperature.Metric.Value)
    let temperature = weather_data.Temperature.Metric.Value
    let humidity = weather_data.IndoorRelativeHumidity
    let wind =  weather_data.Wind.Speed.Metric.Value
    let rain =  weather_data.PrecipitationSummary.Past24Hours.Metric.Value
    // get fire prediction
    let forest_fire_data = await makeRequest('/forest-fire', {
        'temperature': temperature,
        'humidity': humidity,
        'wind': wind,
        'rain': rain
    });
    
    // print fire prediction
    // var newText = document.createTextNode("Chances of a forest fire: " + forest_fire_data['value']);
    div.innerHTML = "Chances of a forest fire: " + forest_fire_data['value']+ " %";
  }

  let predictFlood = async () => {
    var div = document.getElementById("flood");

    // get weather data 
    let weather_data = await getWeatherData();
    console.log(weather_data)
    console.log(weather_data.Temperature.Metric.Value)
    let temperature = weather_data.Temperature.Metric.Value
    let humidity = weather_data.IndoorRelativeHumidity
    let wind =  weather_data.Wind.Speed.Metric.Value
    let rain =  weather_data.PrecipitationSummary.Past24Hours.Metric.Value
    let max_temp = weather_data.TemperatureSummary.Past24HourRange.Maximum.Metric.Value
    let cloud_cover = weather_data.CloudCover
    // get fire prediction
    let flood_data = await makeRequest('/flood', {
        'temperature': temperature,
        'humidity': humidity,
        'wind': wind,
        'rain': rain,
        'max_temp': max_temp,
        'cloud_cover': cloud_cover
    });
    
    // print fire prediction
    // var newText = document.createTextNode("Chances of a forest fire: " + forest_fire_data['value']);
    div.innerHTML = "Chances of a flood: " + flood_data['value'] + " %";
  }

  let predictHurricane = async () => {
    var div = document.getElementById("hurricane");

    // get weather data 
    let weather_data = await getWeatherData();
    console.log(weather_data);
    let pressure = weather_data.Pressure.Metric.Value
    let wind =  weather_data.Wind.Speed.Metric.Value
    // get hurricane prediction
    let hurricane_data = await makeRequest('/hurricane', {
        'pressure': pressure,
        'wind': wind
    });
    
    // print fire prediction
    // var newText = document.createTextNode("Chances of a forest fire: " + hurricane_data['value']);
    div.innerHTML = "Chances of a hurricane: " + hurricane_data['value'];
  }

let convertCelcius = (fahrenheit) => {
    const celsius = (fahrenheit - 32) * 5 / 9;
    return Math.round(celsius);
}

let currentWeatherConditions = async () => {
    var div = document.getElementById("currentWeatherCondition");

    let location_data = await makeRequest("/get_location", {
        'latitude': currentLatitude,
        'longitude':currentLongitude    
    });
    console.log(location_data)
    let place_name= location_data.EnglishName;
    let state_name = location_data.AdministrativeArea.EnglishName;

    // get weather data 
    let weather_data = await getWeatherData();
    let weather_text = weather_data.WeatherText;
    let weather_icon = weather_data.WeatherIcon;
    let realFeelTemp = weather_data.RealFeelTemperature.Metric.Value;

    let temperature = weather_data.Temperature.Metric.Value
    let max_temp = weather_data.TemperatureSummary.Past6HourRange.Maximum.Metric.Value;
    let min_temp = weather_data.TemperatureSummary.Past6HourRange.Minimum.Metric.Value;

    let weather_forecast = await makeRequest("/weather_forecast", {
        'latitude': currentLatitude,
        'longitude':currentLongitude    
    })

    console.log(weather_forecast)
    console.log(weather_forecast.weather_info)

    let time0 = new Date(weather_forecast.weather_info[0].DateTime);
    let hrs0 = time0.getHours();
    let temp0 = weather_forecast.weather_info[0].Temperature.Value
            
    let time1 = new Date(weather_forecast.weather_info[1].DateTime);
    let hrs1 = time1.getHours();
    let temp1 = weather_forecast.weather_info[1].Temperature.Value

    let time2 = new Date(weather_forecast.weather_info[2].DateTime);
    let hrs2 = time2.getHours();
    let temp2 = weather_forecast.weather_info[2].Temperature.Value

    let time3 = new Date(weather_forecast.weather_info[3].DateTime);
    let hrs3 = time3.getHours();
    let temp3 = weather_forecast.weather_info[3].Temperature.Value

    let time4 = new Date(weather_forecast.weather_info[4].DateTime);
    let hrs4 = time4.getHours();
    let temp4 = weather_forecast.weather_info[4].Temperature.Value

    let time5 = new Date(weather_forecast.weather_info[5].DateTime);
    let hrs5 = time5.getHours();
    let temp5 = weather_forecast.weather_info[5].Temperature.Value

    let time6 = new Date(weather_forecast.weather_info[6].DateTime);
    let hrs6 = time6.getHours();
    let temp6 = weather_forecast.weather_info[6].Temperature.Value


    let htmlContent= `<div class="card shadow-0 border">
                        <div class="card-body p-4">

                            <h4 class="mb-1 sfw-normal">${place_name}, ${state_name}</h4>
                            <p class="mb-2">Current temperature: <strong>${temperature}°C</strong></p>
                            <p>Feels like: <strong>${realFeelTemp}°C</strong></p>
                            <p>Max: <strong>${max_temp}°C</strong>, Min: <strong>${min_temp}°C</strong></p>

                            <div class="d-flex flex-row align-items-center">
                                <p class="mb-0 me-4">${weather_text}</p>
                                <img src = "static/assets/weather/${weather_icon}.png">
                            </div>

                        </div>


                        <div class="card-body p-4 border-top border-bottom mb-2">
                            <div class="row text-center">
                            <div class="col-2">
                                <strong class="d-block mb-2">${hrs1}</strong>
                               ${temp1}°
                            </div>

                            <div class="col-2">
                                <strong class="d-block mb-2" id="wrapper-time1">${hrs2}</strong>
                                ${temp2}°
                            </div>

                            <div class="col-2">
                                <strong class="d-block mb-2" id="wrapper-time2">${hrs3}</strong>
                               ${temp3}°
                            </div>

                            <div class="col-2">
                                <strong class="d-block mb-2" id="wrapper-time3">${hrs4}</strong>
                                ${temp4}°
                            </div>

                            <div class="col-2">
                                <strong class="d-block mb-2" id="wrapper-time4">${hrs5}</strong>
                                ${temp5}°
                            </div>

                            <div class="col-2">
                                <strong class="d-block mb-2" id="wrapper-time5">${hrs6}</strong>
                                ${temp6}°
                            </div>
                        </div>
                    </div>

                    </div>`;


                            // Integer values corresponding to 7 days of the week
        const data = [temp0, temp1, temp2, temp3, temp4, temp5, temp6];

        // Create a line chart
        var ctx = document.getElementById("lineChart").getContext('2d');
        new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: [hrs0, hrs1, hrs2, hrs3, hrs4, hrs5, hrs6],
                                datasets: [{
                                label: 'Integer Values',
                                data: data,
                                fill: false,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                                }]
                            },
                            options: {
                                scales: {
                                y: {
                                    beginAtZero: true
                                }
                                }
                            }
                        });


    // div.insertAdjacentHTML('beforeend', htmlContent);
    div.insertAdjacentHTML('beforeend', htmlContent);
}



//   DASHBOARD
// Get references to the navbar links and the content divs
const navbarLinks = document.querySelectorAll('.nav-item');
const currentWeatherDiv = document.getElementById('currentWeatherCondition');
const weatherForecastDiv = document.getElementById('hurricane');
const forestFireDiv = document.getElementById('forest-fire');
const floodDiv = document.getElementById('flood');
const linechart = document.getElementById('lineChart');

// Add click event listeners to the navbar links
navbarLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Get the id of the selected link
    const selectedLinkId = link.getAttribute('data-link');

    // Clear the content of all divs
    currentWeatherDiv.innerHTML = '';
    weatherForecastDiv.innerHTML = '';
    forestFireDiv.innerHTML = '';
    linechart.innerHTML = '';
    floodDiv.innerHTML = '';


    // Add new content based on the selected link
    if (selectedLinkId === 'currentWeatherCondition') {
        currentWeatherConditions();
      // Add content to the current weather div
    //   currentWeatherDiv.innerHTML = 'This is the current weather content';
    } else if (selectedLinkId === 'hurricane') {
      // Add content to the weather forecast div
        predictHurricane();
    } else if (selectedLinkId === 'forest-fire') {
      // Add content to the forest fire div
      predictForestFire();
      currentWeatherConditionsForestFire();
    //   forestFireDiv.innerHTML = 'This is the forest fire content';
    } else if (selectedLinkId === 'flood') {
        // Add content to the forest fire div
        predictFlood();
        currentWeatherConditionsFlood();
      //   forestFireDiv.innerHTML = 'This is the forest fire content';
      }
  });
});


let currentWeatherConditionsForestFire = async () => {
    var div = document.getElementById("forest-fire");

    let weather_forecast = await makeRequest("/weather_forecast", {
        'latitude': currentLatitude,
        'longitude':currentLongitude    
    })

    let time0 = new Date(weather_forecast.weather_info[0].DateTime);
    let hrs0 = time0.getHours();
    let temp0 = weather_forecast.weather_info[0].Temperature.Value
    let humidity0 = weather_forecast.weather_info[0].IndoorRelativeHumidity
    let wind0 = weather_forecast.weather_info[0].Wind.Speed.Value
    let rain0 = weather_forecast.weather_info[0].Rain.Value

    let val0 = await makeRequest('/forest-fire', {
        'temperature': temp0,
        'humidity': humidity0,
        'wind': wind0,
        'rain': rain0
    });

    let time1 = new Date(weather_forecast.weather_info[1].DateTime);
    let hrs1 = time1.getHours();
    let temp1 = weather_forecast.weather_info[1].Temperature.Value
    let humidity1 = weather_forecast.weather_info[1].IndoorRelativeHumidity
    let wind1 = weather_forecast.weather_info[1].Wind.Speed.Value
    let rain1 = weather_forecast.weather_info[1].Rain.Value

    let val1 = await makeRequest('/forest-fire', {
        'temperature': temp1,
        'humidity': humidity1,
        'wind': wind1,
        'rain': rain1
    });

    let time2 = new Date(weather_forecast.weather_info[2].DateTime);
    let hrs2 = time2.getHours();
    let temp2 = weather_forecast.weather_info[2].Temperature.Value
    let humidity2 = weather_forecast.weather_info[2].IndoorRelativeHumidity
    let wind2 = weather_forecast.weather_info[2].Wind.Speed.Value
    let rain2 = weather_forecast.weather_info[2].Rain.Value

    let val2 = await makeRequest('/forest-fire', {
        'temperature': temp2,
        'humidity': humidity2,
        'wind': wind2,
        'rain': rain2
    });

    let time3 = new Date(weather_forecast.weather_info[3].DateTime);
    let hrs3 = time3.getHours();
    let temp3 = weather_forecast.weather_info[3].Temperature.Value
    let humidity3 = weather_forecast.weather_info[3].IndoorRelativeHumidity
    let wind3 = weather_forecast.weather_info[3].Wind.Speed.Value
    let rain3 = weather_forecast.weather_info[3].Rain.Value

    let val3 = await makeRequest('/forest-fire', {
        'temperature': temp3,
        'humidity': humidity3,
        'wind': wind3,
        'rain': rain3
    });

    let time4 = new Date(weather_forecast.weather_info[4].DateTime);
    let hrs4 = time4.getHours();
    let temp4 = weather_forecast.weather_info[4].Temperature.Value
    let humidity4 = weather_forecast.weather_info[4].IndoorRelativeHumidity
    let wind4 = weather_forecast.weather_info[4].Wind.Speed.Value
    let rain4 = weather_forecast.weather_info[4].Rain.Value

    let val4 = await makeRequest('/forest-fire', {
        'temperature': temp4,
        'humidity': humidity4,
        'wind': wind4,
        'rain': rain4
    });

    let time5 = new Date(weather_forecast.weather_info[5].DateTime);
    let hrs5 = time5.getHours();
    let temp5 = weather_forecast.weather_info[5].Temperature.Value
    let humidity5 = weather_forecast.weather_info[5].IndoorRelativeHumidity
    let wind5 = weather_forecast.weather_info[5].Wind.Speed.Value
    let rain5 = weather_forecast.weather_info[5].Rain.Value

    let val5 = await makeRequest('/forest-fire', {
        'temperature': temp5,
        'humidity': humidity5,
        'wind': wind5,
        'rain': rain5
    });

    let time6 = new Date(weather_forecast.weather_info[6].DateTime);
    let hrs6 = time6.getHours();
    let temp6 = weather_forecast.weather_info[6].Temperature.Value
    let humidity6 = weather_forecast.weather_info[6].IndoorRelativeHumidity
    let wind6 = weather_forecast.weather_info[6].Wind.Speed.Value
    let rain6 = weather_forecast.weather_info[6].Rain.Value

    let val6 = await makeRequest('/forest-fire', {
        'temperature': temp6,
        'humidity': humidity6,
        'wind': wind6,
        'rain': rain6
    });

        // Integer values corresponding to 7 days of the week
        const data = [val0['value'], val1['value'], val2['value'], val3['value'], val4['value'], val5['value'], val6['value']];

        // Create a line chart
        const ctx = document.getElementById('lineChart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: [hrs0, hrs1, hrs2, hrs3, hrs4, hrs5, hrs6],
            datasets: [{
              label: 'Forest Fire Prediction',
              data: data,
              fill: false,
              borderColor: 'rgb(200, 192, 192)',
              tension: 0.1
            }]
          },
          options: {
            scales: {
                yAxes:[{
                beginAtZero: true,
                max: 100
              }]
            }
          }
        });

    // div.insertAdjacentHTML('beforeend', htmlContent);
}



let currentWeatherConditionsFlood = async () => {
    var div = document.getElementById("flood");

    let weather_forecast = await makeRequest("/weather_forecast", {
        'latitude': currentLatitude,
        'longitude':currentLongitude    
    })

    let time0 = new Date(weather_forecast.weather_info[0].DateTime);
    let hrs0 = time0.getHours();
    let temp0 = weather_forecast.weather_info[0].Temperature.Value
    let humidity0 = weather_forecast.weather_info[0].IndoorRelativeHumidity
    let wind0 = weather_forecast.weather_info[0].Wind.Speed.Value
    let rain0 = weather_forecast.weather_info[0].Rain.Value
    let max_temp0 =  weather_forecast.weather_info[0].RealFeelTemperature.Value
    let cloud_cover0 =  weather_forecast.weather_info[0].CloudCover

    let val0 = await makeRequest('/flood', {
        'temperature': temp0,
        'humidity': humidity0,
        'wind': wind0,
        'rain': rain0,
        'max_temp': max_temp0,
        'cloud_cover': cloud_cover0
    });

    let time1 = new Date(weather_forecast.weather_info[1].DateTime);
    let hrs1 = time1.getHours();
    let temp1 = weather_forecast.weather_info[1].Temperature.Value
    let humidity1 = weather_forecast.weather_info[1].IndoorRelativeHumidity
    let wind1 = weather_forecast.weather_info[1].Wind.Speed.Value
    let rain1 = weather_forecast.weather_info[1].Rain.Value
    let max_temp1 =  weather_forecast.weather_info[1].RealFeelTemperature.Value
    let cloud_cover1 =  weather_forecast.weather_info[1].CloudCover

    let val1 = await makeRequest('/flood', {
        'temperature': temp1,
        'humidity': humidity1,
        'wind': wind1,
        'rain': rain1,
        'max_temp': max_temp1,
        'cloud_cover': cloud_cover1
    });

    let time2 = new Date(weather_forecast.weather_info[2].DateTime);
    let hrs2 = time2.getHours();
    let temp2 = weather_forecast.weather_info[2].Temperature.Value
    let humidity2 = weather_forecast.weather_info[2].IndoorRelativeHumidity
    let wind2 = weather_forecast.weather_info[2].Wind.Speed.Value
    let rain2 = weather_forecast.weather_info[2].Rain.Value
    let max_temp2 =  weather_forecast.weather_info[2].RealFeelTemperature.Value
    let cloud_cover2 =  weather_forecast.weather_info[2].CloudCover

    let val2 = await makeRequest('/flood', {
        'temperature': temp2,
        'humidity': humidity2,
        'wind': wind2,
        'rain': rain2,
        'max_temp': max_temp2,
        'cloud_cover': cloud_cover2
    });

    let time3 = new Date(weather_forecast.weather_info[3].DateTime);
    let hrs3 = time3.getHours();
    let temp3 = weather_forecast.weather_info[3].Temperature.Value
    let humidity3 = weather_forecast.weather_info[3].IndoorRelativeHumidity
    let wind3 = weather_forecast.weather_info[3].Wind.Speed.Value
    let rain3 = weather_forecast.weather_info[3].Rain.Value
    let max_temp3 =  weather_forecast.weather_info[3].RealFeelTemperature.Value
    let cloud_cover3 =  weather_forecast.weather_info[3].CloudCover

    let val3 = await makeRequest('/flood', {
        'temperature': temp3,
        'humidity': humidity3,
        'wind': wind3,
        'rain': rain3,
        'max_temp': max_temp3,
        'cloud_cover': cloud_cover3
    });

    let time4 = new Date(weather_forecast.weather_info[4].DateTime);
    let hrs4 = time4.getHours();
    let temp4 = weather_forecast.weather_info[4].Temperature.Value
    let humidity4 = weather_forecast.weather_info[4].IndoorRelativeHumidity
    let wind4 = weather_forecast.weather_info[4].Wind.Speed.Value
    let rain4 = weather_forecast.weather_info[4].Rain.Value
    let max_temp4 =  weather_forecast.weather_info[4].RealFeelTemperature.Value
    let cloud_cover4 =  weather_forecast.weather_info[4].CloudCover

    let val4 = await makeRequest('/flood', {
        'temperature': temp4,
        'humidity': humidity4,
        'wind': wind4,
        'rain': rain4,
        'max_temp': max_temp4,
        'cloud_cover': cloud_cover4
    });

    let time5 = new Date(weather_forecast.weather_info[5].DateTime);
    let hrs5 = time5.getHours();
    let temp5 = weather_forecast.weather_info[5].Temperature.Value
    let humidity5 = weather_forecast.weather_info[5].IndoorRelativeHumidity
    let wind5 = weather_forecast.weather_info[5].Wind.Speed.Value
    let rain5 = weather_forecast.weather_info[5].Rain.Value
    let max_temp5 =  weather_forecast.weather_info[5].RealFeelTemperature.Value
    let cloud_cover5 =  weather_forecast.weather_info[5].CloudCover

    let val5 = await makeRequest('/flood', {
        'temperature': temp5,
        'humidity': humidity5,
        'wind': wind5,
        'rain': rain5,
        'max_temp': max_temp5,
        'cloud_cover': cloud_cover5
    });

    let time6 = new Date(weather_forecast.weather_info[6].DateTime);
    let hrs6 = time6.getHours();
    let temp6 = weather_forecast.weather_info[6].Temperature.Value
    let humidity6 = weather_forecast.weather_info[6].IndoorRelativeHumidity
    let wind6 = weather_forecast.weather_info[6].Wind.Speed.Value
    let rain6 = weather_forecast.weather_info[6].Rain.Value
    let max_temp6 =  weather_forecast.weather_info[6].RealFeelTemperature.Value
    let cloud_cover6 =  weather_forecast.weather_info[6].CloudCover

    let val6 = await makeRequest('/flood', {
        'temperature': temp6,
        'humidity': humidity6,
        'wind': wind6,
        'rain': rain6,
        'max_temp': max_temp6,
        'cloud_cover': cloud_cover6
    });

        // Integer values corresponding to 7 days of the week
        const data = [val0['value'], val1['value'], val2['value'], val3['value'], val4['value'], val5['value'], val6['value']];
        console.log(data)
        // Create a line chart
        const ctx = document.getElementById('lineChart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: [hrs0, hrs1, hrs2, hrs3, hrs4, hrs5, hrs6],
            datasets: [{
              label: 'Flood Prediction',
              data: data,
              fill: false,
              borderColor: 'rgb(200, 42, 92)',
              tension: 0.1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

    // div.insertAdjacentHTML('beforeend', htmlContent);
}
