(function() {
'use strict';

angular.module('mainApp')
.controller('fileController', fileController);

fileController.$inject = ['$state'];

function fileController($state) {
	var ctrl = this;

	ctrl.action = function(item) {
		if (item.type == 'directory') {
			$state.go('folder', {folder: (item.path + '/' + item.name)});
			return true;
		}
		if (item.type == 'file' && /jpg|jpeg|png|gif/.test(item.extension) ) {
			$state.go('folder.image', {image: (item.path + '/' + item.name)});
			return true;
		}
		$state.go('folder.file', {file: (item.path + '/' + item.name), fileitem: item});
	}
	
	ctrl.save = function(item, data) {
    ctrl.rename({ file: item, newName: data});
  }
	
	ctrl.downloadLink = function(item) {
		var itemPath = encodeURIComponent(item.path),
		itemName = encodeURIComponent(item.name);
		return ('php/download.php?file_to_download=' + itemPath + '/' + itemName + '&token=' + ctrl.token);
	}
	
}

})();