<?php
require('config.php');
require('config2.php');

if ($_GET['token'] != $token) {
	die('Access denied');
}

if(!isset($_GET['file_to_download'])) {
	die('Nothing to save');
}

$file_to_download = $_GET['file_to_download'];

if ($config['non_utf_system'] === true) {
	$file_to_download = iconv('UTF-8', $config['system_encoding'], $file_to_download);
	setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
}

$full_file_to_download = $config['home_dir'] . trim($file_to_download, "/");

if (file_exists($full_file_to_download)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="'.basename($full_file_to_download).'"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($full_file_to_download));
    readfile($full_file_to_download);
    exit;
} else {
	echo "File does not exist";
}