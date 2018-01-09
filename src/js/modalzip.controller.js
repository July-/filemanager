(function() {
'use strict';

angular.module('mainApp')
.controller('zipModalController', zipModalController);

zipModalController.$inject = ['$uibModalInstance', 'currentPath'];

function zipModalController($uibModalInstance, currentPath) {
	var ctrl = this;
	
	ctrl.zipData = {
		name: 'archive',
		path: currentPath
	}
	
	ctrl.ok = function () {
    $uibModalInstance.close(ctrl.zipData);
  };

	ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

})();