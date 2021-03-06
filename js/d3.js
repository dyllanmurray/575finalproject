
(function() {  
	
    // variables for joining data
    var attrArray = ["Total","Gas","Lodging",	"Restaurant",	"Visitors",	"Visit_Rank"];
    var expressed = attrArray[0];	// initial attribute
    
    //* Chart frame dimensions
    var chartWidth = window.innerWidth * .50;
        chartHeight = 500,
        leftPadding = 60,	
        rightPadding = 5,
        topBottomPadding = 10,
        chartInnerWidth = chartWidth - leftPadding - rightPadding,
        chartInnerHeight = chartHeight - topBottomPadding * 2,
        translate = "translate(" + leftPadding + "," + topBottomPadding + ")";
    
    var yScale = d3.scaleLinear()
        .range([chartHeight,0])
        .domain([0,35])	
            
    window.onload = setMap();
    function setMap(){
        var width = window.innerWidth *.45,		
            height = 550;
        //* Create a new SVG container for the map
        var map = d3.select("body")
            .append("svg")
            .attr("class","map")
            .attr("width", width)
            .attr("height", height);
        
        //* Create an Albers Equal Area Projection
        var projection = d3.geoAlbers()
            .center([-0.0,51.1]) 
            .rotate([110,4.3])
            .scale(5500)
            .translate([width /2, height / 2]);
    
        var path = d3.geoPath()
            .projection(projection);
        //* Use queue to parallelize asynchronous data loading
        d3.queue() 
            .defer(d3.csv, "data/csv/MontanaCounties.csv") 	// Load attributes
            .defer(d3.json,"data/montana_counties.topojson")	// Load choropleth data
            .await(callback);
        
            
        //This function is called when the data has loaded
        function callback(error, csvData,mtCounties) {
            setGraticule(map, path);
            var mtCounties = topojson.feature(mtCounties, mtCounties.objects.montana_counties).features;
            
            //Join CSV Data to US Shapes 
            mtCounties = joinData(mtCounties,csvData);
            
            //Create the color scale
            var colorScale = makeColorScale(csvData);
            
            //Add enumerations units to the map 
            setEnumerationUnits(mtCounties, map, path,colorScale);
    
            //Add Chart to the map and display bars in the chart
            setChart(csvData,colorScale);
        
            createDropdown(csvData);
        
        };  //* end callback()
    
        function setGraticule(map, path){
            //create graticule generator
            var graticule = d3.geoGraticule()
            .step([2, 2]); //place graticule lines every 2 degrees of longitude and latitude
            //create graticule background
            var gratBackground = map.append("path")
            .datum(graticule.outline()) //bind graticule background
            .attr("class", "gratBackground") //assign class for styling
            .attr("d", path) //project graticule
    
            //create graticule lines
            var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
            .data(graticule.lines()) //bind graticule lines to each element to be created
            .enter() //create an element for each datum
            .append("path") //append each element to the svg as a path element
            .attr("class", "gratLines") //assign class for styling
            .attr("d", path); //project graticule lines
        };
        //This is a comment
        function setEnumerationUnits(mtCounties, map, path, colorScale) {
            
            var mt = map.selectAll(".NAME")	
                .data(mtCounties)
                .enter()
                .append("path")
                .attr("class",function(d) {
    
                    //* Print state name
                    return "county " + d.properties.NAME;	
                    
                })
                .attr("d",path)
                .style("fill", function colorStates(d) {
                    // return colorScale(d.properties[expressed]);
                    return choropleth(d.properties,colorScale);
                    
                })	
                .on("mouseover",function(d) {
                    highlight(d.properties);
                })
            
                .on("mouseout", function(d){	
                    dehighlight(d.properties);
                })
            
                //* listener for labeling each state or bar
                .on("mousemove", moveLabel);
            //* Add a style descriptor to each path 
            var desc = mt.append("desc")
                .text('{"stroke": "#000", "stroke-widht": "0.5px"}');
    
        }; //* end setEnumerationUnits()
        
        function joinData(mtCounties,csvData) {
            
            //* Columns used to Join data to US States
            var attrArray = ["Total","Gas","Lodging",	"Restaurant",	"Visitors",	"Visit_Rank"];;
    
            var expressed = attrArray[1];	// initial attribute
            
            //* Draw the United States
            //* Loop through csv to assign each set of csv attribute 
            //* values to geojson State
            for (var i = 0; i < csvData.length; i++){
            
                //* Current State
                var csvState = csvData[i]; 
                
                //* Primary key of CSV/Attribute file
                //* Ex. AK, AL, etc
                var csvKey = csvState.NAME;
                
                var test = mtCounties[i].properties;
                //* Loop through the US States to find matching attribute
                for (var a = 0; a < mtCounties.length; a++){
                    //* Current US State 
                    var geojsonProps = mtCounties[a].properties;
                
                    //* Primary key of the CSV/Attribute File
                    var geojsonKey = geojsonProps.NAME;
                
                
                    if (geojsonKey == csvKey) {	
                        attrArray.forEach(function(attr) {
                        
                            //* Get CSV attribute value
                            var val = parseFloat(csvState[attr]);
                        
                            //* Assign attribute and value to geojson properties
                            geojsonProps[attr] = val;
                        });
                        
                    }; // end if (geojsonKey)
                    
                }; //* end for loop mtCounties()
                
            }; //* end for loop csvData.length()
            
            return mtCounties;
        }; 
        
    };  //* end setMap()
    
    
    //* Color Scale Generator
    function makeColorScale(data) {
        var colorClasses = [
            '#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#31a354', '#006d2c'
        ];
    
        //* Create quantile color scale generator
        var colorScale = d3.scaleQuantile()
             .range(colorClasses);
        //* Build array of all values of the expressed attribute
        var domainArray = [];
        for (var i = 0;i < data.length; i++) {
            var val = parseFloat(data[i][expressed]);
            domainArray.push(val);
        };
        //* Assign array of expressed values as scale domain
        colorScale.domain(domainArray);
    
        return colorScale;
    };
    //* Draw Chart with Y Axis
    function setChart(csvData,colorScale) {
        var chart = d3.select("body")
            .append("svg")
            .attr("width",chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");
        
        //* Create a Rectangle for Chart Background Fill
        var chartBackground = chart.append("rect")
            .attr("class", "chartBackground")
            .attr("width", chartInnerWidth)
            .attr("height", chartInnerHeight)
            .attr("transform", translate);
    
        var yScale = d3.scaleLinear()
            .range([chartHeight,0])		
            .domain([0,100]);
        var bars = chart.selectAll(".bar")
            .data(csvData)
            .enter()
            .append("rect")
            .sort(function(a, b) {
                
                //* Order the bars largest to smallest
                return b[expressed] - a[expressed]
            })
            .attr("class", function(d){
                return "bar " + d.NAME;
            })
            .attr("width", chartInnerWidth / csvData.length - 1)
            .on("mouseover", highlight)
            .on("mouseout", dehighlight)	
            .on("mousemove", moveLabel);	
        
        
        //* Add style descriptor to each rect
        var desc = bars.append("desc")
            .text('{"stroke": "none", "stroke-width": "0px"}');
        
        //* Display the Chart Title inside the border of the chart
        //* Draw the title after the bar chart to keep title on top/in front
        var chartTitle = chart.append("text")
            .attr("x", 50)
            .attr("y", 40)
            .attr("class", "chartTitle")
            .text("Number of Variable " + expressed[3] + " in each state");
    
        var yAxis = d3.axisLeft()
            .scale(yScale);	
        var axis = chart.append("g")
            .attr("class","axis")
            .attr("transform", translate)
            .call(yAxis);					
        //* Set Bar Position, heights and colors 
        updateChart(bars, csvData.length, colorScale);
    }; 
        
    //* Function to reset the element style on mouseout	
    function dehighlight(props) {
        
        var selected = d3.selectAll("." + props.NAME)
            .style("stroke", function() {
                return getStyle(this,"stroke")	
            })
            .style("stroke-width", function() {
                return getStyle(this,"stroke-width")
            })
        
            .style("opacity", function(){			
                return getStyle(this,"opacity")
            });	
        
        //* Remove info label		
        d3.select(".infolabel")
            .remove();
        
        
        function getStyle(element, styleName) {		
            var styleText = d3.select(element)
                .select("desc")
                .text();	// return the text content
            
            var styleObject = JSON.parse(styleText);
            
            return styleObject[styleName];	// return the text content
            
        };
    }; //* end dehighlight()
    //* Function to Test for Data Value and Return a color
    function choropleth(props, colorScale) {
        //* Make sure attribute value is a number
        var val = parseFloat(props[expressed]);
        
        //* If Attribute Value Exists, Assign a Color; otherwise assign gray
        if (typeof val == 'number' && !isNaN(val)) {
            return colorScale(val);
        } else {
            return "#CCC";
        };
        
    }; 
    //* Function to Create a Dropdown Menu for Attribute Selection
    function createDropdown(csvData){
        
        //* Add Selected Element
        var dropdown = d3.select("body")
            .append("select")
            .attr("class", "dropdown")
            .on("change", function() {	
                changeAttribute(this.value,csvData)
            });
        
        //* Add Initial Option
        var titleOption = dropdown.append("option")
            .attr("class", "titleOption")
            .attr("disabled", "true")
            .text("Select Attribute");
        
        //* Add Attribute Name Choices from CSV Data File
        //* using pseudo-global variable: "attrArray"
        var attrOptions = dropdown.selectAll("attrOptions")
            .data(attrArray)
            .enter()
            .append("option")
            .attr("value", function(d) { return d})
            .text(function(d){ return d});
        
    }; 
    
    function updateChart(bars, n, colorScale) {
        var yAxis = d3.axisLeft()
            .scale(yScale);
        
        //* Position bars
        bars.attr("x", function(d,i){
            return i * (chartInnerWidth / n) + leftPadding;
            
            })
            .attr("height", function(d,i){
                return 500 - yScale(parseFloat(d[expressed]));
                
            })
            //* this then re-draws the bars from the bottom up (which is correct)
            .attr("y", function(d,i) {
            
                return yScale(parseFloat(d[expressed])) + topBottomPadding;
            })
        
            //* Color bars
            .style("fill", function(d) {
                return choropleth(d,colorScale);
        });
        
        var axis = d3.selectAll(".axis")
            .call(yAxis);
    
        //* Update Chart Title
        // this is bullshit
        if (expressed == "Total") {
            newTitle = "Total Spending";
            secondTitle = "2017 Non-Resident Tourism Dollars Spent by County";
        } else if (expressed == "Gas"){
            newTitle = "Gas Spending";
            secondTitle = "2017 Non-Resident Tourism Dollars Spent on Gas by County";
        } else if (expressed == "Lodging"){
            newTitle = "Lodging Spending";
            secondTitle = "2017 Non-Resident Tourism Dollars Spent on Lodging by County";
        } else if (expressed == "Restaurants"){
            newTitle = "Restaurant Spending";
            secondTitle = "2017 Non-Resident Tourism Dollars Spent on Restaurants by County";
        } else if (expressed == "Visitors"){
            newTitle = "Total Vistitors";
            secondTitle = "2017 Resident Visits with an Overnight Stay by County";
        } else if (expressed == "Visit_Rank"){
            newTitle = "Counties Ranked by Most Visited";
            secondTitle = "Mob-Rule.com Ranking of Each County by the Most to Least Visited";
        };
            
        
        var chartTitle = d3.select(".chartTitle")
            .text(newTitle)
            .attr("x","340");
        
        chartTitle.append("tspan")
             .attr("x","185") 
            .attr("dy","20")
            .text(secondTitle);
    
        
    }; 
    function highlight(props) {
        var selected = d3.selectAll("." + props.NAME)	
            .style("stroke", "blue")
            .style("opacity", .5)			
            .style("stroke-width","2");		
        
        setLabel(props);
        
    }; 
    function changeAttribute(attribute, csvData) {
        expressed = attribute;
        var colorScale = makeColorScale(csvData);
    
        var max = d3.max(csvData,function(d){
            return + parseFloat(d[expressed]);
        });
    
        yScale = d3.scaleLinear()
            .range([chartHeight,0])
            .domain([0,max])
            .nice();
        
        var state = d3.selectAll(".county")
        
            .transition()
            .duration(1000)
            //state gets re-drawn in a new color
            .style("fill", function(d) {
                
                return choropleth(d.properties,colorScale);
            });
        
        //* Re-sort, resize and recolor bars
        
        
        var bars = d3.selectAll(".bar")
        
        //* Re-sort bars from largest to smallest (b - a)
        .sort(function(a,b){
            return b[expressed] - a[expressed];
            
        }).transition()
        
        .delay(function(d,i) {
            
            //* Delay start of animation for 20 milliseconds
            return i * 20
        })
        .duration(1000);
        updateChart(bars, csvData.length, colorScale);
    } //* end changeAttribute()
        
    function setLabel(props) {
        //* Create an HTML string with <h1> element that contains the selected dropdown attribute
        var labelAttribute = "<h1>" + props[expressed] + "</h1><b>" + expressed + "</b>";
        
        //* Create Info Label div
        var infolabel = d3.select("body")
            .append("div")
            .attr("class", "infolabel")
            .attr("id", props.NAME + "_label")
            .html(labelAttribute);
        
        var stateName = infolabel.append("div")
            .attr("class", "labelname")
            .html(props.NAME);
        
    }; //* end setLabel()
    
    //* Function to move infolabel with mouse
    function moveLabel() {
        //* Get Width of label
        var labelWidth = d3.select(".infolabel")
            .node()
            .getBoundingClientRect()
            .width;
        
        //* User coordinates of mousemove to set label coordinates
        //* d3.event.clientX/Y = position of mouse
        var x1 = d3.event.clientX + 10,
            y1 = d3.event.clientY - 75,
            x2 = d3.event.clientX - labelWidth - 10,
            y2 = d3.event.clientY + 25;
        
        //* Horizontal label coordinates
        //* Test for overflow
        var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1;
        
        //* Vertical label coordinate
        //* Test for overflow
        var y = d3.event.clientY < 75 ? y2 : y1;
        
        d3.select(".infolabel")
            .style("left", x + "px")
            .style("top", y + "px");
    };
    
    })();  //* end self-executing anonymous function
    