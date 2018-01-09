(function() {
'use strict';

angular.module('mainApp')
.controller('modalEditFileController', modalEditFileController);

modalEditFileController.$inject = ['$uibModalInstance', 'fileContents', 'fileName'];

function modalEditFileController($uibModalInstance, fileContents, fileName) {
	var ctrl = this;
	
	ctrl.fileName = fileName;
	
	ctrl.fileContents = fileContents.data.content;
	
	ctrl.ok = function () {
    $uibModalInstance.close(ctrl.fileContents);
  };

	ctrl.cancel = function () {
    $uibModalInstance.dismiss();
  };
}

})();