<?php
require('config.php');
require('config2.php');

header('Content-Type: application/json');
$return_message = array();

if ($_POST['token'] != $token) {
	die('Access denied');
}

if(!isset($_POST['file'])) {
	die('Nothing to show');
}

$target_file = $_POST['file'];

if ($config['non_utf_system'] === true) {
	$target_file = iconv('UTF-8', $config['system_encoding'], $target_file);
	setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
}

$file = $config['home_dir'] . trim($target_file, "/");

if ( file_exists( $file ) ) {
	$saved_file = fopen($file, "w") or die(json_encode( array( "type" => "danger", "message" => "Unable to edit a file", ) ) );
	if ( !empty($_POST['filecontents']) ) {
		fwrite($saved_file, $_POST['filecontents']);
		fclose($saved_file);
	}
	$return_message["type"] = "success";
	$return_message["msg"] = "File was saved.";
} else {
	$return_message["type"] = "danger";
	$return_message["msg"] = "File does not exist.";
}

echo json_encode($return_message);
