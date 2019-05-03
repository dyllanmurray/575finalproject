function createMap(){
    //create the map

    let parks = L.layerGroup();
    let campgrounds = L.markerClusterGroup()
    let fishing = L.markerClusterGroup()
    let brew = L.markerClusterGroup()
    let trails = L.markerClusterGroup()
    let cities =L.markerClusterGroup()
    let wine = L.layerGroup()
    let university = L.markerClusterGroup()
    let stateParks = L.layerGroup()
    var airports = L.layerGroup()



    //dark matter basemap
    var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
    });
    
     //addesri imagery tilelayer
     var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    //add esri_ world physical basemap
    var Esri_WorldPhysical = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
	maxZoom: 8
    });
    //Esri world topo
    var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    });
    var baseMaps = {
        "Grey": Esri_WorldGrayCanvas,
        "Imagery": Esri_WorldImagery,
        "Physical": Esri_WorldPhysical,
        "Topo": Esri_WorldTopoMap
    };

    var map = L.map('map', {
        center: [47, -109.4],
        zoom: 7,
        minZoom: 7,
        layers: [Esri_WorldGrayCanvas]
    });
	// cycle through geojson to get an array
	jQuery.getJSON( "https://opendata.arcgis.com/datasets/b1598d3df2c047ef88251016af5b0f1e_0.geojson", function(json){
		L.geoJSON(json, {
			onEachFeature: addMyData,
			color: 'grey',
			fillColor: 'green' ,
            fillOpacity: .4,
            outline: 'purple',
			weight: .1,
			opacity: 1
		})
	});
	// This function is run for every feature found in the geojson file. It adds the feature to the empty layer we created above
	function addMyData(feature, layer){
        if(layer.feature.properties.PARKNAME == 'Yellowstone' ) {
        parks.addLayer(layer);

        layer.bindPopup("<p><b>Park:</b> " + layer.feature.properties.PARKNAME +  "</p><b>State:</b> " + layer.feature.properties.STATE + "</p> <b>Learn More: </b> https://www.nps.gov/yell/index.htm", closePopUpOnCLick = 'true');
        // layer.bindTooltip("National Park").openTooltip();
        } else if (layer.feature.properties.PARKNAME == 'Glacier' ) {
        parks.addLayer(layer);
        layer.bindPopup("<p><b>Park:</b> " + layer.feature.properties.PARKNAME +  "</p><b>State:</b> " + layer.feature.properties.STATE + "</p> <b>Learn More: </b> https://www.nps.gov/glac/index.htm", closePopUpOnCLick = 'true');
        }
    };

        ////// UNI //
        var uniIcon = L.icon({
            iconUrl: 'img/college.png',
            // shadowUrl: 'img/fishing.png',
        
            iconSize:     [20, 20], // size of the icon
            // shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
            // shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
        });
        
        campLayer = jQuery.getJSON( "data/university.geojson", function(json){
            L.geoJSON(json, {
                pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: uniIcon}).bindPopup(
                    "<p><b>Name:</b> " + feature.properties.NAME + 
                "<p><b>City:</b> "  +  feature.properties.CITY +
                "<p><b>City Population:</b> "  +  feature.properties.POPULATION +
                "<p><b>Total Enrollment:</b> "  +  feature.properties.TOT_ENROLL,  closePopUpOnCLick = 'true');
                }
            }).addTo(university)
        });

    /////CAMPGROUND //////

// var camp_fee = L.geoJson(campLayer, {filter: campFeeFilter}).addTo(campground_fee);

    var campIcon = L.icon({
        iconUrl: 'img/camping.png',
        // shadowUrl: 'img/fishing.png',
    
        iconSize:     [30, 30], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });
    
    campLayer = jQuery.getJSON( "data/campgrounds.geojson", function(json){
		L.geoJSON(json, {
            pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: campIcon}).bindPopup("<p><b>Campground:</b> " + feature.properties.Campground + 
            "</p><b>Type: </b>"+ feature.properties.Type + 
            "</p><b>Managing Agency: </b>"+ feature.properties.Managed_by + 
            "</p><b>Fee: </b>"+ feature.properties.Fee,  closePopUpOnCLick = 'true');
            }
		}).addTo(campgrounds)
    });
    ///END CAMPGROUND ////
    ////// TRAILHEAD /////

    var trailIcon = L.icon({
        iconUrl: 'img/trailhead.png',
        // shadowUrl: 'img/fishing.png',
    
        iconSize:     [30, 30], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });
    
    trailLayer = jQuery.getJSON( "data/trailhead.geojson", function(json){
		L.geoJSON(json, {
            pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: trailIcon}).bindTooltip("<b>Trailhead:</b> " + feature.properties.Name).bindPopup("<p><b>Trailhead:</b> " + feature.properties.Name + "</p><b>National Forest: </b>"+ feature.properties.National_Forest,  closePopUpOnCLick = 'true');
            }
		}).addTo(trails)
    });
    ////END TrailHEAD
      ////// FISHING
    var fishIcon = L.icon({
        iconUrl: 'img/fishing.png',
        // shadowUrl: 'img/fishing.png',
    
        iconSize:     [20, 20], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });
    
    myLayer = jQuery.getJSON( "data/fishing.geojson", function(json){
		L.geoJSON(json, {
            pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: fishIcon}).bindPopup("<p><b>Fishing Access Site: </b>" + feature.properties.NAME + "</p><p><b>Camping: </b>" + feature.properties.CAMPING + "</p> <p><b>Hunting: </b>" + feature.properties.HUNTING + "</p> <p><b>Boat Facility: </b>" + feature.properties.BOAT_FAC, closePopUpOnCLick = 'true');
            }
		}).addTo(fishing)
    });
    //// END FISHING
    //// BREWERy////
    var brewIcon = L.icon({
        iconUrl: 'img/brewery.png',
        // shadowUrl: 'img/fishing.png',
    
        iconSize:     [30, 30], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });
    
    breweryLayer = jQuery.getJSON( "data/brewery.geojson", function(json){
		L.geoJSON(json, {
            pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: brewIcon}).bindTooltip("<p><b>Brewery: </b>" + feature.properties.Name);
            }
		}).addTo(brew)
    });
        //////// END BREWERY


        //// citites///
        var cityIcon = L.icon({
            iconUrl: 'img/home.png',
            // shadowUrl: 'img/fishing.png',
        
            iconSize:     [15, 15], // size of the icon
            // shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
            // shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
        });
        
        citiesLayer = jQuery.getJSON( "data/cities.geojson", function(json){
            L.geoJSON(json, {
                pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: cityIcon}).bindPopup("<p><b>City: </b>" + feature.properties.Name + "</p><p><b>County: </b>" + feature.properties.County + "</p> <p><b>Population in 2010 </b>" + feature.properties.Pop_2010 + "</p> <p><b>Type: </b>" + feature.properties.Type, closePopUpOnCLick = 'true');
                }
            }).addTo(cities)
        });

//////WINERY ////

        var wineIcon = L.icon({
            iconUrl: 'img/winery.png',
            // shadowUrl: 'img/fishing.png',
        
            iconSize:     [30, 30], // size of the icon
            // shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
            // shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
        });
        
        wineLayer = jQuery.getJSON( "data/wineries.geojson", function(json){
            L.geoJSON(json, {
                pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: wineIcon}).bindPopup("<p><b>Winery: </b>" + feature.properties.Winery+ "</p><p><b>Address: </b>" + feature.properties.Address);
                }
            }).addTo(wine)
        });



        /////airports
        var airIcon = L.icon({
            iconUrl: 'img/airport.png',
            // shadowUrl: 'img/fishing.png',
        
            iconSize:     [15, 15], // size of the icon
            // shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
            // shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
        });
        
        wineLayer = jQuery.getJSON( "data/airports.geojson", function(json){
            L.geoJSON(json, {
                pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: airIcon}).bindPopup("<p><b>Airport: </b>" + feature.properties.Airport+ "</p><p><b>Ridership in 2015: </b>" + feature.properties.year_2015);
                }
            }).addTo(airports)
        });
        //////
///////// TOPOJSON STATE PARKS
L.TopoJSON = L.GeoJSON.extend({
    addData: function (data) {
      var geojson, key;
      if (data.type === "Topology") {
        for (key in data.objects) {
          if (data.objects.hasOwnProperty(key)) {
            geojson = topojson.feature(data, data.objects[key]);
            L.GeoJSON.prototype.addData.call(this, geojson);
          }
        }
        return this;
      }
      L.GeoJSON.prototype.addData.call(this, data);
      return this;
    }
  });
  L.topoJson = function (data, options) {
    return new L.TopoJSON(data, options);
  };
  //create an empty geojson layer
  //with a style and a popup on click
  var geojson = L.topoJson(null, {
    style: function(feature){
      return {
        color: "#459F69",
        opacity: 1,
        weight: 1.5,
        fillColor: '#007AC0',
        fillOpacity: 0.5
      }
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup('<p><b> Name: </b>'+feature.properties.NAME+'</p>' + 
      '<p><b> Acres: </b>'+feature.properties.ACRES+'</p>' + 
      '<p><b>Camping: </b>'+feature.properties.CAMPING+'</p>' +
      '<p><b>Hunting: </b>'+feature.properties.HUNTING+'</p>'+
      '<p><b>Boat Facilities: </b>'+feature.properties.BOAT_FAC+'</p>'+
      '<p><b>Camping: </b>'+feature.properties.CAMPING+'</p>')
    }
  }).addTo(stateParks);
  //fill: #317581;
  //define a function to get and parse geojson from URL
  async function getGeoData(url) {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data)
    return data;
  }
  
  //fetch the geojson and add it to our geojson layer
  getGeoData('data/state_parks.topojson').then(data => geojson.addData(data));




  L.TopoJSON = L.GeoJSON.extend({
    addData: function (data) {
      var geojson, key;
      if (data.type === "Topology") {
        for (key in data.objects) {
          if (data.objects.hasOwnProperty(key)) {
            geojson = topojson.feature(data, data.objects[key]);
            L.GeoJSON.prototype.addData.call(this, geojson);
          }
        }
        return this;
      }
      L.GeoJSON.prototype.addData.call(this, data);
      return this;
    }
  });
  L.topoJson = function (data, options) {
    return new L.TopoJSON(data, options);
  };
  //create an empty geojson layer
  //with a style and a popup on click
  var geojsonMT = L.topoJson(null, {
    style: function(feature){
      return {
        color: "#748555",
        opacity: 1,
        weight: 1,
        fillColor: '#dbdbdb',
        fillOpacity: .3
      }
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup('<p>'+feature.properties.NAME+ ' County')
    }
  }).addTo(map);
  //fill: #317581;
  //define a function to get and parse geojson from URL
  async function getGeoData(url) {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data)
    return data;
  }
  
  //fetch the geojson and add it to our geojson layer
  getGeoData('data/mT.topojson').then(data => geojsonMT.addData(data));





        ///////////////////

	var overlayMaps = {   
        "Cities and Towns": cities,
        "Universities": university,
        "Breweries": brew,
        "Wineries": wine,

        "Campgrounds": campgrounds,
        "Trailheads": trails,
        "Fishing Access": fishing,

        "State Parks": stateParks,
        "National Parks": parks,

        "Airports": airports
        
    }
    
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);

    
};

$(document).ready(createMap);

var persistmenu="yes" //"yes" or "no". Make sure each SPAN content contains an incrementing ID starting at 1 (id="sub1", id="sub2", etc)
var persisttype="sitewide" //enter "sitewide" for menu to persist across site, "local" for this page only

if (document.getElementById){ //DynamicDrive.com change
document.write('<style type="text/css">\n')
document.write('.submenu{display: none;}\n')
document.write('</style>\n')
}

function SwitchMenu(obj){
	if(document.getElementById){
	var el = document.getElementById(obj);
	var ar = document.getElementById("masterdiv").getElementsByTagName("span"); //DynamicDrive.com change
		if(el.style.display != "block"){ //DynamicDrive.com change
			for (var i=0; i<ar.length; i++){
				if (ar[i].className=="submenu") //DynamicDrive.com change
				ar[i].style.display = "none";
			}
			el.style.display = "block";
		}else{
			el.style.display = "none";
		}
	}
}

function get_cookie(Name) { 
var search = Name + "="
var returnvalue = "";
if (document.cookie.length > 0) {
offset = document.cookie.indexOf(search)
if (offset != -1) { 
offset += search.length
end = document.cookie.indexOf(";", offset);
if (end == -1) end = document.cookie.length;
returnvalue=unescape(document.cookie.substring(offset, end))
}
}
return returnvalue;
}

function onloadfunction(){
if (persistmenu=="yes"){
var cookiename=(persisttype=="sitewide")? "switchmenu" : window.location.pathname
var cookievalue=get_cookie(cookiename)
if (cookievalue!="")
document.getElementById(cookievalue).style.display="block"
}
}

function savemenustate(){
var inc=1, blockid=""
while (document.getElementById("sub"+inc)){
if (document.getElementById("sub"+inc).style.display=="block"){
blockid="sub"+inc
break
}
inc++
}
var cookiename=(persisttype=="sitewide")? "switchmenu" : window.location.pathname
var cookievalue=(persisttype=="sitewide")? blockid+";path=/" : blockid
document.cookie=cookiename+"="+cookievalue
}

if (window.addEventListener)
window.addEventListener("load", onloadfunction, false)
else if (window.attachEvent)
window.attachEvent("onload", onloadfunction)
else if (document.getElementById)
window.onload=onloadfunction

if (persistmenu=="yes" && document.getElementById)
window.onunload=savemenustate
