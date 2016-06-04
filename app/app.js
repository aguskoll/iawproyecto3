
'use config/env.js';

(function(){
    var urlServer=getUrlServer();
    //Variables de ambiente
   var app= angular.module('library', ['ngRoute']);


    app.config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/crearPelicula', {
                    templateUrl: 'vistas/paginas/peliculas/crear.html',
                     controller: 'CrearPeliculas'
                });
            $routeProvider.when('/eliminarPelicula', {
                    templateUrl: 'vistas/paginas/peliculas/eliminar.html'


                });
            $routeProvider.otherwise({
               
                        redirectTo:'/index.html'
                    }
                )
        }])

    app.controller('MoviesController', ['$http', '$log', function($http,$log){

            var pelis = this;
            this.peliculas =  [ ];
            this.seleccionada = 0;

            $http({
                method: 'GET',
                url: urlServer + '/api/movies'
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

    app.controller('SelectionController',function(){

    })


    app.controller('CrearPeliculas', ['$http',function ($http) {

         var crear=this;

         //inicializo un objeto en los datos de formulario
         crear.pelicula = {};
         crear.addPelicula = function(){
             console.log('entre a crear'+crear.pelicula);
             $http.post(urlServer+'/api/movies', crear.pelicula)
                 .success(function(res){
             console.log(res);

         });
     };

     }]);

    
})();

