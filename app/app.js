
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

    app.controller('MoviesController', ['$http', '$log', function($http,$log){

        var pelis = this;
        this.peliculas =  [ ];
        this.seleccionada = null;

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
            $log.log(seleccionada);
            this.seleccionada = seleccionada;
        };

        this.haySeleccionada = function () {
            return this.seleccionada != null;
        };

    }]);

    app.controller('ShowController',function(){
        this.clave ='';
        this.invertir = false;

        this.ordenar = function (clave){
            //$log.log(clave);
            this.clave = clave;
            this.invertir = !this.invertir;
        };

        this.linkIsSelected = function (clave) {
            return this.clave == clave;
        };

        this.getClave = function () {
            return this.clave;
        };

        this.getInvertir = function () {
            return this.invertir;
        };
    });


 

    app.controller('CrearPeliculas', ['$http','$scope','$log',function ($http,$scope,$log) {

        var crear=this;

        //inicializo un objeto en los datos de formulario
        crear.pelicula = {};
        crear.addPelicula = function(){
            console.log('entre a crear'+crear.pelicula);
            $http.post(urlServer+'/api/movies', crear.pelicula).success(function(res){
                console.log(res);

            });
        };

        $scope.cambio=function(){

            // var titulo = $scope.tituloPelicula;
            var titulo=crear.pelicula.title;
            var  peliculaReferencia={};

            var url = "http://www.omdbapi.com/?t=" +
                titulo +
                "&y=&plot=short&r=json";
            console.log("url a buscar " + url);

            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                $log.log(response.data.Title);
                $scope.peliculaReferencia=response.data;
            }, function errorCallback(response) {
                $log.log(response);
            });

        };
        $scope.status = '  ';

        $scope.showAlert = function(ev) {
            window.alert("pelicula creada");
        }
    }]);

})();

