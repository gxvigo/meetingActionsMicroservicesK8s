angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', ['$http', '$location' ,function($http, $location) {

		// location is used to use the local (running app) proxy to call remote meetingApi
		// console.log('### location: ' + $location.host() + ' ' + $location.port()) ;
		var meetingUIUrl = $location.host() + ':' + $location.port() ;

		return {
			get : function() {
				// return $http.get('http://localhost:8090/api/todos');
				return $http.get('http://' + meetingUIUrl + '/api/todos');
				// return $http.get('http://' + process.env.API_HOST + ':' + process.env.API_PORT);
			},
			create : function(todoData) {
				return $http.post('http://' + meetingUIUrl + '/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('http://' + meetingUIUrl + '/api/todos' + id);
			}
		}
	}]);