(function() {
"use strict";
	
angular.module("mainApp", ['ui.router','ngCookies', 'ngTouch', 'ngAnimate', 'ui.bootstrap', 'angularFileUpload', 'xeditable', 'angular-loading-bar'])
.constant('phpUrl', 'php/filemanager.php')
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'; 
}])
.run(['$transitions','editableOptions', 'cfpLoadingBar',  function($transitions, editableOptions, cfpLoadingBar) {
	
	editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
	
	$transitions.onBefore({}, function(transition) {
		var auth = transition.injector().get('loginService');
		if (transition.$to().name != "login" && !auth.loggedIn()) {
			return transition.router.stateService.target('login');
		}
	});
	
	$transitions.onStart({}, function(transition) {
		cfpLoadingBar.start(); 
	});
			
	$transitions.onFinish({}, function(transition) {
			cfpLoadingBar.complete(); 
	});
}
]);


})();