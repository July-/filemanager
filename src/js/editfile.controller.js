(function() {
'use strict';

angular.module('mainApp')
.controller('editFileController', editFileController);

editFileController.$inject = ['$state', '$uibModal', 'FilesService', 'fileContents', '$rootScope'];

function editFileController($state, $uibModal, FilesService, fileContents, $rootScope) {
	var ctrl = this;
	
	ctrl.fileContents = fileContents;
	
	
	
	ctrl.file = $state.params.fileitem;
	
	ctrl.saveFile = function(file, fileContents) {
		FilesService.saveFile(file, fileContents)
		.then(function(response) {
			$rootScope.$broadcast('newAlert', {message: response.data.message, type: response.data.type});
			$state.go('^');
		})
		.catch(function(error) {
			console.log(error);
		});
	}
	
	if (ctrl.fileContents.data.type == "success") {
		var modalInstance = $uibModal.open({
				windowClass: 'modal-center',
				templateUrl: "templates/editfile.html",
				controller: 'modalEditFileController',
				controllerAs: 'modalEditCtrl',
				resolve: {
					fileContents: function() {
						return ctrl.fileContents;
					},
					fileName: function() {
						return ctrl.file.name
					}
				}
			});
			
			modalInstance.result.then(function(fileContents) {
				ctrl.saveFile(ctrl.file, fileContents);
			}, function() {
				$state.go('^');
			});
	} else {
		$rootScope.$broadcast('newAlert', {message: ctrl.fileContents.data.message, type: ctrl.fileContents.data.type});
		$state.go('^');
		
	}
	
}


})();