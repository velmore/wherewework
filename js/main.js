//create the light gray basemap centered on Alaska and set zoom level 
var map = L.map('mapid').setView([64,-154], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 9,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiamhjYXJuZXkiLCJhIjoiY2pmbHE2ZTVlMDJnbTJybzdxNTNjaWsyMiJ9.hoiyrXTX3pOuEExAnhUtIQ'
}).addTo(map);

// create operational layers for IBAs and Chapters that are empty for now
    let ibaLayer = L.layerGroup();
    let chapterLayer = L.layerGroup();

// create marker options for IBA markers
    var ibaMarkerOptions = {
        radius: 3,
        fillColor: "#0099cc",
        color: "#1d66c2",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        };

// create marker options for chapter markers    
    var chapterMarkerOptions = {
        radius: 5,
        fillColor: "#8bc53f",
        color: "#479400",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        };

 // fill the empty iba layer with data from the iba geojson file
    jQuery.getJSON("data/iba.geojson", function(json){
    L.geoJSON(json, {
    onEachFeature: ibaData,
    pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, ibaMarkerOptions);
    		}
  		})
	}) 
    
 // fill the empty chapter layer with data from the chapter geojson file
    jQuery.getJSON("data/chapters.geojson", function(json){
    L.geoJSON(json, {
    onEachFeature: chapterData,
    pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, chapterMarkerOptions);
    		}
  		})
	})


// This function is run for every feature found in the IBA geojson file and adds the feature to the empty layer we created above
	function ibaData(feature, layer){
  		ibaLayer.addLayer(layer)
// create a popup with feature properties from the IBA geojson
		layer.bindPopup("<p><b>IBA: </b>"+feature.properties.name+ 
                           "<br><b>Status: </b>" + feature.properties.STATUS+
                           "<br><b>Priority: </b>" + feature.properties.PRIORITY + "</p>");
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

// This function is run for every feature found in the chapter geojson file and adds the feature to the empty layer we created above
	function chapterData(feature, layer){    
   		chapterLayer.addLayer(layer)
// create a popup with feature properties from the chapter geojson
		layer.bindPopup('<p><b>Chapter: </b>' + feature.properties.Chapter + 
                '<br><b>City: </b>' + feature.properties.City+ '<br>' + '<a href="'+ feature.properties.URL + '" target="_blank">Website</a>' + '</p>'); 
		}
	let layerControl = {
  		"Important Bird Areas": ibaLayer, 
  		"Audubon Chapters": chapterLayer // an option to show or hide the layer you created from geojson
	}

// Add the control component, a layer list with checkboxes for operational layers 
L.control.layers(null, layerControl,{collapsed:false}).addTo(map);

// map locations
var headquarters = [61.19426597 , -149.8750011],
	anwr = [70.04850691 , -143.2526703] ,
	npra = [70.58954324 , -153.4844929],
	amblerRoad =[67.04403679 , -154.3544364] ,
	centralYukon =[69.91152329 , -148.8834698] , 
	kobukSeward = [65.57705865 , -163.5720769] ,
	beringWesternInt = [61.85741576 , -159.7929693] , 
	bristolBay = [57.63011225 , -159.6171303] ,
	izembek =[55.36310874 , -162.4466202] ,
	haines = [59.2382483 , -135.4676832] ,
	juneau = [58.30367737 , -134.4050661] , 
	tongass = [55.72162768 , -132.8350203] , 
	beringSea = [58.253027 , -175.657889] ,
	chukchiSea = [69.3919433 , -171.7715683] ,
	beaufortSea = [71.39902476 , -144.6723593] ;



// single icon for coasts, community, or climate ONLY
var singleIcon = L.Icon.extend({
	options: {
    iconSize:     [40, 29], // size of the icon
    iconAnchor:   [20, 15], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -10] // point from which the popup should open relative to the iconAnchor
	}
});

var communitiesIcon = new singleIcon({iconUrl: 'img/communities.png'}),
    climateIcon = new singleIcon({iconUrl: 'img/climatechange.png'}),
    coastsIcon = new singleIcon({iconUrl: 'img/coast.png'});

L.icon = function (options) {
    return new L.Icon(options);
};

// community icons
var hqPopup = L.responsivePopup().setContent('<h1>Audubon Alaska Headquarters</h1><a href=https://ak.audubon.org/ target="_blank"><h2>Learn More</a></h2><img src="img/Anchorage.jpg" style="width:300px;"><p><i>Downtown Anchorage</i>, <b> Photo:</b> John Schoen</p>');
L.marker(headquarters, {icon: communitiesIcon}).addTo(map).bindPopup(hqPopup);

var arPopup = L.responsivePopup().setContent('<h1>Ambler Road</h1><a href=https://ak.audubon.org/ target="_blank"><h2>Learn More</a></h2><img src="img/AmblerRoad.jpg" style="width:300px;"><p><i>Onion Portage</i>, <b> Photo:</b> Seth Katner</p>');
L.marker(amblerRoad, {icon: communitiesIcon}).addTo(map).bindPopup(arPopup);

// climate icons
var cyPopup = L.responsivePopup().setContent('<h1>Central Yukon BLM LUPA</h1><a href=https://ak.audubon.org/ target="_blank"><h2>Learn More</a></h2><img src="img/Prudhoe.jpg" style="width:300px;"><p><i>The Prudhoe Bay oilfield</i>, <b> Photo: </b>Florian Shulz</p>');
L.marker(centralYukon, {icon: climateIcon}).addTo(map).bindPopup(cyPopup);

var ksPopup = L.responsivePopup().setContent('<h1>Kobuk-Seward Peninsula BLM LUPA</h1><a href=https://ak.audubon.org/ target="_blank"><h2>Learn More</a></h2><img src="img/Seward.jpg" style="width:300px;"><p><i>Caribou on the Seward Peninsula</i>, <b> Photo:</b> Jim Dau</p>');
L.marker(kobukSeward, {icon: climateIcon}).addTo(map).bindPopup(ksPopup);

var bswiPopup = L.responsivePopup().setContent('<h1>Bering Sea-Western Interior BLM LUPA</h1><a href=https://ak.audubon.org/ target="_blank"><h2>Learn More</a></h2><img src="img/Andreafsky.jpg" style="width:300px;"><p><i>Yellow Warbler</i>, <b> Photo:</b> Alejandra Lewandowski</p>');
L.marker(beringWesternInt, {icon: climateIcon}).addTo(map).bindPopup(bswiPopup);

var bsPopup = L.responsivePopup().setContent('<h1>Bering Sea</h1><a href=https://ak.audubon.org/conservation/bering-sea target="_blank"><h2>Learn More</a></h2><img src="img/Bering.jpg" style="width:300px;"><p><i>Whiskered Auklet flock</i>, <b> Photo: </b> Ben Lascelles</p>');
L.marker(beringSea, {icon: climateIcon}).addTo(map).bindPopup(bsPopup);

var csPopup = L.responsivePopup().setContent('<h1>Chukchi Sea</h1><a href=https://ak.audubon.org/conservation/chukchi-sea target="_blank"><h2>Learn More</a></h2><img src="img/Chukchi.jpg" style="width:300px;"><p><i>Chukchi Sea Ice</i>, <b> Photo: </b> NASA</p>');
L.marker(chukchiSea, {icon: climateIcon}).addTo(map).bindPopup(csPopup);

var bs2Popup = L.responsivePopup().setContent('<h1>Beaufort Sea</h1><a href=https://ak.audubon.org/conservation/beaufort-sea target="_blank"><h2>Learn More</a></h2><img src="img/Beaufort.jpg" style="width:300px;"><p><i>Bowhead Whales</i>, <b> Photo: </b> Amelia Brower</p>');
L.marker(beaufortSea, {icon: climateIcon}).addTo(map).bindPopup(bs2Popup);

// coasts icons

var bbPopup = L.responsivePopup().setContent('<h1>Bristol Bay</h1><a href=https://ak.audubon.org/conservation/bristol-bay target="_blank"><h2>Learn More</a></h2><img src="img/BristolBay.jpg" style="width:300px;"><p><i>Black Legged Kittiwakes</i>, <b> Photo: </b> Jim Dau</p>');
L.marker(bristolBay, {icon: coastsIcon}).addTo(map).bindPopup(bbPopup);

var inwrPopup = L.responsivePopup().setContent('<h1>Izembek National Wildlife Refuge</h1><a href=https://ak.audubon.org/conservation/izembek-national-wildlife-refuge target="_blank"><h2>Learn More</a></h2><img src="img/Izembek.jpg" style="width:300px;"><p><i>Pacific Brant</i>, <b> Photo: </b> Ryan Hagerty</p>');
L.marker(izembek, {icon: coastsIcon}).addTo(map).bindPopup(inwrPopup);

//double icon for coasts AND climate OR community
var doubleIcon = L.Icon.extend({
	options: {
    iconSize:     [64, 30], // size of the icon
    iconAnchor:   [32, 15], // point of the icon which will correspond to marker's location
    popupAnchor:  [12, -15] // point from which the popup should open relative to the iconAnchor
	}
});

var coastsCommunitiesIcon = new doubleIcon({iconUrl: 'img/coasts_communities.png'}),
    coastsClimateIcon = new doubleIcon({iconUrl: 'img/coasts_climate.png'});

L.icon = function (options) {
    return new L.Icon(options);
};

// coasts and communities icons

var haPopup = L.responsivePopup().setContent('<h1> Haines/Chilkat River Valley</h1><a href=https://ak.audubon.org/ target="_blank"><h2>Learn More</a></h2><img src="img/Chilkat.jpg" style="width:300px;"><p><i>Bald Eagle</i>, <b> Photo: </b> Tim Bowman</p>');
L.marker(haines, {icon: coastsCommunitiesIcon}).addTo(map).bindPopup(haPopup);

//coasts and climate icons
var anwrPopup = L.responsivePopup().setContent('<h1> Arctic National Wildlife Refuge</h1><a href=https://ak.audubon.org/conservation/arctic-national-wildlife-refuge target="_blank"><h2>Learn More</a></h2><img src="img/ArcticRefuge.jpg" style="width:300px;"><p><i>Caribou in the Arctic Refuge</i>, <b> Photo: </b> Rebecca Sentner</p>');
L.marker(anwr, {icon: coastsClimateIcon}).addTo(map).bindPopup(anwrPopup);

var npraPopup = L.responsivePopup().setContent('<h1>National Petroleum Reserve- Alaska</h1><a href=https://ak.audubon.org/western-arctic target="_blank"><h2>Learn More</a></h2><img src="img/NPRA.jpg" style="width:300px;"><p><i>Greater White-fronted Goose at Teshekpuk Lake Wetlands</i>, <b> Photo: </b>Mario Davalos</p>');
L.marker(npra, {icon: coastsClimateIcon}).addTo(map).bindPopup(npraPopup);

// triple icon for coasts, community, and climate
var tripleIcon = L.Icon.extend({
	options: {
    iconSize:     [85, 31], // size of the icon
    iconAnchor:   [42, 15], // point of the icon which will correspond to marker's location
    popupAnchor:  [12, -18] // point from which the popup should open relative to the iconAnchor
	}
});

var allIcon = new tripleIcon({iconUrl: 'img/all.png'});

L.icon = function (options) {
    return new L.Icon(options);
};

// coasts, communities, and climate icons 
var juPopup = L.responsivePopup().setContent('<h1>Juneau</h1><a href=https://ak.audubon.org/ target="_blank"><h2>Learn More</a></h2><img src="img/Juneau.jpg" style="width:300px;"><p><i>Juneau coastline from above</i>, <b> Photo: </b> John Schoen</p>');
L.marker(juneau, {icon: allIcon}).addTo(map).bindPopup(juPopup);

var tnfPopup = L.responsivePopup().setContent('<h1>Tongass National Forest</h1><a https://ak.audubon.org/conservation/tongass-national-forest target="_blank"><h2>Learn More</a></h2><img src="img/Tongass.jpg" style="width:300px;"><p><i>Pacific Brant</i>, <b> Photo: </b> John Schoen</p>');
L.marker(tongass, {icon: allIcon}).addTo(map).bindPopup(tnfPopup);