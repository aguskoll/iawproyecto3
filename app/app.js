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
'use strict';
(function(){
    //Variables de ambiente
    angular.module('library', ['ngRoute'])
        var __env = {};
        if(window){
            Object.assign(__env, window.__env);
        }
        constant('__env',__env)



        .config(['$routeProvider', function($routeProvider) {
            $routeProvider

                .when('/crearPelicula', {
                    templateUrl: 'vistas/paginas/peliculas/crear.html'
                })
                .when('/eliminarPelicula', {
                    templateUrl: 'vistas/paginas/peliculas/eliminar.html'

                })
                .otherwise({
                        redirectTo:'/index.html'
                    }
                )
        }])

            .controller('MoviesController', ['$http', '$log', '__env', function($http,$log,__env){

            var pelis = this;
            this.peliculas =  [ ];
            this.seleccionada = 0;

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

            this.selectFilm = function (seleccionada) {
                this.seleccionada = seleccionada;
            };

    }])

    .controller('SelectionController',function(){

    })


    
})();

