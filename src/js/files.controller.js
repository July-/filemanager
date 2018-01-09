(function() {
'use strict';

angular.module('mainApp')
.controller('filesController', filesController);

filesController.$inject = ['fileslist', '$uibModal', 'FilesService', 'loginService', '$rootScope', '$state'];

function filesController(fileslist, $uibModal, FilesService, loginService, $rootScope, $state) {
	var ctrl = this;
	
	ctrl.filesList = fileslist.data;
	
	ctrl.token = loginService.token();
	
	ctrl.checkAll = function() {
		for (var i in ctrl.filesList.list) {
     ctrl.filesList.list[i].isChecked = true;
    }
	}
	
	ctrl.uncheckAll = function() {
		for (var i in ctrl.filesList.list) {
     ctrl.filesList.list[i].isChecked = false;
    }
	}
	
	ctrl.sendToZip = function(zipData) {
		FilesService.addArchive(zipData.name, zipData.path, ctrl.filesList)
		.then(function(response) {
			$state.reload();
			ctrl.uncheckAll();
			$rootScope.$broadcast('newAlert', {message: response.data.message, type: response.data.type});
		})
		.catch(function(error) {
			console.log(error);
		});
	}
	
	ctrl.openZipModal = function () {

    var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/zipdialog.html',
        controller: 'zipModalController',
				controllerAs: 'zipCtrl',
        size: 'small',
				resolve: {
					currentPath: function() {
						return ctrl.filesList.breadcrumb.slice(-1)[0].link;
					}
				}
    });

    modalInstance.result.then(function (zipData) {
      ctrl.sendToZip(zipData);
    }, function () {
        
    });
	};
	
	ctrl.openUploadModal = function () {

    var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/uploaddialog.html',
        controller: 'uploadModalController',
				controllerAs: 'uploadCtrl',
        size: 'lg',
				resolve: {
					currentPath: function() {
						return ctrl.filesList.breadcrumb.slice(-1)[0].link;
					}
				}
    });

    modalInstance.result.then(function (uploadData) {
      $state.reload();
    }, function () {
      $state.reload(); 
    });
	};
	
	
	ctrl.openNewFileModal = function () {

    var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/newfiledialog.html',
        controller: 'newFileModalController',
				controllerAs: 'newFileCtrl',
        size: 'small'
    });

    modalInstance.result.then(function (fileData) {
			ctrl.createFile(fileData);
    }, function () {
     
    });
	};
	
	ctrl.openNewFolderModal = function () {

    var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/newfolderdialog.html',
        controller: 'newFolderModalController',
				controllerAs: 'newFolderCtrl',
        size: 'small'
    });

    modalInstance.result.then(function (folderData) {
			ctrl.createFolder(folderData);
    }, function () {
     
    });
	};
	
	ctrl.openUnzipModal = function (item) {

    var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/unzipdialog.html',
        controller: 'unzipModalController',
				controllerAs: 'unzipCtrl',
        size: 'small',
				resolve: {
					currentPath: function() {
						return ctrl.filesList.breadcrumb.slice(-1)[0].link;
					},
					archiveName: function() {
						return item.name;
					}
				}
    });

    modalInstance.result.then(function (folder) {
			ctrl.unzip(item, folder);
    }, function () {
     
    });
	};
	
	ctrl.unzip = function(item, folder) {
		FilesService.unzip(item, folder)
		.then(function(response) {
			$state.reload();
			$rootScope.$broadcast('newAlert', {message: response.data.message, type: response.data.type});
		})
		.catch(function(error) {
			console.log('error');
		});
	}
	
	ctrl.createFile = function(fileData) {
		var currentFolder = ctrl.filesList.breadcrumb.slice(-1)[0].link;
		FilesService.createFile(fileData, currentFolder)
		.then(function(response) {
			$state.reload();
			$rootScope.$broadcast('newAlert', {message: response.data.message, type: response.data.type});
		})
		.catch(function(error) {
			console.log('error');
		});
	}
	
	ctrl.createFolder = function(folderData) {
		var currentFolder = ctrl.filesList.breadcrumb.slice(-1)[0].link;
		FilesService.createFolder(folderData, currentFolder)
		.then(function(response) {
			$state.reload();
			$rootScope.$broadcast('newAlert', {message: response.data.message, type: response.data.type});
		})
		.catch(function(error) {
			console.log(error);
		});
	}
	
	ctrl.deleteSelectedFiles = function() {
		FilesService.deleteFiles(ctrl.filesList)
		.then(function(response) {
			$state.reload();
			ctrl.uncheckAll();
			$rootScope.$broadcast('newAlert', {message: response.data.message, type: response.data.type});
		})
		.catch(function(error) {
			console.log(error);
		});
	}
	
	ctrl.copySelected = function() {
		if (FilesService.copySelected(ctrl.filesList)) {
			$rootScope.$broadcast('newAlert', {
				message: "Files were copied. Now you can navigate to target directory and paste them.", 
				type: "success"
			});
		} else {
			$rootScope.$broadcast('newAlert', {
				message: "Select some files first.", 
				type: "warning"
			});
		}
	}
	
	ctrl.pasteFiles = function() {
		var currentFolder = ctrl.filesList.breadcrumb.slice(-1)[0].link;
		FilesService.pasteFiles(currentFolder)
		.then(function(response) {
			$state.reload();
			$rootScope.$broadcast('newAlert', {message: response.data.message, type: response.data.type});
		})
		.catch(function(error) {
			console.log(error);
		});
	}
	
	ctrl.renameFile = function(file, newName) {
		
		var oldName = file.name,
		filePath = file.path;
		FilesService.rename(file.path, oldName, newName)
		.then(function(response) {
			$state.reload();
			$rootScope.$broadcast('newAlert', {message: response.data.message, type: response.data.type});
		})
		.catch(function(error) {
			console.log(error);
		});
	}
	
	
}


})();