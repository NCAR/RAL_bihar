<!--L.mapbox.accessToken = 'pk.eyJ1IjoiYm9laG5lcnQiLCJhIjoibjhHQnZ0byJ9.G56Xo1QotN86WVQz5Pp2NQ';
L.mapbox.map('map-two', 'mapbox.streets').setView([-14.7,28.5], 8);-->
<?php 
    $path2root = "../";
    $title = "Bihar Rainfall | World Bank – Bihar State Flood Management Information System"; 
    $id = "Rain";
   include ($path2root . "src/includes/begin.php");
   ?>
<div id="main" class="container-fluid">   
<div class="row">

  <!--
  **************
  LAYOUT FORM UI
    column 1
  **************
  class="col-xs-12 col-sm-4 col-md-3"-->

 
 
<div id="selectors"  class="col-xs-12 col-sm-12 col-md-3 col-lg-3"> 
	<p>Select from the options below to display precipitation forecasts or observed products.</p>
    
	<legend>1. Select observed or forecast data</legend>
		<div class="radio">
		<label><input   type="radio" name="viewData" id='forecast' onClick='ClearFields(this.value)' value="forecast" checked> Forecasts</label>
		</div>
		<div class="radio">
		<label><input   type="radio"  name="viewData" id='observed' onClick='ClearFields(this.value)' value="obs"> Recent Observations</label>
		</div>
    
	<legend>2. Select an Averaging Period</legend>
		<SELECT ID="aveTime" CLASS="ar5select form-control" onChange="showDates(this.value)">
			<option value='0'> Please Select an Averaging Period</option>
			<option value='year24hour'> 24 Hour </option>
		    <option value='year5day'> 5 Day</option>
            <option value='monthly'> 1 Month </option>
		    <option value='monthly3'> 3 Month</option>
			
		
		</SELECT>

	<legend>3. Select the rainfall date to display</legend>
			<SELECT ID="dateselect" CLASS="ar5select form-control" onChange="loadModelBox(this.value)">
			</SELECT> 
  
	<legend>4. Select a model or observed product to display</legend>
		<!--
		<SELECT ID="Model" CLASS="ar5select selectpicker" onChange="setAccumulation(this.value)">
		-->	
	<SELECT ID="Model" CLASS="ar5select form-control" onChange="doSomeThing(this.value)">
		</SELECT>
    
	<legend>
	<input type="checkbox" name="raingauge" ID="raingauge" value="raingauge" onChange="addLayer(this, map)">   Turn on rain gauge locations<br></legend>
		<br /><br />
</div> 
<div class="clearfix visible-xs-block"></div>
  <!-- END LAYOUT FORM UI -->
  
  <!--
  **************
  LAYOUT MAP
  **************
  class="col-xs-12 col-sm-8 col-md-6 "-->
  
<div id="map-area"  class="col-xs-12 col-sm-12 col-md-4 col-lg-5">  <!-- LAYOUT MAP -->
	<nav id='menu-ui' class='menu-ui'>
    </nav>
	<div id="map" class="map"></div>
	<div class="clearfix visible-xs-block"></div>
	<p CLASS="inputHeading" id="p1"> </p>
</div> 
  <!-- clear the XS cols if their content doesn't match in height -->
  <div class="clearfix visible-xs-block"></div>
  <!--  END LAYOUT MAP  -->


 
 <!--
  **************
  LAYOUT GRAPH DATA
  **************
  -->
  
 <div id="data" class="col-xs-12 col-sm-12 col-md-5 col-lg-4">

	<a href="" target="_blank" class="download btn btn-success" id ="download" > Download data from graph</a>
	<hidden value='' id='myInput' />
	<img class="graph1 img-fluid"  src='' >
	<!--
	<div class="inputHeading" id="graphText"><p class="alert alert-success"> Click on a watershed<br>and your graph will appear.</p></div>
	-->
  <!-- clear the XS cols if their content doesn't match in height -->
	<div class="clearfix visible-xs-block"></div>
    <div id="plot3" ></div>
    <div id="plot3Text" class="plotText alert alert-success"><p>Click a watershed or gage on the map<br>to view its timeseries.</p></div>
  <!--  <div id="plot3Div" style="display:none;width:400px;height:386px;margin:7px"></div> -->  
    <div id="plot3Div" style="display:none;width:400px;height:386px;margin:7px"></div>
</div>
   <!-- END LAYOUT GRAPH DATA -->

</div> <!--	END ROW -->
</div>
<!-- end container-->
<?php include ($path2root . "src/includes/footer.php");?>

<script>

		L.CRS.EPSG3395
	   	 info = L.control();
	
	var map = L.map('map').setView([25.7,85.75], 6);
	var layers = document.getElementById('menu-ui');
	// https: also suppported.
//	var Thunderforest_OpenCycleMap = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
//	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//	maxZoom: 16
//	}).addTo(map);
 //   L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
//	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
//	maxZoom: 16
//}).addTo(map);

  //  L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
//	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',

	maxZoom: 16
}).addTo(map);


getActiveLayer(0)
getSatDate('acc24h','merge')
		var assetLayerGroup = new L.LayerGroup();	
		//var watersheds 
		//var watersheds2
		var activeLayer = ""
		var modelLayer
		//tells drawForecast to draw rain gages not CWC gages
	    rainfall = 2
		
		map.on('zoomend', function(e) {
	
		var res = activeLayer.split("_")
    var rainfall = document.getElementById("raingauge").checked
			if ( map.getZoom() >= 7 ){ 
				if (res[1] == "z1") {
					
					activeLayer = activeLayer.replace("z1","z2")
					map.removeLayer(watersheds)
					
					drawForecast(activeLayer,assetLayerGroup, map,rainfall)
				} 
			} else {
			if (res[1] == "z2") {
				
					activeLayer = activeLayer.replace("z2","z1")	
					map.removeLayer(watersheds)	
					drawForecast(activeLayer,assetLayerGroup, map,rainfall)	
				}	
		}

		}
);
		drawLegend()
	
</script>
<?php include ($path2root . "src/includes/end.php");?>  