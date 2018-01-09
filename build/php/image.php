<?php
require('config.php');
require('config2.php');

if ($_GET['token'] != $token) {
	die('Access denied');
}

if(!isset($_GET['image'])) {
	die('Nothing to show');
}

// open the file in a binary mode
$name = $config['home_dir'] . trim($_GET['image'], "/");
if ($config['non_utf_system'] === true) {
	$name = iconv('UTF-8', $config['system_encoding'], $name);
	setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
}
$fp = fopen($name, 'rb');

$file_extension = pathinfo($name, PATHINFO_EXTENSION);

switch( $file_extension ) {
    case "gif": 
		$ctype="image/gif"; break;
    case "png": 
		$ctype="image/png"; break;
    case "jpeg":
    case "jpg": 
		$ctype="image/jpeg"; break;
    default: $ctype="image/jpeg";
}

// send the right headers
// - adjust Content-Type as needed (read last 4 chars of file name)
// -- image/jpeg - jpg
// -- image/png - png
// -- etc.
header("Content-Type: {$ctype}");
header("Content-Length: " . filesize($name));

// dump the picture and stop the script
fpassthru($fp);
fclose($fp);
exit;

?>