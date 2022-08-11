<!--L.mapbox.accessToken = 'pk.eyJ1IjoiYm9laG5lcnQiLCJhIjoibjhHQnZ0byJ9.G56Xo1QotN86WVQz5Pp2NQ';
L.mapbox.map('map-two', 'mapbox.streets').setView([-14.7,28.5], 8);-->
<?php 
    $path2root = "../";
    $title = "Rain Archives | World Bank – Bihar State Flood Management Information System"; 
    $id = "Archive";
   include ($path2root . "src/includes/begin.php");
?>
<style>
#map {
  height: 400px;
  max-height: 100%;
  max-width:100%;
}
		
#mapSat {
  height: 400px;
  max-height: 100%;
  max-width:100%;
}

</style>
<div id="main" class="container-fluid">   
<div class="row">

  <!--
  **************
  LAYOUT FORM UI
    column 1
  **************
  -->
<div id="selectors" class="col-xs-12 col-sm-4 col-md-4"> 
    <p>Select from the options below to display archived forecasts.</p>
	<legend>1. Select a past flood event</legend>
		<SELECT ID="Flood" CLASS="ar5select form-control" onChange="resetAll()">
			<option value="201607" selected="selected"> July 2016</option>
			<option value="201608" > August 2016</option>
        </SELECT>
	<legend>2. Select an Averaging Period</legend>
        <SELECT ID="aveTime" CLASS="ar5select form-control" onChange="showDates(this.value)">
		<option value="0"> Please Select an Averaging Period</option>
			<option value="year24hour"> 24 Hour </option>
			<option value="year5day"> 5 Day</option>
        </SELECT>
	<legend>3 . Select the rainfall date to display</legend>
		<SELECT ID="dateselect" CLASS="ar5select form-control" onChange="loadModelBox(this.value)">
        </SELECT>
        
	<legend>4. Select to display a model</legend>
		<SELECT ID="Model" CLASS="ar5select form-control" onChange="setAccumulation(this.value)">
		</SELECT>
	<legend>5. Select the date the forecast was initialized (lead time)</legend>
		 <SELECT ID="lead" CLASS="ar5select form-control" onChange="doSomeThing(this.value)">
        </SELECT>


</div>
<div class="clearfix visible-xs-block"></div>
  <!-- END LAYOUT FORM UI -->
  
  <!--
  **************
  LAYOUT MAP
  **************
  -->
  
<div id="map-area" class="col-xs-12 col-sm-8 col-md-8">  <!-- LAYOUT MAP -->	
	<nav id='menu-ui' class='menu-ui'></nav>
	<div id="map" class="map"></div>
	<p class="inputHeading" id="p1"> </p>
	<div id="mapSat" class="map"></div>
</div> 
  <!-- clear the XS cols if their content doesn't match in height -->
  <div class="clearfix visible-xs-block"></div>
  <!--  END LAYOUT MAP  -->

</div> <!--	END ROW -->
</div>
<!-- end container-->
<?php include ($path2root . "src/includes/footer.php");?>
<!--
SCRIPTS
    -->
<script type="application/javascript" src="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js"></script>
<script type="application/javascript" src="http://d3js.org/topojson.v1.min.js"></script>
<script type="application/javascript" src='https://api.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.2.0/leaflet-omnivore.min.js'></script>
<script type="application/javascript" src="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0-rc.1/leaflet-src.js"></script>
<script type="application/javascript" src='https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.js'></script>

<script type="application/javascript" >

	startTime = "start"
	endTime = "end"
	watersheds = ""
	sat = ""
	
	function init() {
	//set up dropdown boxes

	//get todays date
	var today = new Date();
	var dd = today.getDate().toString();
	var mm = today.getMonth()+1; //January is 0!
	mm = mm.toString()
	var yyyy = today.getFullYear().toString();

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	today = yyyy+ mm+dd;
	
	
	function style(feature) {
			return {
				weight: 0.5,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.1,
				fillColor: '#75AED1' 
			};
		
		}
		/*
		} )
		*/
		}
		//alert("adding new layer to map")
		//var dateFile = "gbm_z1_ecmf_"+today+"00_d2_acc24h_2015120600.geojson"
		//drawForecast(dateFile)
 
	
	init();
	info = L.control();
	var map = L.map('map').setView([27.0,86.0], 7);
	var layers = document.getElementById('menu-ui');
    
	 L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
}).addTo(map);

	var mapSat = L.map('mapSat').setView([27.0,86.0], 7);
	
     L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
}).addTo(mapSat);
			
		var wathersheds = "";
		var activeLayer = "";
		var modelLayer = "";
		// when either map finishes moving, trigger an update on the other one.
map.on('moveend', follow).on('zoomend', follow);
mapSat.on('moveend', follow).on('zoomend', follow);
var quiet = false;
	
		map.on('zoomend', function(e) {
		
		var res = activeLayer.split("_")
		
			if ( map.getZoom() >= 7 ){ 
				if (res[1] == "z1") {
					activeLayer = activeLayer.replace("z1","z2")
					map.removeLayer(watersheds)
					
					drawForecast(activeLayer)
				} 
			} else {
			if (res[1] == "z2") {
					activeLayer = activeLayer.replace("z2","z1")	
					map.removeLayer(watersheds)	
								
					drawForecast(activeLayer)	
				}	
		}

		}
);
		drawLegend()
		
		mapSat.on('zoomend', function(e) {
		
		
		var res = activeLayer.split("_")
		
			if ( map.getZoom() >= 7 ){ 
				if (res[1] == "z1") {
					activeLayer = activeLayer.replace("z1","z2")
					map.removeLayer(watersheds)
					
					drawForecast(activeLayer)
				} 
			} else {
			if (res[1] == "z2") {
					activeLayer = activeLayer.replace("z2","z1")	
					map.removeLayer(watersheds)	
								
					drawForecast(activeLayer)	
				}	
		}
		
		
		});
		
		function follow(e) {
			if (quiet) return;
			quiet = true;
			if (e.target === map) sync(mapSat, e);
			if (e.target === mapSat) sync(map, e);
			quiet = false;
		}

// sync simply steals the settings from the moved map (e.target)
// and applies them to the other map.
	function sync(map, e) {
		map.setView(e.target.getCenter(), e.target.getZoom(), {
			animate: false,
			reset: true
		});
	}
		function getJson(zoomLevel, map, geojsonLayer){
			map.removeLayer(geojsonLayer);
			geojsonLayer.clearLayers();
			drawForecast(date) 
		}
	
	function updateOpacity(value) {
		//alert (value);
		modelLayer.setOpacity(value)
	}
	
	function addLayer(layer, name, zIndex) {
	
    layer.setZIndex(zIndex)
   
    // Create a simple layer switcher that
    // toggles layers on and off.
    var link = document.createElement('a');
        link.href = '#';
        link.className = 'active btn btn-default';
        link.innerHTML = name;

    link.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            this.className = 'btn btn-default';
        } else {
            map.addLayer(layer);
            this.className = 'active btn btn-default';
			
        }
    };
	i = layers.childNodes.length
	if (i >= 1) {
	elementName = layers.childNodes[0].innerHTML
		layers.replaceChild(link,layers.childNodes[0])
	} else {
		layers.appendChild(link);
	}
}

function addLayerSat(layer, name, zIndex) {
	
    layer
        .setZIndex(zIndex)
        
    // Create a simple layer switcher that
    // toggles layers on and off.
    var link = document.createElement('a');
        link.href = '#';
        link.className = 'active btn btn-default';
        link.innerHTML = name;

    link.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
		 if (mapSat.hasLayer(layer)) {
            mapSat.removeLayer(layer);
            this.className = 'btn btn-default';
        } else {
            mapSat.addLayer(layer);
            this.className = 'active btn btn-default';
			 
        }
	var res = layer.split("_")
	if ( map.getZoom() >= 7 ){ 
				if (res[1] == "z1") {
					layer = layer.replace("z1","z2")
					
				} 
			} else {
			if (res[1] == "z2") {
					layer = layer.replace("z2","z1")	
				}	
		}
       
    };

  i = layers.childNodes.length
	if (i >= 2) {
	elementName = layers.childNodes[0].innerHTML
		layers.replaceChild(link,layers.childNodes[1])
	} else {
		layers.appendChild(link);
	}
}
	function doSomeThing(layer) {
		map.removeLayer(watersheds)
		mapSat.removeLayer(sat)
		aveT = document.getElementById("Flood")
		ave = aveT.options[aveT.selectedIndex].value
		activeLayer = ave +"/"+layer
		
		drawForecast(activeLayer) 
				
		}
	function resetAll() {
		var dateSelectBox = $('#lead').empty(); // empty the select of times
		var dateSelectBox = $('#Model').empty(); // empty the select of times
		var dateSelectBox = $('#dateselect').empty(); // empty the select of times
		//var dateSelectBox = $('#Flood').empty(); // empty the select of times
		document.getElementById("aveTime").value= 0
		
		}
	
	function showDates(ave) {
	e = document.getElementById("Flood")
	event = e.options[e.selectedIndex].value
	
	if (ave == 'year24hour') {
		addin = 1
	}else {
		addin = 5
	}
	
	if (event == "rr") {
		var dateSelectBox = $('#dateselect').empty(); // empty the select of times
		var dateSelectBox = $('#initialSelect').empty(); // empty the select of times
		var dateSelectBox = $('#Model').empty(); // empty the select of times
		url= '../data/archive/'+event+'/year24hour.xml'
		//url = 'http://localhost:8080/archive/'+event+'/year24hour.xml'
		fileName = '../data/archive/'+event+'/year24hour.xml'
		//alert(fileName)
		boxName = "#dateselect"
		t= "24h"
		timeSel = ""
		setSelectBoxes(timeSel,url,boxName,fileName,t)
	} else	 {
		var dateSelectBox = $('#dateselect').empty(); // empty the select of times
		url= '../data/archive/'+event+'/'+ave+'.xml'
		//url = 'http://localhost:8080/archive/'+event+'/'+ave+'.xml'
		//alert(url)
		fileName = '../data/archive/'+event+'/'+ave+'.xml'
		//alert (url)
		boxName = "#dateselect"
		
		var selectBox = $(boxName); 
		$.ajax({
            url: url,
            type: 'GET',
            async: true,
            dataType: 'xml',
            data: {id: 43},
            success: function(xml){
			var course_data; // variable to hold data in once it is loaded
			var arrayList = []
			$.get(fileName, function(xml) { // get the courses.xml file
				course_data = xml; // save the data for future use
                            // so we don't have to call the file again
				 var that = $(boxName).empty(); // empty the select of times
				 
				$('date', course_data).each(function() { // find courses in data
            // dynamically create a new option element
            // make its text the value of the "title" attribute in the XML
            // and append it to the courses select
			var m = $(this).find('Forecastdate').text();
			arrayList.push(m)

        });
		
			// note: jQuery's filter params are opposite of javascript's native implementation :(
var unique = $.makeArray($(arrayList).filter(function(i,itm){ 
    // note: 'index', not 'indexOf'
     return i == $.inArray(itm, arrayList)
}));
			//alert(unique.length)
			that.append("<option  value=''>Select a date</option>");
			
			for (p=0; p<unique.length;p++) {
			var datep = unique[p]
			var year = initDate = datep.substr(0,4)
			var month = initDate = datep.substr(4,2)
			var day = initDate = datep.substr(6,2)
			var endmonth = month
			var endday = parseInt(day) + addin
			if (endday > 31 ) {
				endmonth = parseInt(month) + 1
				endday = endday - 31
			}
				
	 that.append("<option  value="+unique[p]+">"+ year + "-" + month + "-" + day+" 00Z to "+ year + "-" + endmonth + "-" + endday+" 00Z </option>");
	 }
    }, 'xml'); // specify what format the request will return - XML
 $('#date').change(function() { // bind a trigger to when the
                                      // courses select changes
        }
   );
    }});
	
	}
	}
	
		function loadModelBox(forecastDate) {
	e = document.getElementById("Flood")
	event = e.options[e.selectedIndex].value
	aveT = document.getElementById("aveTime")
	ave = aveT.options[aveT.selectedIndex].value
	//alert(forecastDate)
	if (event == "rr") {
		var dateSelectBox = $('#dateselect').empty(); // empty the select of times
		var dateSelectBox = $('#leadTime').empty(); // empty the select of times
		url= '../data/bihar/biharArchive/'+event+'/year24hour.xml'
		//url = 'http://localhost:8080/archive/'+event+'/year24hour.xml'
		fileName = '../data/archive/'+event+'/year24hour.xml'
		boxName = "#Model"
		
		setSelectBoxes(timeSel,url,boxName,fileName,t)
	} else	 {
		var dateSelectBox = $('#Model').empty(); // empty the select of times
		url= '../data/archive/'+event+'/year24hour.xml'
		//url = 'http://localhost:8080/archive/'+event+'/'+ave+'.xml'
		fileName = '../data/archive/'+event+'/'+ave+'.xml'
		boxName = "#Model"
		
			var selectBox = $(boxName); 
		$.ajax({
            url: url,
            type: 'GET',
            async: true,
            dataType: 'xml',
            data: {id: 43},
            success: function(xml){
			var course_data; // variable to hold data in once it is loaded
			var arrayList = []
			$.get(fileName, function(xml) { // get the courses.xml file
				course_data = xml; // save the data for future use
                            // so we don't have to call the file again
				 var that = $(boxName).empty(); // empty the select of times
				 
				$('date', course_data).each(function() { // find courses in data
            // dynamically create a new option element
            // make its text the value of the "title" attribute in the XML
            // and append it to the courses select
			var a = $(this).find('Forecastdate').text();
			var modelName
			if (a == forecastDate) {
				var m = $(this).find('model').text();
				arrayList.push(m)
			}

        });
		
			// note: jQuery's filter params are opposite of javascript's native implementation :(
var unique = $.makeArray($(arrayList).filter(function(i,itm){ 
    // note: 'index', not 'indexOf'
     return i == $.inArray(itm, arrayList)
}));
			//alert(unique.length)
			that.append("<option  value=''>Select a model</option>");
			
			for (p=0; p<unique.length;p++) {
      if (unique[p] == 'ecmf') {
						modelName = 'European (ECMWF)'
					} else if (unique[p] == 'cwao') {
						modelName = 'Canadian (CMA)'
					} else if (unique[p] == 'kwbc') {
						modelName = 'US (NCEP)'
					}else if (unique[p] == 'egrr'){
						modelName = 'UK (UKMET)'
					} else {
						modelName = 'Satellite'
					}
			
			
	 that.append("<option  value="+unique[p]+">"+ modelName +" </option>");
	 }
    }, 'xml'); // specify what format the request will return - XML
 $('#date').change(function() { // bind a trigger to when the
                                      // courses select changes
        }
   );
    }});
	
	}
	}
	
	
	function setSelectBoxes(timeSel,url,boxName,fileName,aveT, model) {
	
	
	var selectBox = $('#date'); 
		$.ajax({
            url: url,
            type: 'GET',
            async: true,
            dataType: 'xml',
            data: {id: 43},
            success: function(xml){
			var course_data; // variable to hold data in once it is loaded
			var value = []
			var year = []
			var leadTime = []
		
			//alert(t)
			//if (t == "sat") {
			
			$.get(fileName, function(xml) { // get the courses.xml file
					course_data = xml; // save the data for future use
								// so we don't have to call the file again
					 var that = $(boxName).empty(); // empty the select of times
					 that.append("<option  value=''>Select a date</option>");
					$('date', course_data).each(function() { // find courses in data
				// dynamically create a new option element
				// make its text the value of the "title" attribute in the XML
				// and append it to the courses select
				var fd = $(this).find('Forecastdate').text();
				var m = $(this).find('model').text();
				var ave = $(this).find('avePeriod').text();
				
				if (m == model) {
					if (fd == timeSel)  {
						
							var a = $(this).find('file').text();
							value.push(a);
							var b =$(this).find('init').text()
							year.push(b)
							var c = $(this).find('forecastDay').text()
							leadTime.push(c)
					
					//var c = $(this).find('month').text()
					//month.push(c)
					//var d = $(this).find('day').text()
					//day.push(d)
					//var e = parseInt(d)+1
					//endDay.push(e)
					//alert(d)
					
					//alert(e)
					//var e = parseInt(d)+parseInt(q)
					//endDay.push(e)
					//if (parseInt(d) > 31) {
					//	var f = parseInt(c)+1
					//	endmonth.push(f)
					//} else {
						//alert(c)
					//	endmonth.push(c)
					//	}
					   
					}
				}
			});
			for (o=0;o<value.length;o++) {
				value2 = value[o]
				
				that.append("<option  value="+value2+">"+ year[o] +" " + leadTime[o] +"</option>");
			}
		}, 'xml'); // specify what format the request will return - XML
	 $('#date').change(function() { // bind a trigger to when the
						});
	
		} //function xml
		});	
	}
	
	function setAccumulation(m) {
		e = document.getElementById("Flood")
		event = e.options[e.selectedIndex].value
		aveT = document.getElementById("aveTime")
		ave = aveT.options[aveT.selectedIndex].value
		forecastdateT = document.getElementById("dateselect")
		forecastdatetime = forecastdateT.options[forecastdateT.selectedIndex].value
		
		//alert(ave)
		var dateSelectBox = $('#lead').empty(); // empty the select of times
		url= '../data/archive/'+event+'/year24hour.xml'
		//url = 'http://localhost:8080/archive/'+event+'/'+ave+'.xml'
		fileName = '../data/archive/'+event+'/'+ave+'.xml'
		boxName = "#lead"
		setSelectBoxes(forecastdatetime,url,boxName,fileName,ave,m)

		}
		
		
		
		function drawForecast(layer) {
		//alert("in draw")
			activeLayer = layer
			//alert(layer)
			var res = activeLayer.split("_")
      
	  zoomL = res[1]
			if ( map.getZoom() >= 7 ){
			
				if (res[1] == "z1") {
					activeLayer = layer.replace("z1","z2")
					zoomL = "z2"
					
				} 
			} else {
			if (res[1] == "z2") {
					zoomL = "z1"
					activeLayer = layer.replace("z2","z1")	
				}	
		}
		
		activeLayer = activeLayer.trim()
		watersheds = L.geoJson(null, {style: style, onEachFeature: onEachFeature,success: addText(activeLayer)});
		modelLayer = omnivore.topojson( '../data/archive/'+activeLayer, null, watersheds)
		modelLayer.addTo(map);
		 
		addLayer(modelLayer,"Forecast",1)
		
		satName = res[0] + "_" + zoomL + "_" +  res[3] + "_sat_" + res[5] + "_" + res[3] +".geojson"
		//alert(satName)
		sat = L.geoJson(null, {style: style, onEachFeature: onEachFeature});
		omnivore.topojson( '../data/archive/'+satName, null, sat).addTo(mapSat);
		addLayerSat(sat,"Satellite",1)
		
	function onEachFeature(feature, layer) {
		startTime = feature.properties.startTime
		endTime = feature.properties.endTime
		sub = feature.properties.Subbasin
		
			popupOptions = {maxWidth: 200};
				rain = feature.properties.rainfall
				roundRain = rain.toFixed(1)
				
                layer.bindPopup("<b>Daily Average Rainfall in Subbasin </b> "+ sub +" was " + roundRain + " mm/day "
                    ,popupOptions);
			
		}
		
	function getColor(d) {
			return d > 100.0 ? '#800000' :

				   d > 50.0 ? '#FF0000' :
				   
				   d > 20.0 ? '#ff8000' :

				   d > 10.0 ? '#FFFF00' :

			       d > 6.0  ? '#228B22' :

			       d > 4.0  ? '#7CFC00' :

			       d > 2.0  ? '#4D8BE8' :

			       d > 1.0  ? '#0d96e7' :

				   d > 0.5  ?  '#4bbbfd' :

			       d > 0.01 ? '#c8e5f6' :

			                  '#e9f1f6 ';
		}
	function style(feature) {
			return {
				weight: 0.5,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.9,
				fillColor: getColor(feature.properties.rainfall)
			};
		}
		} 
		//)
		//alert("done with draw")
		///addText(startTime, endTime)
	//}
	
	function addText(activeLayer){
		//alert("addText")
		var res = activeLayer.split("_")
		
			init = res[6]
			initDate = init.substr(0,4)
			initMonth = init.substr(4,2)
			initDay = init.substr(6,2)
			initial = initDate +"/"+initMonth+"/"+initDay
			hour = res[5]
			averageTime = hour.substr(3,2)
			begin = res[3]
			bDate = begin.substr(0,4)
			bMonth = begin.substr(4,2)
			bDay = begin.substr(6,2)
			beginDate = bDate +"/"+bMonth+"/"+bDay
			if (averageTime == "24") {
				ave = "24 hour average"
				addin = 1
			} else {
				ave = "5 day average"
				addin = 5
			}
			var endmonth = bMonth
			var endday = parseInt(bDay) + addin
			if (endday > 31 ) {
				endmonth = parseInt(bMonth) + 1
				endday = endday - 31
			}
			
			endDate = bDate +"/"+endmonth+"/"+endday
			
		
		document.getElementById("p1").innerHTML = "The top map displays a forecast average from "+ beginDate +" 00Z to " + endDate +" 00Z. This forecast was initialized on " + initial + " 00Z and is a " + ave +". <br>  The map on the bottom is a satellite product for the same period."

		
	}
	function drawLegend() {
	
		info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
		};

		function getColor(d) {
		//alert(d)
			return d > 100.0 ? '#800000' :

				   d > 50.0 ? '#FF0000' :
				   
				   d > 20.0 ? '#ff8000' :

				   d > 10.0 ? '#FFFF00' :

			       d > 6.0  ? '#228B22' :

			       d > 4.0  ? '#7CFC00' :

			       d > 2.0  ? '#4D8BE8' :

			       d > 1.0  ? '#0d96e7' :

				   d > 0.5  ?  '#4bbbfd' :

			       d > 0.01 ? '#c8e5f6' :

			                  '#e9f1f6 ';
			}
		
		//Add Legend
		
		
		
		
		
		legend = L.control({position: 'bottomright'});		
		legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0.01,0.5,1.0,2.0,4.0,6.0,10.0,20.0,50.0,100.0],
			labels = [],
			colorfrom,
			from, to;
			
			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];
				
				labels.push(
				'<i style="background:' + getColor(from + 0.01) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
			}
        div.innerHTML =('<B>Legend</B><br>Precipitation<br>Accumulation<br>(mm/day)<br>' + labels.join('<br>'));
        return div;
        };

		legend.addTo(map);
		}
	
	</script>

<?php include ($path2root . "src/includes/end.php");?>
