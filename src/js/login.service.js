(function() {
'use strict';

angular.module('mainApp')
.service('loginService', loginService);

loginService.$inject = ['$cookies', '$http'];

function loginService($cookies, $http) {
	var service = this;
	
	service.backendUrl = 'php/filemanager.php';
	
	service.objToParams = function(obj) {
		var p = [];
		for (var key in obj) {
			p.push(key + '=' + encodeURIComponent(obj[key]));
		}
		return p.join('&');
	};
	
	service.loggedIn = function() {
		if ($cookies.get('accessToken')) {
			return true;
		}
		return false;
	};
	
	service.token = function() {
		if ($cookies.get('accessToken')) {
			return $cookies.get('accessToken');
		}
		return false;
	};
	
	service.setToken = function(token) {
		var expireDate = new Date();
		expireDate.setDate(expireDate.getDate() + 30);
		$cookies.put('accessToken', token, {
			expires: expireDate 
		});
	}
	
	service.removeAccessToken = function() {
		$cookies.remove('accessToken');
	}
	
	service.login = function(user, password) {
		var paramsToSend = service.objToParams({
			'user': user, 
			'password': password, 
			'action': 'login'
		});
		
		return $http({
			method: 'POST',
			url: service.backendUrl,
			data: paramsToSend
		});
	}
}


})();