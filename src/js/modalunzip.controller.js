(function() {
'use strict';

angular.module('mainApp')
.controller('unzipModalController', unzipModalController);

unzipModalController.$inject = ['$uibModalInstance', 'currentPath', 'archiveName'];

function unzipModalController($uibModalInstance, currentPath, archiveName) {
	var ctrl = this;
	
	ctrl.currentPath = currentPath;
	ctrl.archiveName = archiveName;
	
	ctrl.ok = function () {
    $uibModalInstance.close(ctrl.currentPath);
  };

	ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

})();