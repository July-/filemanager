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
$file_code = file_get_contents($file);

$file_info = new finfo(FILEINFO_MIME);	// object oriented approach!
$mime_type = $file_info->buffer(file_get_contents($file));  

if ( strpos($mime_type, "charset=binary") ) {
	$return_message["type"] = "danger";
	$return_message["content"] = "Unable to edit this file.";
	die(json_encode($return_message));
} else {
	$return_message["type"] = "success";
	$return_message["content"] = $file_code;
}

echo json_encode($return_message);
