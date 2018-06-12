angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', ['$http',function($http) {

		return {
			get : function() {
				return $http.get('http://localhost:8090/api/todos');
				// return $http.get('http://' + process.env.API_HOST + ':' + process.env.API_PORT);
			},
			create : function(todoData) {
				return $http.post('http://localhost:8090/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('http://localhost:8090/api/todos/' + id);
			}
		}
	}]);