(function() {
'use strict';

angular.module('mainApp')
.controller('newFileModalController', newFileModalController);

newFileModalController.$inject = ['$uibModalInstance'];

function newFileModalController($uibModalInstance) {
	var ctrl = this;
	
	ctrl.fileData = {
		name: '',
		contents: ''
	}
	
	ctrl.ok = function () {
    $uibModalInstance.close(ctrl.fileData);
  };

	ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

})();