(function() {
'use strict';

angular.module('mainApp')
.controller('modalImageController', modalImageController);

modalImageController.$inject = ['$stateParams', 'loginService', '$uibModalInstance'];

function modalImageController($stateParams, loginService, $uibModalInstance) {
	var ctrl = this;
	ctrl.item = $stateParams.image;
	ctrl.accessToken = loginService.token();
	
	ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}


})();