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
	var sub;
	var timeDownload
	var zoomRes;
  	var resModel;
	var domainDir = 'bihar'
	var d = 'gbm'
	var dataLoc = "../data/"
	var layerCWCstage = L.geoJson()
	var cwcPlotUrl = "../data/timeSeriesPlots";
	var cwcPlotUrlQC = "../data/TimeSeriesPlotsQC";
	var noDataAvailable = "noDataAvailable.png";
	
	
	subNameVar = 'Subbasin'
	subVar = 'GridID'
	
	
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
			                  '#e9f1f6 ';
			}
			
			function getCicleColor(d) {
				if (d == 'Danger') {
					return '#800000'
				} else if (d == 'Warning'){
					return '#f2930e' 
				} else if  (d == 'Normal') {
					return '#0825e0' 
				}else  {
					return '#a8a9af' 
			}
			}
		
		//Add Legend
		legend = L.control({position: 'bottomright'});		
		legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0.01,0.5,1.0,2.0,4.0,6.0,10.0,20.0,50.0,100.0],
			labels = [],
			grades1 = ['Danger','Warning','Normal','NoData'],
			labels1 = [],
			colorfrom,
			from, to;
			
			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];
				
				labels.push(
				'<i style="background:' + getColor(from + 0.01) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
			}
			for (var i = 0; i < grades1.length; i++) {
				cat = grades1[i];
				labels1.push('<i class="circle" style="background:' + getCicleColor(cat) + '"></i> +
				cat'+')
        // (cat ? cat + '<br>' : '+'););
			}
			
			
			html = '<B>Precipitation</B><br>(mm/day)<br>' + labels.join('<br>') 
			html=+ '<br> ' + labels1.join('<br>')
        div.innerHTML =(html);
        return div;
        };

		legend.addTo(map);
		}
		
	function obsStyelFunc1(prop) {
			var date = prop.valid_date
			var dangerLevel = prop.danger_level
			var currentLevel = prop.level
			//alert(dangerLevel)
			
			 if (typeof currentLevel == 'undefined' || currentLevel == null || typeof date == 'undefined' || date == null ) {
				return {  //stroke	
					fillColor: '#a8a9af',
					radius: 8,
					color: "#a8a9af",
					weight: 1,
					opacity: 1,
					fillOpacity: 1.0					
				};
			} else if ( currentLevel > dangerLevel ) {  //alert
				return {
					fillColor: '#f45642',
					radius: 8,
					color: "#f45642",
					weight: 1,
					opacity: 1,
					fillOpacity: 1.0					
				}
			} else if ( (dangerLevel-currentLevel)/dangerLevel < 0.1 ) {
				return { //warning
					fillColor: '#f2930e',
					radius: 8,
					color: "#f2930e",
					weight: 1,
					opacity: 1,
					fillOpacity: 1.0					
				}
       
			} else {  //normal
				return {	
					fillColor: '#0825e0',
					radius: 8,
					color: "#0825e0",
					weight: 1,
					opacity: 1,
					fillOpacity: 1.0
				}
			}
	
	}  //obsStyle
	
	function getID(feature) {
		code = feature.properties.site_code_
		
		url = "../data/bihar/data/link.xml"
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
					
					drawBasin(basin)
				}						
			});
				// note: jQuery's filter params are opposite of javascript's native implementation :(

		}, 'xml'); // specify what format the request will return - XML
	 $('#date').change(function() { // bind a trigger to when the
										  // courses select changes
			} );
		}});
		

	}
	/* 7: create the time sequence model */
	function createPlot(feature) {
		var now        = new Date();
		now.setHours( 0, 0, 0, 0 );
		var minTime    = new Date( now.getTime() - 86400000*61 );
		var maxTime    = new Date( now.getTime() + 86400000 );
		var timeModel = new ral.time.RangeIntervalTimeSequence( {
		  minTime         : minTime,
		  maxTime         : maxTime,
		  currentFrameTime: now,
		  intervalMs      : 86400000,
		  roundMs         : 86400000,
		  frameDelayMs    : 500,
		  dwell           : 2000
			}
		);


		var timeLabel = new ral.time.TimeLabel( { target: "timeLabel", dateFormat: "%b %d, %Y", useUTCTime: false } );
		timeModel.addListener( timeLabel );
		
		var timeSelector = new ral.time.D3JSTimeSelector(
		{
		  target          : "timeSelector",
		  timeSequence    : timeModel,
		  markerHeight    : 20,
		  markerWidth     : 20,
		  padding         : 10,
		  tickMarks       : d3.time.day,
		  dateFormat      : "%b %d",
		  useUtc          : false,
		  tickFormat      : function(d) {
			day = d.getDate();
			if( day == 1 ) {
			  // First day of month
			  return labelMonthFormat( d ) + " " + labelDayFormat( d );
			} else if( day == 5 || day == 10 || day == 15 || day == 20 || day == 25  ) {
			  // every 10 days
			  return labelDayFormat( d );
			} else {
			  // don't label anything else
			  return ""
			}
		  },
		  userConfigurable: "fixed,realtime"
		}
	  );

		$('#plot3Text').get(0).style.display = "none";
		$('#plot3Div').get(0).style.display = "block";

		//alert("defining plot")
		var plot = new ral.timeSeries.jqplot.JQPlotTimeSeries(
			{
			  target: 'plot3Div',
			  title: 'Forecasted Stage at ' + feature.properties.site_name,
			  dateFormat: "%b %d",
			  useUtc: false,
			  tickInterval: 86400000,
			  // ticks: 14,
			  start: new Date(),
			  end: new Date( new Date().getMilliseconds() + 86400000 ),
			  // yRange: [0, null ],
			  blankMessage: "Loading data...",
			  legendPosition: "outsideGrid"
			  // dataDownloadLinkTarget: "plot3Download"
			} );

		var date = new Date();
		date.setDate(date.getDate() )
		var tsUrl = encodeURI( "../data/Forecast_tfq_CSV/" + feature.properties.site_code_
		 + "/Stfq_" + feature.properties.site_code_ + "_in" + date.getFullYear()
		 + ( '0' + (date.getMonth()+1) ).slice(-2) + ( '0' + date.getDate() ).slice(-2) + "00Z.csv" );
		$('#plot3Download' ).attr("href", tsUrl );
		//alert(tsUrl)
		var dataSource = new ral.indiaWBG.timeSeries.FcstTimeSeriesEnsembleDataSource(
			{
			  dataUrl: tsUrl,
			  name: name,
			  label: 'Flood Forecast',
			  color: 'blue',
			  yaxisLabel: 'Stage (m)',
			  min: 0.0,
			  badValue: -9999.00,
			  convertToLocaltime: false,
			  dataStartLineNumber: 1,
			  plot: plot
			  // dataFieldRange: [0,n]
			}
		);

		plot.addDataSource( dataSource );
		plot.sequenceChanged(null); // Triggers re-retrieval of data sources
		// plot.redraw();
		};  //update
	
	function drawBasin(basin) {
		
		function onestyle(feature) {
			return {
				fillOpacity: 0,
				weight: 5,
				opacity: 1,
				color: 'black',  //Outline color	
			};
		}			
		
		
		basinData = "../data/bihar/data/z1.geojson"
		$.ajax({
			type: "POST",
			url: basinData,
			dataType: 'json',
			success: function (response) {
				//geojsonLayer = L.geoJson(response, {style:onestyle,  filter:filterFunc, }).addTo(map);
				//map.fitBounds(geojsonLayer.getBounds());
				geojsonLayer = L.geoJson(response, {style:onestyle,  filter:filterFunc, });
				
				return geojsonLayer
				
			}
		});
		function filterFunc(feature,layer) {
			
			if (feature.properties.Subbasin === basin) return true

		}
		
	}

//*******************************************
	
	function addDataToMap(data, map) {
		
	//***************
	
    layerCWCstage =  L.geoJson(data, { onEachFeature: onEachFeature,
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, obsStyelFunc1(feature.properties));
			}
		})
		layerCWCstage.addTo(map);	

//*******************************************
		
		function onEachFeature(feature, layer) {
			var date = feature.properties.valid_date
			var dangerLevel = feature.properties.danger_level
			var currentLevel = feature.properties.level
		 layer.on({
			 click: function populate() {
				getID(feature)
				createPlot(feature)
			}
		});  //onLayer
		
		  //  layer.bindPopup(feature.properties.name + '<br>' + graph_container); 
				popupOptions = {maxWidth: 400};
				
			html = makeObsPopupContent ( feature ) 
			layer.bindPopup( html,popupOptions);
				
		}//on eachFeature
		//layerCWCstage = L.geoJson(data, { style:obsStyleFunc1	} );
		//layerCWCstage.addTo(map);
		
	}
			
	function retrieveGraph(sub) {
		threedays = threeDate()
		aggregation = 'acc24h'
		document.getElementById("graphText").innerHTML = "Precipitation (mm/day) from most recent available TIGGE forecast.  The red line represents the median of all forecast ensemble members.  The upper black line shows the 90th percentile ensemble member, and the lower black line shows the 10th percentile ensemble member.  Water levels above or below these bounds each have a 10% probability of occurrence."
				
				
		var timeGraph = "gbm_z2_ecmf_catchment"+ sub +"_"+ threedays +"_acc24h.png"
		timeDownload = "gbm_z2_ecmf_catchment"+ sub +"_"+ threedays +"_acc24h.txt"
		layerName2 = dataLoc+domainDir+'/graph/'+timeGraph
		layerDownload = dataLoc+domainDir+'/graph/'+timeDownload
				
		graph1 = "#graph1"
		$(".graph1").attr("src",layerName2);
		document.getElementById("download").style.visibility="visible"; 
		$(".download").attr("href", layerDownload);
			
			
		
		
	}
		
	function drawForecast(map) {
		var gLayer = new L.LayerGroup();	
		//get todays date
		today = todayDate()
		//get three days ago for layer name
		threedays = threeDate()
		
		//set active layer
		activeLayer = "../data/bihar/gbm_z2_ecmf_"+today+"_d3_acc24h_"+threedays+".geojson"
		layerName = "gbm_z2_ecmf_"+today+"_d3_acc24h_"+threedays+".geojson"
		//add z1 watersheds outlines
		z1Layer = activeLayer.replace("z2","z1")
			
		var res = layerName.split("_")
		initTime = res[6].split(".")
		iTime = initTime[0]
		graphName = res[0] +"_" + res[1] +"_"+ res[2] +"_"+  iTime +"_" + res[5]
		
		//add the watershed activeLayer to map	
		watersheds = L.geoJson(null, {style: watershedstyle, onEachFeature: onEachFeature,success: addText(activeLayer)});
		modelLayer = omnivore.topojson( activeLayer, null, watersheds)
		gLayer.addLayer(modelLayer)
		
		//add Z1 the watershed activeLayer to map	
		watersheds1 = L.geoJson(null, {style: onestyle, onEachFeature: onEachFeature});
		modelLayer1 = omnivore.topojson( z1Layer, null, watersheds1)
		gLayer.addLayer(modelLayer1)
		gLayer.addTo(map)
		
			
		//add CWC points
		var cwcStageUrl = "getCWCObs.php";
		timeDate = todayDischarge()
		url = "http://bihar.rap.ucar.edu/flow/getCWCObs.php?time=" + timeDate
		$.getJSON(url, function(data) { addDataToMap(data, map); });
		
		
				
		function onEachFeature(feature, layer) {
			initialTime = feature.properties.DATETIME
			html = ""
		 layer.on({
			click: function populate() {
				retrieveGraph(sub)
			}//populate
		});  //onLayer
		//  layer.bindPopup(feature.properties.name + '<br>' + graph_container); 
		popupOptions = {maxWidth: 200};
		var sub = getCatchment(feature)
		
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
			
				function watershedstyle(feature) {
					return {
						weight: 0.5,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7,
						fillColor: getColor(feature.properties.rainfall)
					};
				}
				function onestyle(feature) {
					return {
						fillOpacity: 0,
						weight: 2,
						opacity: 1,
						color: 'black',  //Outline color
						
					};

				}			
			
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
									  '#e9f1f6 ';
				}
			
			
	}  //drawForecast
	

		
		
	// Create popup contents functions
    function makeObsPopupContent ( feature ) {
        var html = '<b>' + feature.properties.site_name + ' ' + feature.properties.site_code_ + '</b><BR>';
        html += '<hr><table>';
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
        html += '</table>';
        return html;
    }; 
		
	
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
	
	
	function getCatchment(feature){
		var sub = feature.properties.GridID
		return sub
	}

		