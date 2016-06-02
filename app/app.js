/*'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);*/
(function(){
    //Variables de ambiente
    var __env = {};
    if(window){
        Object.assign(__env, window.__env);
    }

    var app = angular.module('library', [ ]);
    app.constant('__env',__env);

    app.controller('MoviesController', ['$http', '$log', '__env', function($http,$log,__env){

        var pelis = this;
        this.peliculas =  [ ];

        $http({
            method: 'GET',
            url: __env.apiUrl + '/api/movies'
        }).then(function successCallback(response) {
            $log.log(response.data);
            pelis.peliculas = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    }]);


})();

