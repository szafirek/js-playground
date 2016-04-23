angular.module('todoApp')
	.factory('todoStorage',function(){
		'use strict';
		var STORAGE_ID = 'todo-app';
		return {
			get: function(){
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},
			put: function(todos){
				localStorage.setItem(STORAGE_ID,JSON.stringify(todos));
			}
		};
	});
