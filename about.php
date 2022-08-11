<!--L.mapbox.accessToken = 'pk.eyJ1IjoiYm9laG5lcnQiLCJhIjoibjhHQnZ0byJ9.G56Xo1QotN86WVQz5Pp2NQ';
L.mapbox.map('map-two', 'mapbox.streets').setView([-14.7,28.5], 8);-->
<?php 
    $path2root = "";
	$title = "World Bank - Bihar State Flood Management Information System"; 
    $id = "About";
   include ($path2root ."src/includes/begin.php");
?>
<div id="main" class="container-fluid">
  <div class="row">
    <div id="Home" class="col-lg-12"> 
      <h1>Bihar State Flood Management Information System</h1>
      <h2>Overview</h2>
        
        <p>The Flood Management Information System (FMIS) Centre in Water Resources Department (WRD) of Government of Bihar (GoB) aims to generate and disseminate timely and customized information to move from disaster response to improved disaster preparedness and to effectively support flood control and management in the flood-prone areas of the State. Conceptual flood models are being developed in Bagmati-Adhwara (B-A) basin and Kosi basin to enhance the traditional system of stage-level warnings based on gauge-to-gauge correlation in order to transform it to flood forecasting services for effective flood management strategy and planning. Part of the requirements for these conceptual flood models to provide future forecasts of river flow are inputs of both point and basin-wide rainfall estimates and forecasts. Satellite-based ensemble rainfall estimates from multiple satellite missions and sensors may provide a credible alternative in regions of poor rainfall network and to spatially better represent the rainfall patterns in the basin. Improved rainfall forecast capacity can also be provided with short-to-medium range ensemble weather forecasts using deterministic and probabilistic approach and downscaled and re-gridded for the basins. The goal is to build capability and capacity at the FMISC center in Patna so that these rainfall estimates and short (1-3 days) and medium (7-10 days) range weather ensembles forecast products can be integrated in the forecast models in B-A and Kosi basins in Bihar State.
        </p>
        <p>In this context, the Government of Bihar and the FMIS has requested technical assistance and capacity building support from the World Bank to enhance its rainfall and river forecasting with 1- to 16-day forecasts. This website (and associated links) is part of a project, <strong>Implement and Operationalize a Customized Meteorological Framework in Bagmati-Adhwara and Kosi Basins in Bihar State</strong> (Contract ID: 7183269), that is directed by the World Bank Group and is devoted to assisting the Government of Bihar in enhancing their rainfall and river flow forecasting systems.</p>
        
        <h2>Bihar Rainfall</h2>
        
        <p>This interactive map displays satellite-based rainfall estimates and precipitation forecasts for each watershed. Zoom in to see rainfall estimates on more detailed sub-catchments. The satellite precipitation is a merged product of NASA TRMM, NOAA CMORPH, and JAXA GSMaP precipitation and is provided immediately after the 24-hr accumulation is complete.  The forecasts are based on Canada Meteorological Centre (CMC), European Center for Medium-Range Weather Forecasts (ECMWF), US National Centers for Environmental Prediction (NCEP), and UK Met Office control run predictions.  The forecast data are provided on a 2-day delay.</p>
        
        <h2>Flow Forecasts</h2>
        
        <p>This web site provides observed and experimental forecasts of river stage and streamflow at a number of locations throughout the <strong>Bagmati-Adhwara and Kosi Basins in Bihar State</strong>. <a href="flow/" target="_blank">Click on a gauge site</a> to see the whole observed and quality-controlled record of stage readings in the web site's lower panels.</p>
        
      <p><a href="rainfall">Click here to interact with the map</a>.</p>
    </div>
    
  </div>
  <!--	END ROW --> 
</div>
<!-- end container-->
<?php include($path2root .'src/includes/footer.php');?>
<?php include($path2root .'src/includes/end.php');?>
