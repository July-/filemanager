(function() {
'use strict';

angular.module('mainApp')
.config(routeConfig);


routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
function routeConfig ($stateProvider, $urlRouterProvider) {
	
	$urlRouterProvider.otherwise('/filemanager/');
  
  $stateProvider
    
		.state('folder', {
			url: '/filemanager/{folder}',
			templateUrl: 'templates/home.html',
			controller: 'filesController as filesctrl',
			params: {
        folder: {
          value: ''
        }
      },
			resolve: {
				fileslist: ['FilesService', '$stateParams', function (FilesService, $stateParams) {
        return FilesService.filesList($stateParams.folder);
			}]
			}
		})
		
		.state('folder.image', {
			url: '/image/{image}',
			controller: 'imageController',
			controllerAs: 'imagectrl'
		})
		
		.state('folder.file', {
			//url: '/file/{file}',
			controller: 'editFileController',
			controllerAs: 'editfilectrl',
			params: {
        fileitem: null
      },
			resolve: {
        fileContents: ['FilesService', '$stateParams', function (FilesService, $stateParams) {
          return FilesService.fileContents($stateParams.fileitem);
        }]
      }
		})
		
		.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    });
}
})();
