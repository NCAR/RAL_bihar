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
 * Tests making a request from the IndiaWBG MySQL DB with spatial extension
 */
# include mysql login info
include('login.php');

# Include required geoPHP library and define wkb_to_json function
include_once('geoPHP/geoPHP.inc');
function wkb_to_json($wkb) {
    $geom = geoPHP::load($wkb,'wkb');
    return $geom->out('json');
}

# Get the site we want to request
if( isset($_GET['site']) ) {
    $site = $_GET['site'];
} else {
    $site = '009-MGD4PTN';
}

# Get the MySQL connection parameters
#if (!$settings = parse_ini_file($ini_file, TRUE)) throw new exception('Unable to parse: ' . $ini_file );
#$settings = $settings['client'];

# Connect to MySQL database
$conn = new PDO('mysql:host=' . $settings['host'] . ';dbname=' . $settings['database'], $settings['user'], $settings['password']);

# Build SQL SELECT statement and return the geometry as a WKB element.
$sql = 'SELECT site_code_, site_name, AsWKB(SHAPE) AS wkb FROM stations';

# Try query or error
$rs = $conn->query($sql);
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}

# Read the return data
$row = $rs->fetch(PDO::FETCH_ASSOC);

header('Content-type: application/json');
header('Access-Control-Allow-Origin: indiawbg.rap.ucar.edu');
echo 'Result:\n';
var_dump( $row );
echo wkb_to_json( $row['wkb'] );
$conn = NULL;
?>

