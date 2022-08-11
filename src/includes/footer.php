<!-- jquery + bootstrap-->
<script type="application/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="application/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

<!-- Arnaud's -->
<script src="/javascript/ext_lib/jquery-ui/plugins/jqplot/1.0.0.1095/jquery.jqplot.js"></script>
<script src="/javascript/ext_lib/jquery-ui/plugins/jqplot/1.0.0.1095/jqplot.canvasAxisTickRenderer.min.js"></script>
  <script src="/javascript/ext_lib/jquery-ui/plugins/jqplot/1.0.0.1095/jqplot.dateAxisRenderer.js"></script>
  <script src="/javascript/ext_lib/jquery-ui/plugins/jqplot/1.0.0.1095/jqplot.canvasAxisLabelRenderer.js"></script>
  <script src="/javascript/ext_lib/jquery-ui/plugins/jqplot/1.0.0.1095/jqplot.canvasTextRenderer.js"></script>
  <script src="/javascript/ext_lib/jquery-ui/plugins/jqplot/1.0.0.1095/jqplot.cursor.min.js"></script>
  <script src="/javascript/ext_lib/jquery-ui/plugins/jqplot/1.0.0.1095/jqplot.highlighter.min.js"></script>
  <script src="/javascript/ext_lib/jquery-ui/plugins/jqplot/1.0.0.1095/jqplot.dragable.min.js"></script>
  <script src="/javascript/ext_lib/jquery-ui/plugins/jqplot/1.0.0.1095/jqplot.trendline.min.js"></script>
  <script src="/javascript/ext_lib/jquery-ui/plugins/jqplot/1.0.0.1095/jqplot.barRenderer.min.js"></script>
  
  <link rel="stylesheet" href="/javascript/ext_lib/jquery-ui/plugins/jqplot/1.0.0.1095/jquery.jqplot.css"/>
  <script src="/javascript/ext_lib/jquery-ui/plugins/collapsible/1.2/jquery.collapsible.min.js"></script>
 <!-- <script src="javascript/ext_lib/jquery-ui/plugins/jqrangeslider/5.7.1/jQAllRangeSliders-min.js"></script> -->
  <link rel="stylesheet" href="/javascript/ext_lib/jquery-ui/plugins/jqrangeslider/5.7.1/css/iThing-min.css"/>
  <script src="/javascript/ext_lib/jquery-ui/plugins/datetimepicker/2.3.7/jquery.datetimepicker.js"></script>
  
  <script src="/ral/timeSeries/jqplot/namespace.js"></script>
 <script src="/ral/timeSeries/TimeSeriesPlot.js"></script>
 <script src="/ral/timeSeries/TimeSeriesDataSource.js"></script>
 
 
 <script src="/ral/timeSeries/jqplot/JQPlotDataSource.js"></script>
 <script src="/ral/timeSeries/jqplot/JQPlotMultiDataSource.js"></script>
 <script src="/ral/timeSeries/jqplot/JQPlotTimeSeries.js"></script>
 <script src="/ral/timeSeries/FcstTimeSeriesEnsembleDataSource.js"></script>
 
<link rel="stylesheet" href="/ral/timeSeries/TimeSeriesPlot.css"/>

 
 <!--
SCRIPTS
    -->
<script src="//cdn.leafletjs.com/leaflet-0.7.5/leaflet.js"></script>
<script src="//d3js.org/topojson.v1.min.js"></script>
<script src='//api.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.2.0/leaflet-omnivore.min.js'></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0-rc.1/leaflet-src.js"></script>
<script class="include" type="text/javascript" src="/javascript/app/mapDisplay.js"></script>
<script class="include" type="text/javascript" src="/javascript/app/graphing.js"></script>
<script class="include" type="text/javascript" src="/javascript/app/menuPopulate.js"></script>
<script src='//api.mapbox.com/mapbox.js/v2.3.0/mapbox.js'></script>
<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-pip/v0.0.2/leaflet-pip.js'></script>

<!--
  **************
LAYOUT FOOTER
**************
-->



<div id="site-footer" class="container">
	<div class="row">
		<div class="col-sm-12">
		<!-- footer content here if needed -->
        <img class="img-responsive" src="<?php echo $path2root;?>src/images/ncar_ucar-logo.png" />
		<img class="img-responsive" src="<?php echo $path2root;?>src/images/WBlogo_new2.png" />
        <img class="img-responsive" src="<?php echo $path2root;?>src/images/fmis_logo1.gif" />
        <img class="img-responsive" src="<?php echo $path2root;?>src/images/fmis_logo2.gif" />
<!-- nav script -->
<script type="application/javascript" src="<?php echo $path2root;?>src/scripts/nav_script.php"></script>
<!-- OrgNavFooter Script -->
<script>

// CUSTOM VARIABLES
var contactLink = "mailto:info@rap.ucar.edu";     // enter your Contact/Feedback link or mailto: link
var hideOrgNav = true;        // hide the entire OrgNav from view
var hideFooter = false;          // hide the entire OrgFooter from view
var hideNSF = false;               // hide the NSF disclaimer

// DO NOT EDIT BELOW THIS POINT
var jsHost = (("https:" == document.location.protocol) ? "https://" : "http://");
if(typeof jQuery === "undefined"){
  document.write("<scr"+"ipt src='"+jsHost+"ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js' type='text/javascript'><" + "/scr"+"ipt>");
}
document.write("<scr"+"ipt src='"+jsHost+"www2.ucar.edu/js/orgnav' type='text/javascript'><" + "/scr"+"ipt>");
</script>
<noscript><iframe frameborder="0" width="100%" src="//www2.ucar.edu/sites/default/modules/custom/ucar_comm_site/includes/noscript.php"></iframe></noscript>
<!-- END OrgNavFooter Script -->
        
        </div>
	</div>
</div>
<!--  END FOOTER  -->
</div> <!-- end div wrap container -->
