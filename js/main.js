function createMap(){
    //create the map

    let parks = L.layerGroup();
    let campgrounds = L.layerGroup()
    let fishing = L.layerGroup()
    let brew = L.layerGroup()
    let airports = L.layerGroup()


    //dark matter basemap
    var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
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
        "Dark": CartoDB_DarkMatter,
        "Imagery": Esri_WorldImagery,
        "Physical": Esri_WorldPhysical,
        "Topo": Esri_WorldTopoMap
    };

    var map = L.map('map', {
        center: [46.894, -110.218],
        zoom: 7,
        layers: [Esri_WorldTopoMap]
    });
	
	// cycle through geojson to get an array
	jQuery.getJSON( "https://opendata.arcgis.com/datasets/b1598d3df2c047ef88251016af5b0f1e_0.geojson", function(json){
		L.geoJSON(json, {
			onEachFeature: addMyData,
			color: 'grey',
			fillColor: 'green' ,
            fillOpacity: .6,
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

    jQuery.getJSON( "data/campgrounds.geojson", function(json){
		L.geoJSON(json, {
			onEachFeature: addCamp,

		})
    });
    function addCamp(feature, layer){
            campgrounds.addLayer(layer);
            layer.bindTooltip("<b>State Campground:</b> " + layer.feature.properties.Name)
            // layer.bindPopup(layer.feature.properties.URL)
    }
    jQuery.getJSON( "data/fishing.geojson", function(json){
		L.geoJSON(json, {
			onEachFeature: addFish,

		})
    });
    function addFish(feature, layer){
            fishing.addLayer(layer);
            layer.bindTooltip("Fishing Access Site: " + layer.feature.properties.NAME)
            layer.bindPopup("<p><b>Fishing Access Site: </b>" + layer.feature.properties.NAME + "</p><p><b>Camping: </b>" + layer.feature.properties.CAMPING + "</p> <p><b>Hunting: </b>" + layer.feature.properties.HUNTING + "</p> <p><b>Boat Facility: </b>" + layer.feature.properties.BOAT_FAC, closePopUpOnCLick = 'true')
            // layer.bindPopup(layer.feature.properties.URL)
    }
      
    jQuery.getJSON( "data/brewery.geojson", function(json){
		L.geoJSON(json, {
			onEachFeature: addBrew,
		})
    });
    function addBrew(feature, layer){

            brew.addLayer(layer);
            layer.bindTooltip("<b>Name:</b> " + layer.feature.properties.Name)
        
    }
	var overlayMaps = {
        "National Parks": parks,
        "Campgrounds": campgrounds,
        "Fishing Access": fishing,
        "Breweries": brew,
        "Airports": airports
    };
    //add esri basemao tilelayer
    
    var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }).addTo(map);


     
    L.control.layers(baseMaps, overlayMaps).addTo(map);
    
    getData(map);
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

//Step 2: Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/airports.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            var attributes = processData(response)
            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
            createLegend(map, attributes);
        }
    });
};

function calcPropRad(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = .0029;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;

};

function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];
    console.log(attribute)

    //create marker options
    var options = {
        fillColor: "#0066cc",
        color: "#ffed10",
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.5
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRad(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>Airport:</b> " + feature.properties.Airport + "</p>";

    //add formatted attribute to popup content string
    // var year = attribute.split("_")[1];
    // popupContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + "</p>";
    
    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

function createSequenceControls(map, attributes){
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

       onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            //create range input element (slider)
            $(container).append('<input class="range-slider" type="range">');

            //add skip buttons
            $(container).append('<button class="skip" id="reverse" title="Previous Year">Previous</button>');
            $(container).append('<button class="skip" id="forward" title="Next Year">Next</button>');

            $(container).on('mousedown dblclick', function(e){
				L.DomEvent.stopPropagation(e);
            });

            return container;
        }
    });

    map.addControl(new SequenceControl());

    //set slider attributes
    $('.range-slider').attr({
        max: 7,
        min: 0,
        value: 0,
        step: 1
    });

    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 9: pass new attribute to update symbols
            updatePropSymbols(map, attributes[index]);

            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 7 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 7 : index;
        };

        //Step 8: update slider
        $('.range-slider').val(index);
    });
    
};

function updatePropSymbols(map,attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRad(props[attribute]);
            layer.setRadius(radius);
            updateLegend(map, attribute);	
            //add city to popup content string
            var popupContent = "<p><b>City:</b> " + props.Airport + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("_")[1];
            popupContent += "<p><b>Ridership in " + year + ":</b> " + props[attribute] + "</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
        };
	});
	
};
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("year") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    console.log(attributes);

    return attributes;
};

function createLegend(map, attributes){
	var LegendControl = L.Control.extend({
		options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">')
			
			var svg = '<svg id="attribute-legend" width="180px" height="80px">';
			//array of circle names to base loop on
			var circles = {
            max: 20,
            mean: 40,
            min: 60
        };

        //loop to add each circle and text to svg string
        for (var circle in circles){
            //circle string
            svg += '<circle class="legend-circle" id="' + circle + '" fill="#0066cc" fill-opacity="0.8" stroke="#ffed10" cx="30"/>';

            //text string
            svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
        };
			//add attribute legend svg to container			
			$(container).append(svg);			
            return container;
		}
	});

    map.addControl(new LegendControl());
	updateLegend(map, attributes[0]);
};

function getCircleValues(map, attribute){
	//start with min at highest possible and max at lowest possible number
	var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);
			
			//test for min
			if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};

function updateLegend(map, attribute){
    //create dynamic title
    var year = attribute.split("_")[1];
    var content = "Ridership in " + year;

    //replace legend content
    $('#temporal-legend').html(content);

    //get the max, mean, and min values as an object
    var circleValues = getCircleValues(map, attribute);
	for (var key in circleValues){
        //get radius
        var radius = calcPropRad(circleValues[key]);

        $('#'+key).attr({
            cy: 55 - radius,
            r: radius
        });

        //Step 4: add legend text
        $('#'+key+'-text').text(Math.round((circleValues[key]*100)/100));
    };
};
$(document).ready(createMap);
