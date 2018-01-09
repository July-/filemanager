(function() {
'use strict';

angular.module('mainApp')
.controller('newFolderModalController', newFolderModalController);

newFolderModalController.$inject = ['$uibModalInstance'];

function newFolderModalController($uibModalInstance) {
	var ctrl = this;
	
	ctrl.name = '';
	
	ctrl.ok = function () {
    $uibModalInstance.close(ctrl.name);
  };

	ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

})();