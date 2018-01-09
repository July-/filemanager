<?php
require('config.php');
require('config2.php');

if ($_POST['token'] != $token) {
	die('Access denied');
}

if (empty( $_FILES ) ) {
	die('No files');
}

if ($config['non_utf_system'] === true) {
	setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
}

$tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
$uploadPath = $config['home_dir'] . trim($_POST['dir_to_upload'], "/") . $_FILES[ 'file' ][ 'name' ];

if ($config['non_utf_system'] === true) {
	$uploadPath = iconv('UTF-8', $config['system_encoding'], $uploadPath);
}

move_uploaded_file( $tempPath, $uploadPath );

$answer = 'File(s) upload completed';
$json = json_encode( $answer );
header('Content-Type: application/json');
echo $json;
