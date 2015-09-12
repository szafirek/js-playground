angular.module('todoApp')
	.controller('todoCtrl',function todoCtrl($scope,$filter,todoStorage){
		'use strict';
		var todos = $scope.todos = todoStorage.get();
		$scope.newTodo = '';
		$scope.status = 'all';
		$scope.statusFilter = null;
		$scope.editedTodo = null;

		$scope.$watch('todos',function(newValue,oldValue){
			$scope.toComplete = $filter('filter')(todos,{completed: false}).length;
			$scope.completed = todos.length - $scope.toComplete;
			$scope.allCompleted = $scope.toComplete === 0;
			if(newValue !== oldValue){
				todoStorage.put(todos);
			}
		},true);

		$scope.addTodo = function(){
			var newTodo = $scope.newTodo.trim();
			if(!newTodo.length){
				return;
			}
			todos.push({
				title: newTodo,
				completed: false
			});
			$scope.newTodo = '';
		};

		$scope.removeTodo = function(todo){
			todos.splice(todos.indexOf(todo),1);
		};

		$scope.removeAllCompleted = function(){
			todos = $scope.todos = $filter('filter')(todos,{completed: false});
		};

		$scope.mark = function(todo){
			var i = todos.indexOf(todo);
			todos[i].completed = !todos[i].completed;
		};

		$scope.checkAll = function(){
			todos.forEach(function(todo){
				todo.completed = !$scope.allCompleted;
			});
		};

		$scope.changeStatus = function(status){
			$scope.status = status;
			$scope.statusFilter = (status === 'active') ? {completed:false} : (status === 'completed') ? {completed: true} : null;
		};

		$scope.editTodo = function(todo){
			$scope.editedTodo = todo;
			$scope.originalTodo = angular.extend({},todo);
		};

		$scope.finalEditTodo = function(todo){
			$scope.editedTodo = null;
			todo.title = todo.title.trim();
			if(!todo.title){
				$scope.removeTodo(todo);
			}
		};

		$scope.cancelChange = function(todo){
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.finalEditTodo($scope.originalTodo);
		};
	});