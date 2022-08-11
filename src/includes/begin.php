<?php require 'config.php';?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="expires" content="-1">
   <title><?php echo $title;?></title>
    <!-- Styles -->
    <link rel="stylesheet" type="text/css" href="<?php echo $path2root;?>src/styles/main.css" />
</head>
<body id="<?php echo $id;?>">
<!-- wrap all page content -->
<div id="wrap" class="container-fluid">
<?php include($path2root . "src/includes/navbar.php") ;?>
