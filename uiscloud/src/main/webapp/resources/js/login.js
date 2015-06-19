"use strict";

var myHairLogin = angular.module('myHairLogin',[]);

myHairLogin.controller('loginCtrl', function loginCtrl($scope){
	$scope.init = function (login) {
		if(login) {
			$scope.userId = login.userId;
		}
	};
});

