(function() {
'use strict';

angular.module('mainApp')
.controller('AlertController', AlertController);

AlertController.$inject = ['$rootScope']; 

function AlertController($rootScope) {
	var ctrl = this;
  ctrl.alerts = [];

  ctrl.addAlert = function(message, alertClass, alertEvent) {
    ctrl.alerts.push({msg: message, type: alertClass, event: alertEvent});
  };

  ctrl.closeAlert = function(index) {
    ctrl.alerts.splice(index, 1);
  };
  
  $rootScope.$on('newAlert', function(event, obj) {
      ctrl.addAlert(obj.message, obj.type, "zipAlerts");
    });
	
		
}

})();