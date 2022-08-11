/**
 * Copyright UCAR (c) 1992 - 2016
 * University Corporation for Atmospheric Research(UCAR)
 * National Center for Atmospheric Research(NCAR)
 * Research Applications Laboratory(RAL)
 * P.O.Box 3000, Boulder, Colorado, 80307-3000, USA
 *
 * The Climate Inspector is subject to the terms of the BSD 3-Clause License: http://choosealicense.com/licenses/bsd-3-clause
 * Third party libraries are each subject to their respective licenses (see documentation for details)
 */
 
/**
 * Initialize the GUI
 */
 
 var graphName;
 var graphDate
 var graphSatDate
 var graphNepalDate;
	var sub;
	var timeDownload
	var zoomRes;
  	var resModel;
	//var domainDir = 'bihar'
	var domainDir = 'biharData'
	var d = 'gbm'
	var dataLoc = "../"
	var layerCWCstage = new L.geoJson();
	var geojsonLayer = new L.geoJson();
	var upGroup = new L.LayerGroup();
	var basinData = "../data/topo_Upstream2.geojson"
	var gLayer = new L.LayerGroup();
	var alllayers = {};
	var nepalSiteLayer = new L.geoJson();
 var raincheck = false;
	
	subNameVar = 'Subbasin'
	subVar = 'GridID'
	
	function addLayer(checkbox,map) {
		if(checkbox.checked == true){
          addRainGage(map)
          raincheck = true;
          
    }else{
         removeRainGage(map)
         raincheck = false;
   }
		
	}
	
	function removeRainGage(map) {
			map.removeLayer(nepalSiteLayer)
	}
 
function getNepalDate(a,m) {
 url = "../biharData/drawNepalFiles.xml"
		$.ajax({
				url: url,
				type: 'GET',
				async: false,
				dataType: 'xml',
				data: {id: 43},
				success: function(xml){
				var course_data; // variable to hold data in once it is loaded
				var arrayList = []
				$.get(url, function(xml) { // get the courses.xml file
					course_data = xml; // save the data for future use
								// so we don't have to call the file again
					$('listing', course_data).each(function() { // find courses in data
				// dynamically create a new option element
				// make its text the value of the "title" attribute in the XML
				// and append it to the courses select
				var ave = $(this).find('ave').text();
       
       //alert(ave)
				
				if (ave == a) {
					var model = $(this).find('model').text();
            
					if (model == m){
             graphNepalDate = $(this).find('recentDate').text() 
          }
				}						
			});
				// note: jQuery's filter params are opposite of javascript's native implementation :(

		}, 'xml'); // specify what format the request will return - XML
	 $('#listing').change(function() { // bind a trigger to when the
										  // courses select changes
			} );
		}});
 }
	function getActiveLayer(i) {
 
 var drawFile = ''
 url = "../biharData/drawFiles.xml"
 //alert(graphDate)
		$.ajax({
				url: url,
				type: 'GET',
				async: false,
				dataType: 'xml',
				data: {id: 43},
				success: function(xml){
				var course_data; // variable to hold data in once it is loaded
				var arrayList = []
				$.get(url, function(xml) { // get the courses.xml file
					course_data = xml; // save the data for future use
								// so we don't have to call the file again
					$('listing', course_data).each(function() { // find courses in data
			
				var ave = $(this).find('ave').text();
				if (ave == 'acc24h') {
					var model = $(this).find('model').text();
            
					if (model == 'multimodel'){
             drawFile = $(this).find('drawFile').text();
             graphDate = $(this).find('recentDate').text()
             var gLayer = new L.LayerGroup();
             //alert (drawFile)
             cwc = 10
             layer = dataLoc + domainDir +"/"+ drawFile
             if ( i == 1) {
               drawForecast(layer,gLayer, map, cwc)
             } 
          }
				}						
			});
				// note: jQuery's filter params are opposite of javascript's native implementation :(

		}, 'xml'); // specify what format the request will return - XML
	 $('#listing').change(function() { // bind a trigger to when the
										  // courses select changes
			} );
		}});
	}
 
 	function getSatDate(a,m) {
  //get active Sat date
   url = "../biharData/drawSatFiles.xml"
		$.ajax({
				url: url,
				type: 'GET',
				async: false,
				dataType: 'xml',
				data: {id: 43},
				success: function(xml){
				var course_data; // variable to hold data in once it is loaded
				var arrayList = []
				$.get(url, function(xml) { // get the courses.xml file
					course_data = xml; // save the data for future use
								// so we don't have to call the file again
					$('listing', course_data).each(function() { // find courses in data
				// dynamically create a new option element
				// make its text the value of the "title" attribute in the XML
				// and append it to the courses select
				var ave = $(this).find('ave').text();
       
       //alert(ave)
				
				if (ave == a) {
					var model = $(this).find('model').text();
            
					if (model == m){
             drawSatFile = $(this).find('drawFile').text();
             graphSatDate = $(this).find('recentDate').text()
             //graphDate = graphSatDate
            
          }
				}						
			});
				// note: jQuery's filter params are opposite of javascript's native implementation :(

		}, 'xml'); // specify what format the request will return - XML
	 $('#listing').change(function() { // bind a trigger to when the
										  // courses select changes
			} );
		}});
 }
	
	function getCatchment(feature){
		var sub = feature.properties.GridID
		return sub
	}
	
	//This function returns todays date in formate for discharge -2017-09-26T06:00:00.000Z
	function todayDischarge() {
		var today = new Date();
			
		today.setDate(today.getDate() )
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
			
		if(dd<10) {
			dd='0'+dd
		} 

		if(mm<10) {
			mm='0'+mm
		} 
		year= String(yyyy)
		month = String(mm)
		day = String(dd)
		today2 = year+"-"+month+"-"+day+"T06:00:00.000Z"
		return today2
	}
	
	//This function returns todays date in YYYYMMDD00
	function todayDate() {
		var today = new Date();
			
		today.setDate(today.getDate() )
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
			
		if(dd<10) {
			dd='0'+dd
		} 

		if(mm<10) {
			mm='0'+mm
		} 
		year= String(yyyy)
		month = String(mm)
		day = String(dd)
		today2 = year+month+day+"00"
		return today2
	}
	
	//This function returns todays date in YYYYMMDD00
	function threeDate() {
		var today = new Date();
			
		today.setDate(today.getDate() - 3)
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
			
		if(dd<10) {
			dd='0'+dd
		} 

		if(mm<10) {
			mm='0'+mm
		} 
		year= String(yyyy)
		month = String(mm)
		day = String(dd)
		today2 = year+month+day+"00"
		return today2
	}
 
 //This function returns todays date in YYYYMMDD00
	function oneDay() {
		var today = new Date();
			
		today.setDate(today.getDate() - 1)
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
			
		if(dd<10) {
			dd='0'+dd
		} 

		if(mm<10) {
			mm='0'+mm
		} 
		year= String(yyyy)
		month = String(mm)
		day = String(dd)
		today2 = year+month+day+"00"
		return today2
	}
	
	//function to get the id of the watersheds associated with rain CWC gage
	function getID(feature) {
		code = feature.properties.site_code_
		
		url = "../data/link.xml"
		$.ajax({
				url: url,
				type: 'GET',
				async: false,
				dataType: 'xml',
				data: {id: 43},
				success: function(xml){
				var course_data; // variable to hold data in once it is loaded
				var arrayList = []
				$.get(url, function(xml) { // get the courses.xml file
					course_data = xml; // save the data for future use
								// so we don't have to call the file again
					$('date', course_data).each(function() { // find courses in data
				// dynamically create a new option element
				// make its text the value of the "title" attribute in the XML
				// and append it to the courses select
				var a = $(this).find('code').text();
				
				if (a == code) {
					var basin = $(this).find('basin').text();
					var name = $(this).find('name').text();
					
					drawBasin(name)
				}						
			});
				// note: jQuery's filter params are opposite of javascript's native implementation :(

		}, 'xml'); // specify what format the request will return - XML
	 $('#date').change(function() { // bind a trigger to when the
										  // courses select changes
			} );
		}});
		

	}
	 
	//draw the big watershed upstream from CWC gage
	function drawBasin(name) {
		
		
		if (map.hasLayer(geojsonLayer))	{
			map.removeLayer(geojsonLayer)
		}
		
		function onestyle(feature) {
			return {
				//fillOpacity: 0,
				weight: 5,
				//opacity: 1,
				color: 'red',  //Outline color	
			};
		}			
		
		dataURL = "../data/link.geojson"
		//basinURL2 = "../data/bihar/data/watershedUpstream.geojson"
		basinURL2 = "../data/upstream.geojson"
		topo = "../data/topo.geojson"
		
		//*****************ADD Z1 Basins**************************
		
		$.ajax({
			type: "POST",
			url: basinURL2,
			dataType: 'json',
			success: function (response) {
				geojsonLayer = L.geoJson(response, {style:onestyle,  filter:filterFunc})
				//.on('click', handleClick)
				.addTo(map);
				//upGroup.addLayer(geojsonLayer)
				//upGroup.addTo(map)
				map.fitBounds(geojsonLayer.getBounds());
				}
		});
		
		function filterFunc(feature,layer) {
			idNum = Number(feature.properties.Name)
			nameNum = Number(name)
			if (idNum === nameNum) {
				//alert("found it")
				return true
			}

		}
		
	}
	
	function drawLegend() {
	
		info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
		};

		function getColor(d) {
		
			return d > 100.0 ? '#800000' :
				   d > 50.0 ? '#FF0000' :
				   
				   d > 20.0 ? '#FFA500' :
				   d > 10.0 ? '#FFFF00' :
			       d > 6.0  ? '#228B22' :
			       d > 4.0  ? '#7CFC00' :
			       d > 2.0  ? '#4D8BE8' :
			       d > 1.0  ? '#0d96e7' :
				   d > 0.5  ?  '#4bbbfd' :
			       d > 0.01 ? '#c8e5f6' :
			                  '#e6e6e6';
			}
		
		//Add Legend
		legend = L.control({position: 'bottomright'});		
		legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0.0,0.01,0.5,1.0,2.0,4.0,6.0,10.0,20.0,50.0,100.0],
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
        div.innerHTML =('<B>Precipitation</B><br>(mm/day)<br>' + labels.join('<br>'));
        return div;
        };

		legend.addTo(map);
		}
	
		//color code for nepal rain sites
	function nepalSiteStyle(prop) {
		return {  //no data
					fillColor: '#002F6C',
					radius: 3,
					color: '#002F6C',
					weight: 1,
					opacity: 1,
					fillOpacity: 1.0		
				};
	}
	
	//Nepal rain sites
	function addRainGage(map) {
	//*****************ADD NEPAL Gages**************************
		//var url = "../data/nepalSite_0425.geojson";
   	modelName = getSelectedModelValues()
		//gbm_z1_cwao_2018091600_d9_acc24h
		fileParts = modelName.split("_")
      if (fileParts.length == 6) { //satellite
		  a = fileParts[4]
      m = fileParts[2]
   } else {
     a = fileParts[5]
     m = fileParts[2]
   }
   getNepalDate(a,m)
   
   var url = "../data/nepal_stations.geojson";
	
		$.ajax({
				type: "POST",
				url: url,
				dataType: 'json',
				success: function (response) {
					nepalSiteLayer =  L.geoJson(response, { onEachFeature: onEachNepalFeature,
						pointToLayer: function (feature, latlng) {
							return L.circleMarker(latlng, nepalSiteStyle(feature.properties));
						}		
					}) //layerCWstage end
				//.on('click', handleClick)
				.addTo(map);	
				}	//function end	
			});  //Ajax end	
		function onEachNepalFeature(feature, layer) {
			var formalName = feature.properties.formal_nam
			var gsid = feature.properties.gsid
			
		 layer.on({
			click: function populate() {
				var sub = feature.properties.STN_ID 
				retrieveGraphNepal(graphNepalDate,sub,formalName)
			}//populate
		});  //onLayer
		
		  //  layer.bindPopup(feature.properties.name + '<br>' + graph_container); 
		popupOptions = {closeButton:true, closeOnClick:true};
		//	var popup = L.popup({keepInView:true})	
			html = makeNepalPopupContent ( feature ) 
			var popup = new L.Popup({
				autoPan: false,
                keepInView: true,
                closeButton: true,
				closeOnClick: true,
				className : 'custom',
                offset: new L.point(0, -5)
            }).setContent(html);
			
			layer.bindPopup(popup)
				
			}//on eachFeature nepalSites
		function makeNepalPopupContent ( feature ) {
        var html = '<b>Site name =' + feature.properties.formal_nam +  '</b><BR>';
       
        return html;
    }; 
		
	}
	
 	
	
	function drawForecast(layer,gLayer, map, cwc,recentDate) {
	
		  // alert(graphDate)
		 //alert(layer)
			mapZoom = map.getZoom()
			//alert(mapZoom)
			if (mapZoom >= 7) {
				layerName = layer.replace('z1','z2')
			} else {
				layerName = layer
			}
		
		activeLayer = layerName
		addLayers = []
		var res = activeLayer.split("_")
    if (res.length ==6) { //sat
      a = res[4]
      m = res[2]
    }else {  //forecast
       a = res[5]
       m = res[2]
    }
    getSatDate(a,m)
		gLayer.clearLayers();
		addLayers = activeLayer
		aLayer = addLayers
		cut = aLayer.split("_")
		start = cut[0]
		fullLayer = dataLoc+domainDir+'/' + aLayer
   
			if (cut[5] == "acc1mo") {
				watersheds = L.geoJson(null, {style: style, onEachFeature: onEachFeatureSeasonal,success: addText(layerName)});
				modelLayer = omnivore.topojson( layerName, null, watersheds)
				gLayer.addLayer(modelLayer)
    }else if (cut[5] == "acc3mo" ){
				watersheds = L.geoJson(null, {style: style, onEachFeature: onEachFeatureSeasonal,success: addText(layerName)});
				modelLayer = omnivore.topojson( layerName, null, watersheds)
				gLayer.addLayer(modelLayer)
    } else if (cut.length == 6) { //satellite
				a = res[4]
				m = res[2] //get model name
				getSatDate(a,m)
				watersheds = L.geoJson(null, {style: style, onEachFeature: onEachFeatureSat,success: addText(aLayer)});
				modelLayer = omnivore.topojson( aLayer, null, watersheds)
				gLayer.addLayer(modelLayer)
			} else {
				watersheds = L.geoJson(null, {style: style, onEachFeature: onEachFeature,success: addText(layerName)});
				modelLayer = omnivore.topojson( layerName, null, watersheds)
				gLayer.addLayer(modelLayer)
			}
   
  
		if (cwc == 10) {
			var cwcStageUrl = "getsmallCWCObs.php";
		timeDate = todayDischarge()
		url = "http://bihar.rap.ucar.edu/flow/getsmallCWCObs.php?time=" + timeDate
		//$.getJSON(url, function(data) { addDataToMap(data, map); });
		$.ajax({
				type: "POST",
				url: url,
				dataType: 'json',
				success: function (response) {
					layerCWCstage =  L.geoJson(response, { onEachFeature: onEachCWCFeature,
						pointToLayer: function (feature, latlng) {
							return L.circleMarker(latlng, obsStyelFunc1(feature.properties));
						}		
					}) //layerCWstage end
				//.on('click', handleClick)
				.addTo(map);	
				}	//function end	
			});  //Ajax end
		
		
		gLayer.addLayer(layerCWCstage)
    }
    gLayer.addTo(map)
		
		
		if (cwc == true) {
      removeRainGage(map)
      addRainGage(map)
    }
		

		
    //check if raingauge is turned on
    //gauge = document.getElementById("raingauge").checked
   
		//if (cwc == 2) {
		//	addRainGage(map)
		//}	
   
   	function onEachFeatureSeasonal(feature, layer) {
			
			var sub = getCatchment(feature)
			
		 layer.on({
			click: function populate() {
				retrieveGraphSeasonal(sub,"")
			}//populate
		});  //onLayer
		popupOptions = {maxWidth: 200};
		
		html = writeHtml(feature)
		layer.bindPopup(html,popupOptions);
	}		
			
	function onEachFeature(feature, layer) {
			initialTime = feature.properties.DATETIME
			html = ""
			name = feature.properties.Subbasin
			var sub = getCatchment(feature)
      
		 layer.on({
			click: function populate() {
        
				retrieveGraph(graphDate,sub,name)
        
			}//populate
		});  //onLayer
		popupOptions = {maxWidth: 200};
		
		
		rain = feature.properties.rainfall
		//roundRain = rain
		rainmin = feature.properties.rfmin
		//roundRainmin = rainmin
		rainmax = feature.properties.rfmax
		if (rain == null) {
			roundRainmax = rainmax
			roundRain = rain
			roundRainmin = rainmin
		} else {
			roundRainmax = rainmax.toFixed(1)
			roundRain = rain.toFixed(1)
			roundRainmin = rainmin.toFixed(1)
		}
		//roundRainmax = rainmax
		startTime = feature.properties.startTime
		endTime = feature.properties.endTime
		subName = feature.properties.Subbasin
		
		html = "Subbasin " + subName + "<br>Forecast upper bound is " + roundRainmax + " mm/day <br> Forecast lower bound is " + roundRainmin + " mm/day <br>Mean forecast is " + roundRain + " mm/day <br>"

		layer.bindPopup(html,popupOptions);	
	}//on eachFeature

function onEachFeatureSat(feature, layer) {	
		 var sub = getCatchment(feature)
      
		 layer.on({
			click: function populate() {
				retrieveGraph(graphSatDate,sub,"")
			}//populate
		});  //onLayer
		popupOptions = {maxWidth: 200};
		html = writeHtml(feature)
		layer.bindPopup(html,popupOptions);	
	}
		
		function onEachCWCFeature(feature, layer) {
			var date = feature.properties.valid_date
			var dangerLevel = feature.properties.danger_level
			var currentLevel = feature.properties.level
		 layer.on({
			 click: function (e) {
				getID(feature)
				createPlot(graphDate,feature)
			}
		});  //onLayer
		
		  //  layer.bindPopup(feature.properties.name + '<br>' + graph_container); 
		popupOptions = {closeButton:true, closeOnClick:true};
		//	var popup = L.popup({keepInView:true})	
			html = makeObsPopupContent ( feature ) 
			var popup = new L.Popup({
				autoPan: false,
                keepInView: true,
                closeButton: true,
				closeOnClick: true,
				className : 'custom',
                offset: new L.point(0, -5)
            }).setContent(html);
			
			layer.bindPopup(popup)
				
		}//on eachFeature CWC
	
		
	function getColor(d) {
			return d > 100.0 ? '#800000' :
				   d > 50.0 ? '#FF0000' :
				   
				   d > 20.0 ? '#FFA500' :
				   d > 10.0 ? '#FFFF00' :
			       d > 6.0  ? '#228B22' :
			       d > 4.0  ? '#7CFC00' :
			       d > 2.0   ? '#4D8BE8' :
			       d > 1.0  ? '#75AED1' :
				   d > 0.5  ?  '#a9d8f4' :
			       d > 0.01   ? '#c8e2f2' :
			                  '#e6e6e6';
		}
		
	function style(feature) {
			return {
				weight: 0.5,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.5,
				fillColor: getColor(feature.properties.rainfall)
			};
		}
		
		function stylez2(feature) {

			return {
				weight: 1.0,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.5,
				fillColor: getColor(feature.properties.rainfall)
			};
		}

		
		
		} 
		function obsStyelFunc1(prop) {
			var date = prop.valid_date
			var dangerLevel = prop.danger_level
			var currentLevel = prop.level
			//alert(dangerLevel)
			
			if (typeof dangerLevel == 'undefined' || dangerLevel == null ){  //normal
				return {	
					fillColor: '#0070E1',
					radius: 6,
					color: '#0070E1',
					weight: 1,
					opacity: 1,
					fillOpacity: 1.0
				}
			} else if ( currentLevel > dangerLevel ) {  //danger
				return {
					fillColor: '#f45642',
					radius: 6,
					color: "#f45642",
					weight: 1,
					opacity: 1,
					fillOpacity: 1.0					
				}
			} else if ( (dangerLevel-currentLevel)/dangerLevel < 0.1 ) {
				return { //warning
					fillColor: '#ff7f00',
					radius: 6,
					color: '#ff7f00',
					weight: 1,
					opacity: 1,
					fillOpacity: 1.0					
				}
       
			
			} else {
				return {  //no data
					fillColor: '#0070E1',
					radius: 6,
					color: '#0070E1',
					weight: 1,
					opacity: 1,
					fillOpacity: 1.0		
				};
			}
	
	}  //obsStyle
		
	// Create popup contents functions
    function makeObsPopupContent ( feature ) {
        var html = '<b>' + feature.properties.site_name + ' ' + feature.properties.site_code_ + '</b><BR>';
        html += '<table>';
        if( typeof( feature.properties.valid_date ) != 'undefined' && typeof( feature.properties.level ) != 'undefined') {
            html += '<tr><td align="left">Valid Date: </td><td align="left"> ' + feature.properties.valid_date + '</td></tr>';
            html += '<tr><td align="left">Stage: </td><td align="left"> ' + feature.properties.level + 'm</td></tr>';
            if( typeof( feature.properties.danger_level ) != 'undefined' && feature.properties.danger_level != null ) {
                html += '<tr><td align="left">Danger Level: </td><td align="left"> ' + feature.properties.danger_level + 'm</td></tr>';
            } else {
                html += '<tr><td align="left">Danger Level: </td><td align="left"> UNKNOWN</td></tr>';
            }
        } else {
            html += '<tr><td align="center">No observations available<BR> at selected time</td></tr>';
        }
        html += '</table></font>';
        return html;
    }; 
    
    	function writeHtml(feature) {
			rain = feature.properties.rainfall
			//roundRain = rain
			rainmin = feature.properties.rfmin
			//roundRainmin = rainmin
			rainmax = feature.properties.rfmax
			if (rain == null) {
				roundRainmax = rainmax
				roundRain = rain
				roundRainmin = rainmin
			} else {
				roundRainmax = rainmax.toFixed(1)
				roundRain = rain.toFixed(1)
				roundRainmin = rainmin.toFixed(1)
			}
			//roundRainmax = rainmax
			startTime = feature.properties.startTime
			endTime = feature.properties.endTime
			subName = feature.properties.Subbasin
			
			html = "Forecast upper bound is " + roundRainmax + " mm/day <br> Forecast lower bound is " + roundRainmin + " mm/day <br>Mean forecast is " + roundRain + " mm/day <br>"
			return html
		}
	
	function addText(activeLayer){
		//alert(activeLayer)
		var res = activeLayer.split("_")
		if (res.length == 7) {
			var init = res[6]  //init time
			var datep = res[3] //forecast time
			ave = res[5]  //ave period
		} else {
			var init = res[5] //init time
			var datep = res[2]  //forecast time
			ave = res[4]	 //ave period
		}
		
		
		var year = datep.substr(0,4)
		var month  = datep.substr(4,2)
		var day = datep.substr(6,2)
		
		var inityear = init.substr(0,4)
		var initmonth  = init.substr(4,2)
		var initday = init.substr(6,2)
		
		var beginDate = year +"/"+month +"/"+day
		var initDate = inityear +"/"+initmonth +"/"+initday
		
		//alert(beginDate)
		var endmonth = month
		var endday = 30
		var endyear = year
		var aveTimeFrame = "24 hour"
		
			//alert(ave)
			//alert (month)
			if (ave == 'acc24h') {
				addin = 1
				endday = parseInt(day) + addin
				aveTimeFrame = "24 hour"
			}else if (ave == 'acc5d')  {
				addin = 5
				endday = parseInt(day) + addin
				aveTimeFrame = "5 day"
			//this is for 3 monthly
			}else if (ave == 'acc3mo')  {
				//alert("in 3 month")
				addin = 2
				aveTimeFrame = "3 month"
				endmonth = parseInt(month) + addin
				//alert(endmonth)
				if (endmonth > 12 ) {
					endmonth = parseInt(endmonth) - 12
					endyear = parseInt(endyear) + 1
				}
			
				endday = getEndDay(endmonth,day)
			} else if (ave == 'acc1mo')  {
				//this if for monthly
				aveTimeFrame = "1 month"
				endday = getEndDay(month,day)
				
			}
			if (endday > 31 ) {
				endmonth = parseInt(month) + 1
				endday = endday - 31
			}
		
		var endDate = endyear +"/"+endmonth+"/"+endday
		document.getElementById("p1").innerHTML = "Click on a watershed above to view time series. <br>The map above displays a forecast average from "+ beginDate +" 00Z to " + endDate +" 00Z. This forecast was initialized on " + initDate + " 00Z and is a " + aveTimeFrame  +" average"

		}
		
	function changeiFrame(loc) {
		document.getElementById('frame').src = loc;
	}
	
function getDate(model,ave) {
 var recentDate = ''
 var mod = ''

		
	}
	
	
	
		