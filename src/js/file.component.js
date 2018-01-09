(function () {
"use strict";

angular.module('mainApp')
.component('file', {
  templateUrl: 'templates/file.html',
  bindings: {
    item: '<',
		rename: '&',
		unzip: '&',
		token: '<'
  },
	bindToController: true,
	controller: 'fileController'
});



})();