<!--L.mapbox.accessToken = 'pk.eyJ1IjoiYm9laG5lcnQiLCJhIjoibjhHQnZ0byJ9.G56Xo1QotN86WVQz5Pp2NQ';
L.mapbox.map('map-two', 'mapbox.streets').setView([-14.7,28.5], 8);-->
<?php 
    $path2root = "../";
    $title = "Bihar Rainfall | World Bank – Bihar State Flood Management Information System"; 
    $id = "Home";
   include ($path2root . "src/includes/begin.php");
  
   ?>
  
  
  

<div id="main" class="container-fluid">   
<div class="row">
  <!--
  **************
  LAYOUT MAP
  **************
  -->

<div id="map-area" class="col-xs-12 col-md-6 col-lg-7">  <!-- LAYOUT MAP -->
	<p class="alert alert-info">Click on a watershed or a gage to view the forecast graph.</p>
    <nav id='menu-ui' class='menu-ui'>
    </nav>
	<div id="map" class="map"></div>
	<p CLASS="inputHeading" id="p1"> </p>
 <p CLASS="inputHeading" id="graphText">hi </p>
</div> 
  <!--  END LAYOUT MAP  -->

 
  <!--
  **************
  LAYOUT GRAPH DATA
  **************
  -->
  <div id="data" class="col-xs-12 col-sm-12 col-md-6 col-lg-5"> 
	<a href="" target="_blank" class="download btn btn-success" id ="download" > Download data from graph</a>
 
	<hidden value='' id='myInput' />
	<img class="graph1 img-fluid"  src='' >
  	
 
  <!-- clear the XS cols if their content doesnt match in height -->
  
	<div class="clearfix visible-xs-block"></div>
    <div id="plot3" ></div>
    <div id="plot3Text" class="plotText alert alert-success"><p>Click a watershed or gage on the map<br>to view its timeseries.</p></div>
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
	
	var map = L.map('map').setView([27.0,87.0], 8);
	var layers = document.getElementById('menu-ui');

var base =  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Honnh Kong), and the GIS User Community',

	maxZoom: 16
}).addTo(map);




	//	map.on('click', function(e) {
	//		var loc = e.latlng
	//		var lng = event.latlng.lng;
	//		var lat = event.latlng.lat;
	//		//handleClick(lng,lat,loc)
	//	})
		var gLayer = new L.LayerGroup();
		getActiveLayer(1)
		cwc = 10
		//drawForecast(layer,gLayer, map,cwc)
		drawLegend()
	
</script>

<?php include ($path2root . "src/includes/end.php");?>  