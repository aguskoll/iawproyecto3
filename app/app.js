
'use config/env.js';

(function(){
    var urlServer=getUrlServer();
    //Variables de ambiente
   var app= angular.module('library', ['ngRoute','angularUtils.directives.dirPagination']);



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
            pelis.peliculas = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        this.selectFilm = function (seleccionada) {
            $log.log(seleccionada);
            $http({
                method: 'GET',
                url: urlServer + '/api/movie/'+seleccionada
            }).then(function successCallback(response) {
                pelis.seleccionada  = response.data;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };

        this.haySeleccionada = function () {
            return this.seleccionada != null;
        };

    }]);

    app.controller('ShowController',function($location, $anchorScroll){
        this.clave ='';
        this.invertir = false;

        this.scrollTo = function(id) {
            $location.hash(id);
            console.log($location.hash());
            $anchorScroll();
        };
        
        this.ordenar = function (clave){
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

    app.filter('dinamicFilter', function($log) {

        // In the return function, we must pass in a single parameter which will be the data we will work on.
        // We have the ability to support multiple other parameters that can be passed into the filter optionally
        return function(input,categoria,filtro) {

            var out = [];
            //noinspection JSDuplicatedDeclaration
            var categoria = categoria || 'title';
            var filtro = filtro || '';
            if(filtro == '') {
                out = input;
                $log.log(input);
            }else {
                angular.forEach(input, function (peli) {
                    switch (categoria) {
                        case "actores":
                            for (var i = 0, len = peli.actores.length; i < len; i++) {
                                if (peli.actores[i].startsWith(filtro)) {
                                    out.push(peli);
                                    break;
                                }
                            }
                            break;
                        case "directores":
                            for (var i = 0, len = peli.directores.length; i < len; i++) {
                                if (peli.directores[i].startsWith(filtro)) {
                                    out.push(peli);
                                    break;
                                }
                            }
                            break;
                        default:
                            if (peli[categoria].startsWith(filtro)) {
                                out.push(peli)
                            }
                    }
                });
            }
            return out;
        }
    });
})();

