angular.module('todoApp',['ngRoute'])
	.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		'use strict';
		$routeProvider.when('/',{
			controller: 'todoCtrl',
			templateUrl: 'views/list.html'
		}).otherwise({
			redirectTo: '/'
		});
		$locationProvider.html5Mode(true);
	}]);