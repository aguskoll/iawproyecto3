
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
        }]);

    app.controller('MoviesController', ['$http', '$log', '$scope', function($http,$log,$scope){

            var pelis = this;
            this.peliculas =  [ ];
            this.seleccionada = null;
            this.clave ='';
            this.invertir = false;

            $scope.filtroSeleccionado = 'title';

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

            this.ordenar = function (clave){
                $log.log(clave);
                this.clave = clave;
                this.invertir = !this.invertir;
            };

            this.getClave = function () {
                return this.clave;
            };

            this.getInvertir = function () {
                return this.invertir;
            };

            this.linkIsSelected = function (clave) {
                return this.clave == clave;
            };


            this.selectFilm = function (seleccionada) {
                $log.log(seleccionada);
                this.seleccionada = seleccionada;
            };

            this.haySeleccionada = function () {
                return this.seleccionada != null;
            };

            $scope.cambiarFiltro = function(){

              $log.log($scope.filtroSeleccionado);
            };

    }]);

    app.controller('SelectionController',function(){

    });


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

