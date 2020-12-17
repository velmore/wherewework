// starting point for script
function initialize() {

    // enable bootstrap tooltips
    $(function () {
        $('[data-toggle="tooltip"]').tooltip
    });

    // resize function wraps the main function to allow responsive sizing
    resize(map());

};

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [64,-157],
        zoom: 4,
        zoomControl: false
    });
    
    // pane to be able to control drawing order of layers
    map.createPane('wwwPane');
    map.getPane('wwwPane').style.zIndex = 1000;
    map.getPane('wwwPane').style.pointerEvents = 'none';

    //add mapbox tilelayer
    let grayBase = L.tileLayer('https://api.mapbox.com/styles/v1/jhcarney/cjk1yvox82csb2rlk24kxg3o2/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamhjYXJuZXkiLCJhIjoiY2pmbHE2ZTVlMDJnbTJybzdxNTNjaWsyMiJ9.hoiyrXTX3pOuEExAnhUtIQ', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 9,
        minZoom: 3,
    }).addTo(map);
    
    // create operational layers that are empty for now
    let ibaLayer = L.layerGroup().addTo(map);
    let chapterLayer = L.layerGroup().addTo(map);
    
    
    //create marker options
    var ibaMarkerOptions = {
        radius: 3,
        fillColor: "#000000",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        };
    
    var chapterMarkerOptions = {
        radius: 5,
        fillColor: "#008000",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        };
    
    // fill that layer with data from a geojson file
    jQuery.getJSON("data/iba.geojson", function(json){
    L.geoJSON(json, {
    onEachFeature: ibaData,
    pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, ibaMarkerOptions);
                }
  })
}) 
    
    // fill that layer with data from a geojson file
    jQuery.getJSON("data/chapters.geojson", function(json){
    L.geoJSON(json, {
    onEachFeature: chapterData,
    pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, chapterMarkerOptions);
                }
  })
})
    
// This function is run for every feature found in the geojson file. It adds the feature to the empty layer we created above
function ibaData(feature, layer){
  ibaLayer.addLayer(layer)
  // some other code can go here, like adding a popup with layer.bindPopup("Hello")
layer.bindPopup("<p><b>IBA: </b>"+feature.properties.name+ 
                           "<br><b>Status: </b>" + feature.properties.STATUS+
                           "<br><b>Priority: </b>" + feature.properties.PRIORITY+"</p>");
    //event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }
    });
}
    
function chapterData(feature, layer){    
   chapterLayer.addLayer(layer)
  // some other code can go here, like adding a popup with layer.bindPopup("Hello")
layer.bindPopup('<p><b>Chapter: </b>' + feature.properties.Chapter + 
                '<br><b>City: </b>' + feature.properties.City+ '<br>' + '<a href="'+ 
                    feature.properties.URL + '" target="_blank">Website</a>' + '</p>'); 
}
    
let layerControl = {
  "Important Bird Areas": ibaLayer, 
  "Audubon Chapters": chapterLayer // an option to show or hide the layer you created from geojson
}

// Add the control component, a layer list with checkboxes for operational layers 
L.control.layers(null, layerControl, {position: 'bottomright'}).addTo(map);


//call getData function
    getData(map);
};

//function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    var image = '<img src="'+ feature.properties.img_src +'" style="width:300px;">';
    layer.bindPopup('<p style="font-size:18px"> <b>' + feature.properties.chapter + '</b><br>' + '<a href="'+ feature.properties.url + '" target="_blank"><i>Learn More</i></a></p>' + image + '<br><p style="font-size:12px"><i>' + feature.properties.description + '</i>, Photo: ' + feature.properties.credit + '</p>');
  };

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/wherewework.geojson", {
        dataType: "json",
        success: function(response){
            //create marker options
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                onEachFeature: onEachFeature,
                pane: 'wwwPane',
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map);
        }
    });
};

function resize(map) {
    // window resize listener
    $(window).on("resize", function () {

        // make map height responsive to available space
        //   get heights
        let navbarHeight = $("#header1").outerHeight();
        let footerHeight = $("#footer").outerHeight();
        let windowHeight = $(window).outerHeight();

        // set new map height
        let newMapHeight = windowHeight - navbarHeight - footerHeight;
        $("#map").css({"height": newMapHeight});

        // set new storymap panel height
        let newStoryMapHeight = windowHeight - navbarHeight - footerHeight - storyMapHeaderHeight -15;
        $("#story").css({"height": newStoryMapHeight});

        // adjust body padding
        $('body').css({"padding-top": navbarHeight});

        // shrink title and footer font size on mobile devices
        let result = $('#device-size-detector').find('div:visible').first().attr('id');
        if (result === "xs") {
            $("#appTitle").css({"font-size": "0.75em"});
            $("#footerText").css({"font-size": "0.75em"});
        } else {
            $("#appTitle").css({"font-size": "1em"});
            $("#footerText").css({"font-size": "1em"});
        }

        // force Leaflet redraw
        map.invalidateSize();
    }).trigger("resize");
}

$(document).ready(createMap);