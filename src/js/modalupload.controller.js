(function() {
'use strict';

angular.module('mainApp')
.controller('uploadModalController', uploadModalController);

uploadModalController.$inject = ['$uibModalInstance', 'FileUploader', 'loginService', 'currentPath'];

function uploadModalController($uibModalInstance, FileUploader, loginService, currentPath) {
	var ctrl = this;
	
	ctrl.message = "";
	
	ctrl.uploader = new FileUploader({
		url: 'php/filemanager.php',
		type: 'post', 
		formData: [{
			'token': loginService.token(),
			'dir_to_upload': currentPath,
			'action': 'upload'
		}], 
		removeAfterUpload: true
	});
	
	ctrl.uploader.onCompleteItem = function(item, response, status, headers) {
    console.log(response);
		ctrl.message += response.message + "\n";
	};
	
	
	// ctrl.uploader.onCompleteAll = function(item, response, status, headers) {
    // ctrl.message = "Files were uploaded.";
	// };
	 
	 // ctrl.uploader.onErrorItem = function(item, response, status, headers) {
		 // ctrl.message = "Error. Try later.";
		 // console.log(response);
	 // }
	
	
	ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
		ctrl.message = "";
  };
}

})();