(function() {
'use strict';

angular.module('mainApp')
.service('FilesService', FilesService);

FilesService.$inject = ['$http', 'loginService'];

function FilesService($http, loginService) {
	var service = this;
	
	service.backendUrl = 'php/filemanager.php';
	
	service.objToParams = function(obj) {
		var p = [];
		for (var key in obj) {
			p.push(key + '=' + encodeURIComponent(obj[key]));
		}
		return p.join('&');
	};
	
	service.filesList = function (directory) {
		directory = typeof directory !== 'undefined' ? directory : "";
		
		var paramsToSend = service.objToParams({
			'dir': directory, 
			'action': 'fileslist', 
			'token': loginService.token()
		});
		
		return $http({
			method: 'POST',
			url: service.backendUrl,
			data: paramsToSend
		});
	}
	
	service.selectedFiles = function(filesList) {
		var selectedFiles = [];
		
		for (var i in filesList.list) {
			if (filesList.list[i].isChecked === true) {
				selectedFiles.push(filesList.list[i].path + "/" + filesList.list[i].name);
			}
		}
		
		return selectedFiles;
	}
	
	service.addArchive = function(archiveName, archivePath, filesList) {
		
		var selectedFiles = service.selectedFiles(filesList);
		
		var selectedFilesString = selectedFiles.join("_separator_");
		
		var paramsToSend = service.objToParams({
			'archive_path': archivePath, 
			'archive_name': archiveName, 
			'files_to_zip': selectedFilesString, 
			'action': 'zip', 
			'token': loginService.token()
		});
		
		return $http({
			method: 'POST',
			url: service.backendUrl,
			data: paramsToSend
		});
	}
	
	service.createFile = function(fileData, currentFolder) {
		
		var paramsToSend = service.objToParams({
			'filename': fileData.name, 
			'filecontents': fileData.contents,
			'filepath': currentFolder, 
			'action': 'newfile',
			'token': loginService.token()
		});
		
		return $http({
			method: 'POST',
			url: service.backendUrl,
			data: paramsToSend
		});
	}
	
	service.createFolder = function(folderData, currentFolder) {
		
		var paramsToSend = service.objToParams({
			'directory': folderData, 
			'directory_location': currentFolder, 
			'action': 'newfolder',
			'token': loginService.token()
		});
		
		return $http({
			method: 'POST',
			url: service.backendUrl,
			data: paramsToSend
		});
	}
	
	service.deleteFiles = function(filesList) {
		var selectedFiles = service.selectedFiles(filesList);
		
		var selectedFilesString = selectedFiles.join("_separator_");
		
		var paramsToSend = service.objToParams({
			'files_to_delete': selectedFilesString, 
			'action': 'delete', 
			'token': loginService.token()
		});
		
		return $http({
			method: 'POST',
			url: service.backendUrl,
			data: paramsToSend
		});
	}
	
	
	service.data = {
		selectedFiles: []
	}
	
	service.copySelected = function(filesList) {
		var selectedFiles = service.selectedFiles(filesList);
		if (selectedFiles.length) {
			service.data.selectedFiles = selectedFiles;
			return true;
		}
		return false;
	}
	
	service.pasteFiles = function(currentFolder) {
		
		var selectedFilesString = service.data.selectedFiles.join("_separator_");
		
		var paramsToSend = service.objToParams({
			'files': selectedFilesString,
			'dir_to_paste' : currentFolder,		
			'action': 'paste', 
			'token': loginService.token()
		});
		
		return $http({
			method: 'POST',
			url: service.backendUrl,
			data: paramsToSend
		});
	}
	
	service.rename = function(path, oldName, newName) {
		
		var paramsToSend = service.objToParams({
			'file_old_name': oldName,
			'file_new_name' : newName,	
			'file_path' : path,
			'action': 'rename', 
			'token': loginService.token()
		});
		
		return $http({
			method: 'POST',
			url: service.backendUrl,
			data: paramsToSend
		});
	}
	
	service.unzip = function(item, folder) {
		
		var paramsToSend = service.objToParams({
			'file_to_unzip': item.path + '/' + item.name,
			'folder_to_unzip' : folder,	
			'action': 'unzip', 
			'token': loginService.token()
		});
		
		return $http({
			method: 'POST',
			url: service.backendUrl,
			data: paramsToSend
		});
	}
	
	service.fileContents = function(item) {
		
		var paramsToSend = service.objToParams({
			'file': item.path + '/' + item.name,
			'action': 'filecontents', 
			'token': loginService.token()
		});
		
		return $http({
			method: 'POST',
			url: service.backendUrl,
			data: paramsToSend
		});
	}
	
	service.saveFile = function(item, contents) {
		
		var paramsToSend = service.objToParams({
			'file': item.path + '/' + item.name,
			'filecontents': contents,
			'action': 'savefile', 
			'token': loginService.token()
		});
		
		return $http({
			method: 'POST',
			url: service.backendUrl,
			data: paramsToSend
		});
	}
	
	
}


})();