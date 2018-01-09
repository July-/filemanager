(function() {
'use strict';

angular.module('mainApp')
.controller('imageController', imageController);

imageController.$inject = ['$uibModal', '$state'];

function imageController($uibModal, $state) {
	var ctrl = this;
	
	var modalInstance = $uibModal.open({
      windowClass: 'modal-center',
      templateUrl: "templates/image.html",
			controller: 'modalImageController',
			controllerAs: 'modalCtrl'
    });
    
    modalInstance.result.then(function() {
      // Value sumitted
			$state.go('^');
    }, function() {
      // Modal dismissed. 
      $state.go('^');
    });
	
}


})();