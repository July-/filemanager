(function() {
'use strict';

angular.module('mainApp')
.controller('LoginController', LoginController);

LoginController.$inject = ['$uibModal', 'loginService', '$rootScope', '$state', '$transitions'];

function LoginController($uibModal, loginService, $rootScope, $state, $transitions) {
	var ctrl = this;
	
	ctrl.state = '';
	
	$transitions.onSuccess({}, function(transition) {
		ctrl.state = transition.to().name;
	});
	
	
	
	ctrl.login = function(user, password) {
		loginService.login(user, password)
		.then(function(response) {
			if (response.data.type == "success") {
				loginService.setToken(response.data.token);
				$state.go('folder', { folder: '' });
			}
			$rootScope.$broadcast('newAlert', {message: response.data.message, type: response.data.type});
		})
		.catch(function(error) {
			console.log(error);
		});
	}
	
	ctrl.logout = function() {
		loginService.removeAccessToken();
		$state.go('login', {});
	}
	
}


})();