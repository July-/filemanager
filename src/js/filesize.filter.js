(function () {
"use strict";

angular.module('mainApp')
.filter('filesize', function () {
	return function (size) {
		if (isNaN(size) || !size.toString().length)
			size = 0;

		if (size < 1024)
			return size + ' B';

		size /= 1024;

		if (size < 1024)
			return size.toFixed(2) + ' Kb';

		size /= 1024;

		if (size < 1024)
			return size.toFixed(2) + ' Mb';

		size /= 1024;

		if (size < 1024)
			return size.toFixed(2) + ' Gb';

		size /= 1024;

		return size.toFixed(2) + ' Tb';
	};
});

})();