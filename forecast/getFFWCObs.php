<?php
/**
 * // *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
 * // ** Copyright UCAR (c) 1992 - 2012
 * // ** University Corporation for Atmospheric Research(UCAR)
 * // ** National Center for Atmospheric Research(NCAR)
 * // ** Research Applications Laboratory(RAL)
 * // ** P.O.Box 3000, Boulder, Colorado, 80307-3000, USA
 * // ** 2012/9/11 16:14:3
 * // *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
 *
 * Author:  Arnaud Dumont
 * Queries the IndiaWBG database and returns the results in GeoJSON format, suitable for use in OpenLayers, Leaflet, etc.
 */
# Include required geoPHP library and define wkb_to_json function
include_once('geoPHP/geoPHP.inc');
function wkb_to_json($wkb) {
    $geom = geoPHP::load($wkb,'wkb');
    return $geom->out('json');
}
include('login.php');

# Define where to load the connection credentials
#$mysql_conf_file = '/home/dumont/.my.cnf';

# Define the list of sites we're interested in retrieving. These are the only ones that will be returned
$sites = ['HardingeBridge', 'Bahadurabad', 'BhairabBazar', 'Kanairghat'];

# Parse the MySQL connection parameters and connect to MySQL database
#if( ! $mysql_conf = parse_ini_string(preg_replace("/^#.*$/m","", file_get_contents("$mysql_conf_file")), TRUE) ) {
#    throw new exception('Unable to parse: ' . $mysql_conf_file );
#}
#$conn = new PDO('mysql:host=' . $mysql_conf['client']['host'] . ';dbname=' . $mysql_conf['client']['database'],
#                $mysql_conf['client']['user'], $mysql_conf['client']['password']);
$conn = new PDO('mysql:host=' . $settings['host'] . ';dbname=' . $settings['database'], $settings['user'], $settings['password']);

# Figure out the time range. Defaults to 24hrs before
date_default_timezone_set('UTC');
if( isset($_GET['time']) ) {
    $endTime = DateTime::createFromFormat('Y-m-d\TH:i:s.uO', $_GET['time'], new DateTimeZone("UTC"))->getTimestamp();
} else {
    $endTime = time();
}
$startTime = $endTime - 86400;

# Build SQL SELECT statement and return the geometry as a WKB element.
# This is a complicated multiple inner-join to pull out the latest db_time for each site_code/valid_date combination:
# SELECT s.site_code_, s.site_name, AsWKB(s.SHAPE) AS wkb, y.valid_date, y.level FROM ( SELECT o.site_code, o.valid_date, o.level FROM ( SELECT o.site_code, max( o.db_date ) as maxDate FROM observations o  WHERE o.valid_date > '2015-09-10 11:08' GROUP BY o.site_code ) as x inner join observations as o on o.site_code = x.site_code and o.db_date = x.maxDate ) as y inner join stations as s on s.site_code_ = y.site_code
$sql = 'SELECT s.site_code_, s.site_name, AsWKB(s.SHAPE) AS wkb, y.valid_date, y.level, y.danger_level FROM (' .
    ' SELECT o.site_code, o.valid_date, o.level, o.danger_level FROM (' .
    ' SELECT o.site_code, max( o.db_date ) as maxDate FROM observations o' .
    ' WHERE o.valid_date >= \'' . date('Y-m-d H:i', $startTime) . '\'' .
    ' AND o.valid_date <= \'' . date('Y-m-d H:i', $endTime) . '\'' .
    ' GROUP BY o.site_code' .
    ' ) as x inner join observations as o on o.site_code = x.site_code and o.db_date = x.maxDate' .
    ' ) as y inner join stations as s on s.site_code_ = y.site_code';

# If bbox variable is set, only return records that are within the bounding box
# bbox should be a string in the form of 'southwest_lng,southwest_lat,northeast_lng,northeast_lat'
# Leaflet: map.getBounds().pad(0.05).toBBoxString()
if (isset($_GET['bbox']) || isset($_POST['bbox'])) {
    $bbox = explode(',', $_GET['bbox']);
    $sql = $sql . ' AND x <= ' . $bbox[2] . ' AND x >= ' . $bbox[0] . ' AND y <= ' . $bbox[3] . ' AND y >= ' . $bbox[1];
}

# Try query or error
$rs = $conn->query($sql);
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}

# Build GeoJSON feature collection array
$geojson = array(
   'type'      => 'FeatureCollection',
   'features'  => array()
);

# Loop through rows to build feature arrays
while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {

    $properties = $row;

    # Skip any sites that aren't in our desired list
    if( ! in_array( $properties['site_code_'], $sites ) ) {
        continue;
    }

    # Remove wkb and geometry fields from properties
    unset($properties['wkb']);
    unset($properties['SHAPE']);
    $feature = array(
         'type' => 'Feature',
         'geometry' => json_decode(wkb_to_json($row['wkb'])),
         'properties' => $properties
    );

    # Add feature arrays to feature collection array
    array_push($geojson['features'], $feature);

    // Remove it from the sites array, so we know it's been processed
    if (($key = array_search($properties['site_code_'], $sites)) !== false) {
        array_splice($sites, $key, 1);
    }
}

# Now fill in geometry without an observation for the missing sites
$sql = 'SELECT site_code_, site_name, AsWKB(SHAPE) AS wkb FROM stations WHERE';
foreach( $sites as $site ) {
    $sql = $sql . ' site_code_=\'' . $site . '\' OR';
}
$sql = chop($sql," OR");

# Try query or error
$rs = $conn->query($sql);
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}

# Loop through rows to build feature arrays
while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {

    $properties = $row;

    # Remove wkb and geometry fields from properties
    unset($properties['wkb']);
    unset($properties['SHAPE']);
    $feature = array(
         'type' => 'Feature',
         'geometry' => json_decode(wkb_to_json($row['wkb'])),
         'properties' => $properties
    );

    # Add feature arrays to feature collection array
    array_push($geojson['features'], $feature);
}

header('Content-type: application/json');
header('Access-Control-Allow-Origin: indiawbg.rap.ucar.edu');
echo json_encode($geojson, JSON_NUMERIC_CHECK);
$conn = NULL;
?>

