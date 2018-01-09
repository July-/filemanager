<?php 

ini_set('display_errors',1);
error_reporting(E_ALL);

require('config.php');

$salt = "hK";
$for_crypt = $config['user'] . $config['password'];
$token = crypt($for_crypt, $salt);

$return_msg = array();

if ( $_POST['action'] != "login" && (!isset($_POST['token']) || $_POST['token'] != $token) ) {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "Access denied.";
	output($return_msg);
}


/************************
Files list
*************************/
if($_POST['action'] == "fileslist") {
	if(isset($_POST['dir'])) {
		$short_dir = trim($_POST['dir'], "/");
		if ($config['non_utf_system'] === true) {
			$short_dir = iconv('UTF-8', $config['system_encoding'], $short_dir);
			setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
		}
	} else {
		$short_dir = "";
	}


	$dir = $config['home_dir'] . $short_dir;
	$files = array_diff(scandir($dir), array('..', '.'));
	$only_files = array();
	$only_folders = array();
	$breadcrumb_links = array();
	$breadcrumb_headers = array();


	foreach($files as $file) {
		$file_details = array();
		$file_details["name"] = $file;
		$full_path = $dir . "/" . $file;
		if ($config['non_utf_system'] === true) {
			$file_details["name"] = iconv($config['system_encoding'], 'UTF-8', $file);
		}
		$file_details["path"] = $short_dir;
		$file_details["isChecked"] = false;
		if ($config['non_utf_system'] === true) {
			$file_details["path"] = iconv($config['system_encoding'], 'UTF-8', $short_dir);
		}
			if (is_dir($full_path))  {
				 $file_details["type"] = "directory";
			 $file_details["size"] = "";
			 $only_folders[] = $file_details;
			} else {
			$file_details["type"] = "file";
			$file_details["size"] = filesize($full_path);
			$file_details["extension"] = pathinfo($full_path, PATHINFO_EXTENSION);
			$only_files[] = $file_details;
		}
		
	}

	$chunks = explode('/', $short_dir);
	foreach ($chunks as $i => $chunk) {
		if ($config['non_utf_system'] === true) {
			$chunk = iconv($config['system_encoding'], 'UTF-8', $chunk);
		}
		$current_dir = array();
		$current_dir["link"] = implode('/', array_slice($chunks, 0, $i + 1));
		if ($config['non_utf_system'] === true) {
			$current_dir["link"] = iconv($config['system_encoding'], 'UTF-8', $current_dir["link"]);
		}
		$current_dir["header"] = $chunk;
			$breadcrumb[] = $current_dir;
	}

	$files_ext["list"] = array_merge($only_folders, $only_files);
	$files_ext["breadcrumb"] = $breadcrumb;
	output($files_ext);
} 

/************************
Creating ZIP archive
*************************/

if($_POST['action'] == "zip") {
	
	if(isset($_POST['archive_name']) && isset($_POST['archive_path']) && !empty($_POST['files_to_zip']) ) {
		
		$archive_name = $_POST['archive_name'];
		$archive_path = trim($_POST['archive_path'], "/");
		$files_to_zip = explode('_separator_',$_POST['files_to_zip']);
		if(isset($_POST['archive_root']) && !empty($_POST['archive_root']) ) {
			$zip_home_dir = $config['home_dir'] . trim($_POST['archive_root'], "/");
		} else {
			$zip_home_dir = trim($config['home_dir'], "/");
		}
		
		if ($config['non_utf_system'] === true) {
			$archive_name = iconv('UTF-8', $config['system_encoding'], $archive_name);
			$archive_path = iconv('UTF-8', $config['system_encoding'], $archive_path);
			$encode_files_to_zip = $_POST['files_to_zip'];
			$encode_files_to_zip = iconv('UTF-8', $config['system_encoding'], $encode_files_to_zip);
			$files_to_zip = explode('_separator_',$encode_files_to_zip);
			$zip_home_dir = iconv('UTF-8', $config['system_encoding'], $zip_home_dir);
			setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
		}
		
		$archive_full_path = $config['home_dir'] . $archive_path;
		$files_list = "";
		
		if(is_dir($archive_full_path))  {
			
			if (extension_loaded('zip')) {
				$zip = new ZipArchive();
				if ($zip->open($archive_full_path . "/" . $archive_name . ".zip", ZIPARCHIVE::CREATE)) {
					foreach($files_to_zip as $file) {
						$file = str_replace("\\","/",$file);
						$full_path_file = $config['home_dir'] . trim($file, "/");
						if (file_exists($full_path_file)) {
							if (is_dir($full_path_file)) {
								$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($full_path_file), RecursiveIteratorIterator::SELF_FIRST);
								foreach ($files as $subfile) {
									$subfile = str_replace("\\","/",$subfile);
									//$subfile = realpath($subfile);
									if (is_dir($subfile)) {
										//$zip->addEmptyDir(str_replace($zip_home_dir . '/', '', $subfile . '/'));
									} else if (is_file($subfile)) {
										if ($config['non_utf_system'] === true) {
											
											$encode_zip_home_dir = iconv( $config['system_encoding'], $config['filesystem_encoding'], $zip_home_dir);
											$encode_subfile = iconv( $config['system_encoding'], $config['filesystem_encoding'], $subfile);
											$encode2_subfile = iconv( $config['system_encoding'],'UTF-8', $subfile);
											
											$zip->addFromString(str_replace($encode_zip_home_dir . '/', '', $encode_subfile), file_get_contents($subfile));
											$files_list .= $encode2_subfile . "\n";
										} else {
											$zip->addFromString(str_replace($zip_home_dir . '/', '', $subfile), file_get_contents($subfile));
											$files_list .= $subfile . "\n";
										}
									}
								}
							} else if (is_file($full_path_file)) {
								if ($config['non_utf_system'] === true) {
									$encode_zip_home_dir = iconv( $config['system_encoding'], $config['filesystem_encoding'], $zip_home_dir);
									$encode_full_path_file = iconv( $config['system_encoding'], $config['filesystem_encoding'], $full_path_file);
									$encode2_full_path_file = iconv( $config['system_encoding'],'UTF-8', $full_path_file);
											
									$zip->addFromString(str_replace($encode_zip_home_dir . '/', '', $encode_full_path_file), file_get_contents($full_path_file));
									$files_list .= $encode2_full_path_file . "\n";
								} else {
									$zip->addFromString(str_replace($zip_home_dir . '/', '', $full_path_file), file_get_contents($full_path_file));
									$files_list .= $full_path_file . "\n";
								}
							}
						}
						
						
					}
				}
				$zip->close();
				
				$all_vars = get_defined_vars();
				$return_msg["type"] = "success";
				$return_msg["message"] = "Archive \"" . $archive_name . "\" in the folder \"" .  $archive_path . "\" was created. \nFiles that were zipped: \n " . $files_list;
			}
		} else {
			$return_msg["type"]="warning";
			$return_msg["message"]="Wrong path";
		}
	} else {
		$return_msg["type"]="warning";
		$return_msg["message"]="No files were selected.";
	}
	
	output($return_msg);
	
}


/************************
Delete files
*************************/

if($_POST['action'] == "delete") {

if(!isset($_POST['files_to_delete']) || $_POST['files_to_delete'] == '') {
	$return_msg["type"]="warning";
	$return_msg["message"]="No files were chosen.";
} else {

	$files_to_delete = explode('_separator_',$_POST['files_to_delete']);

	if ($config['non_utf_system'] === true) {
		setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
	}

	foreach($files_to_delete as $file) {
		if ($config['non_utf_system'] === true) {
			$file = iconv('UTF-8', $config['system_encoding'], $file);
		}
		$file_full_path = realpath ($config['home_dir'] . trim($file, "/") );
		if (is_dir($file_full_path)) {
			$it = new RecursiveDirectoryIterator($file_full_path, RecursiveDirectoryIterator::SKIP_DOTS);
			$it_files = new RecursiveIteratorIterator($it,
						 RecursiveIteratorIterator::CHILD_FIRST);
			foreach($it_files as $it_file) {
				if (is_dir($it_file)){
					rmdir($it_file);
				} else {
					unlink($it_file);
				}
			}
			rmdir($file_full_path);
		} else {
			unlink($file_full_path);
		}
	}

	$return_msg["type"] = "success";
	$return_msg["message"] = "Files were deleted.";
}

output($return_msg);
}

/************************
Upload files
*************************/

if($_POST['action'] == "upload") {

if (empty( $_FILES ) ) {
	$return_msg["type"]="warning";
	$return_msg["message"]="No files were chosen.";
	output($return_msg);
}

if ($config['non_utf_system'] === true) {
	setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
}

$tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
if (trim($_POST['dir_to_upload'], "/") !="") {
	$uploadPath = $config['home_dir'] . trim($_POST['dir_to_upload'], "/") . "/" . $_FILES[ 'file' ][ 'name' ];
} else {
	$uploadPath = $config['home_dir'] . $_FILES[ 'file' ][ 'name' ];
}
$filename = $_FILES[ 'file' ][ 'name' ];

if ($config['non_utf_system'] === true) {
	$uploadPath = iconv('UTF-8', $config['system_encoding'], $uploadPath);
}

if (move_uploaded_file( $tempPath, $uploadPath )) {
	$return_msg["type"] = "success";
	$return_msg["message"] = "File " . $filename . " was uploaded to " . $_POST['dir_to_upload'];	
} else {
	$return_msg["type"] = "warning";
	$return_msg["message"] = "File " . $filename . " failed to be uploaded to " . $_POST['dir_to_upload'];
}


output($return_msg);

}


/************************
New file
*************************/

if($_POST['action'] == "newfile") {
	if(!isset($_POST['filename']) || !isset($_POST['filepath'])) {
	$return_msg["type"] = "warning";
	$return_msg["message"] = "No filename or folder provided";
	output($return_msg);
}

$post_filename = $_POST['filename'];
$post_filepath = $_POST['filepath'];

if ($config['non_utf_system'] === true) {
	$post_filename = iconv('UTF-8', $config['system_encoding'], $post_filename);
	$post_filepath = iconv('UTF-8', $config['system_encoding'], $post_filepath);
	setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
}

if (empty($post_filepath)) {
	$filepath = $config['home_dir'];
} else {
	$filepath = $config['home_dir'] . trim($post_filepath, "/") . "/";
}

$full_file_path = $filepath . $post_filename;

if( !is_dir( $filepath ) ) {
  $return_msg["type"] = "danger";
	$return_msg["message"] = "Folder doesn't exist.";
	output($return_msg);
}

if ( file_exists( $full_file_path ) ) {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "File " . $post_filename . " already exists. Try to use different name or folder.";
	output($return_msg);
}

$created_file = fopen($full_file_path, "w") or failedToCreate();
function failedToCreate() {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "Failed to create file " . $post_filename . ".";
	output($return_msg);
}

if ( !empty($_POST['filecontents']) ) {
	fwrite($created_file, $_POST['filecontents']);
}
fclose($created_file);
$return_msg["type"] = "success";
$return_msg["message"] = "File " . $post_filename . " was created.";
output($return_msg);

}


/************************
New folder
*************************/

if($_POST['action'] == "newfolder") {
	
	if(empty($_POST['directory'])) {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "Folder name was not set.";
	output($return_msg);
}

$directory = $_POST['directory'];
$directory_location = $_POST['directory_location'];

if ($config['non_utf_system'] === true) {
	$directory = iconv('UTF-8', $config['system_encoding'], $directory);
	$directory_location = iconv('UTF-8', $config['system_encoding'], $directory_location);
	setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
}

if(!empty($directory_location) ) {
	$full_file_path = $config['home_dir'] . trim($directory_location, "/") . "/" . trim($directory, "/");
} else {
	$full_file_path = $config['home_dir'] . trim($directory, "/");
}

if( file_exists( $full_file_path ) ) {
  $return_msg["type"] = "warning";
	$return_msg["message"] = "Folder " . $directory . " already exists.";
	output($return_msg);
}

if (mkdir($full_file_path, 0777, true) ) {
	$return_msg["type"] = "success";
	$return_msg["message"] = "Folder " . $directory . " was created.";
} else {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "Failed to create folder ". $directory . ".";
}
output($return_msg);
	
}

/************************
Paste files
*************************/

if($_POST['action'] == "paste") {
	
if(empty($_POST['files'])) {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "No files were copied.";
	output($return_msg);
}

$dir_to_paste = $_POST['dir_to_paste'];
$files_to_paste = explode('_separator_',$_POST['files']);

if ($config['non_utf_system'] === true) {
	$dir_to_paste = iconv('UTF-8', $config['system_encoding'], $dir_to_paste);
	$encode_files_to_paste = iconv('UTF-8', $config['system_encoding'], $_POST['files']);
	$files_to_paste = explode('_separator_',$encode_files_to_paste);
	setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
}

if(!empty($dir_to_paste)) {
	$full_dir_to_paste = $config['home_dir'] . trim($dir_to_paste, "/") . "/";
} else {
	$full_dir_to_paste = $config['home_dir'];
}

foreach($files_to_paste as $file) {
	$full_path_file = $config['home_dir'] . trim($file, "/");
	if (is_dir($full_path_file) ) {
		$dir_name = basename($full_path_file);
		$new_dir = $full_dir_to_paste . $dir_name;
		mkdir($new_dir, 0755);
		foreach (
		 $iterator = new \RecursiveIteratorIterator(
		  new \RecursiveDirectoryIterator($full_path_file, \RecursiveDirectoryIterator::SKIP_DOTS),
		  \RecursiveIteratorIterator::SELF_FIRST) as $item
		) {
		  if ($item->isDir()) {
			mkdir($new_dir . DIRECTORY_SEPARATOR . $iterator->getSubPathName());
		  } else {
			copy($item, $new_dir . DIRECTORY_SEPARATOR . $iterator->getSubPathName());
		  }
		}

	} else {
		copy($full_path_file, $full_dir_to_paste . basename($full_path_file));
	}
}

$return_msg["type"] = "success";
$return_msg["message"] = "Files were pasted.";
output($return_msg);
	
}

/************************
Rename
*************************/

if($_POST['action'] == "rename") {
	
if( empty($_POST['file_old_name']) || empty($_POST['file_new_name']) ) {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "File name was not defined.";
	output($return_msg);
}

$old_name = $_POST['file_old_name'];
$new_name = $_POST['file_new_name'];
$file_path = $_POST['file_path'];

if ($config['non_utf_system'] === true) {
	$old_name = iconv('UTF-8', $config['system_encoding'], $old_name);
	$new_name = iconv('UTF-8', $config['system_encoding'], $new_name);
	$file_path = iconv('UTF-8', $config['system_encoding'], $file_path);
	setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
}

if (!empty($file_path)) {
	$full_old_name = $config['home_dir'] . trim($file_path, "/") . "/" . $old_name;
	$full_new_name = $config['home_dir'] . trim($file_path, "/") . "/" . $new_name;
} else {
	$full_old_name = $config['home_dir'] . $old_name;
	$full_new_name = $config['home_dir'] . $new_name;
}

if ( file_exists( $full_new_name ) ) {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "Name " . $new_name . " already exists in current folder. Try to use different name.";
	output($return_msg);
}

if(rename($full_old_name, $full_new_name)) {
	$return_msg["type"] = "success";
	$return_msg["message"] = "File or folder " . $old_name . " was renamed to " . $new_name . ".";
} else {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "Failed to rename " . $old_name . " to " . $new_name . ".";
}

output($return_msg);
	
}

/************************
Unzip
*************************/

if($_POST['action'] == "unzip") {
	
if(empty($_POST['file_to_unzip'])) {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "Zip file was not defined.";
	output($return_msg);
}

$file_to_unzip = $_POST['file_to_unzip'];
$folder_to_unzip = $_POST['folder_to_unzip'];

if ($config['non_utf_system'] === true) {
	$file_to_unzip = iconv('UTF-8', $config['system_encoding'], $file_to_unzip);
	$folder_to_unzip = iconv('UTF-8', $config['system_encoding'], $folder_to_unzip);
	setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
}

if (empty($folder_to_unzip)) {
	$full_folder_to_unzip = $config['home_dir'];
} else {
	$full_folder_to_unzip = $config['home_dir'] . trim($folder_to_unzip, "/") . "/";
}

$full_file_to_unzip = $config['home_dir'] . trim($file_to_unzip, "/");

if (!file_exists($full_folder_to_unzip)) {
	mkdir($full_folder_to_unzip);
}

$zip = new ZipArchive;
if ($zip->open($full_file_to_unzip) === TRUE) {
  $zip->extractTo($full_folder_to_unzip);
  $zip->close();
  $return_msg["type"] = "success";
	$return_msg["message"] = "Archive " . $file_to_unzip . " was unzipped.";
} else {
  $return_msg["type"] = "danger";
	$return_msg["message"] = "Failed to unzip  " . $file_to_unzip . ".";
}

output($return_msg);
	
}

/************************
Login
*************************/

if($_POST['action'] == "login") {

if(empty($_POST['user']) || empty($_POST['password'])) {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "Username or password was not set.";
	output($return_msg);
}

if ( ($_POST['user'] != $config['user']) ||  ($_POST['password'] != $config['password']) ) {
	$return_msg["type"] = "warning";
	$return_msg["message"] = "Wrong username or password.";
	output($return_msg);
}

$string_to_crypt = $_POST['user'] . $_POST['password'];
$access_token = crypt($string_to_crypt, $salt);

$return_msg["type"] = "success";
$return_msg["message"] = "You were logged in.";		
$return_msg["token"] = $access_token;
output($return_msg);
	
}

/************************
File contents
*************************/
if($_POST['action'] == "filecontents") {

if(!isset($_POST['file'])) {
	$return_msg["type"] = "warning";
	$return_msg["message"] = "No file was chosen.";
	output($return_msg);
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
	$return_msg["type"] = "warning";
	$return_msg["message"] = "This file could not be edited.";
	output($return_msg);
} else {
	$return_msg["type"] = "success";
	$return_msg["content"] = $file_code;
}
output($return_msg);
}

/************************
Save file
*************************/
if($_POST['action'] == "savefile") {
	
if(empty($_POST['file'])) {
	$return_msg["type"] = "warning";
	$return_msg["message"] = "No file was chosen.";
	output($return_msg);
}

$target_file = $_POST['file'];

if ($config['non_utf_system'] === true) {
	$target_file = iconv('UTF-8', $config['system_encoding'], $target_file);
	setlocale(LC_ALL,'en_US.' . $config['system_encoding']);
}

$file = $config['home_dir'] . trim($target_file, "/");

if ( file_exists( $file ) ) {
	$saved_file = fopen($file, "w") or die(json_encode( array( "type" => "danger", "message" => "Unable to edit a file", ) ) );
	if ( isset($_POST['filecontents']) ) {
		fwrite($saved_file, $_POST['filecontents']);
		fclose($saved_file);
	}
	$return_msg["type"] = "success";
	$return_msg["message"] = "File was saved.";
} else {
	$return_msg["type"] = "danger";
	$return_msg["message"] = "File does not exist.";
}
output($return_msg);	
}

/********************
Reusable functions
********************/
function output($output_data) {
	global $config;
	if ($config['non_utf_system'] === true) {
		if(isset($output_data["message"])) {
			$output_data["message"] = iconv($config['system_encoding'],'UTF-8',  $output_data["message"]);
		}
	}

	header('Content-Type: application/json;charset=utf-8');
	exit( json_encode($output_data) );
}
