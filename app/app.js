
'use config/env.js';
'use js/usuarios/google.js';
(function(){
    var urlServer=getUrlServer();
    //Variables de ambiente

   var app= angular.module('library',
       ['ngRoute','angularUtils.directives.dirPagination','ui.bootstrap']);

    app.config(['$routeProvider', '$httpProvider',
        function($routeProvider, $httpProvider) {

            $httpProvider.interceptors.push('myInterceptor');

            $routeProvider.when('/crearPelicula', {
                    templateUrl: 'vistas/paginas/peliculas/crear.html',
                     controller: 'CrearPeliculas'
                });
            $routeProvider.when('/editarPelicula', {
                    templateUrl: 'vistas/paginas/peliculas/editar.html'
                
                });
            $routeProvider.when('/index.html', {
                templateUrl: 'vistas/paginas/peliculas/listar.html'

                });
            $routeProvider.otherwise({
               
                        redirectTo:'/index.html'
                    }
                );

        }]);

    app.service('datos',function(){
        var savedData = {};
        this.set = function (data) {
            savedData = data;
        };

        this.getDatos = function() {
            return savedData;
        };

    });

    app.controller('MoviesController', ['$http', '$log','$uibModal','$scope','datos', function($http,$log,$uibModal,$scope,datos){

        var pelis = this;
        this.peliculas =  [ ];


        this.hoveringOver = function(value) {
            this.overStar = value;
        };

        this.setRating = function(valor){
            return $http.put(getUrlServer() + '/user/movie/' + pelis.seleccionada._id, {
                valoracion: valor
            });
            
        };

        $http({
            method: 'GET',
            url: urlServer + '/api/movies'
        }).then(function successCallback(response) {
            pelis.peliculas = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        this.open = function (peli) {


          var modalInstance = $uibModal.open({

                animation: true,
                templateUrl: 'vistas/paginas/peliculas/peli.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: 'modalCtrl',
                resolve: {
                    peliID: function () {
                        return peli;
                    }
                }
            });
        };

        this.save = function(id){
            console.log('guardoo'+id);
            datos.set(id);
        };
    }]);


    //Controller para el modal
    app.controller('ModalInstanceCtrl', ['$uibModalInstance','peliID','$http','$scope',function ($uibModalInstance,peliID,$http,$scope) {
        $scope.seleccionada=null;
        $scope.puedeVotar=false;
        $scope.relacionadas=null;
        var palabrasClave=new Array();
       
        $http({
            method: 'GET',
            url: urlServer + '/api/movie/'+peliID
        }).then(function successCallback(response) {
            $scope.seleccionada  = response.data;
            $scope.puedeVotar =  googleIngreso();
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

      
        this.ok = function () {
            $uibModalInstance.close();
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

            $http({
                method: 'GET',
                url: urlServer + '/api/movies/relacionadas/'+peliID
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.relacionadas=response.data;

            }, function errorCallback(response) {
                console.log("error al obetener relacionadas");
            });




    }]);

    app.controller('ShowController',function($location, $anchorScroll){
        this.clave ='';
        this.invertir = false;

        this.scrollTo = function(id) {
            $location.hash(id);
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

    app.controller('EditController', ['$http', '$scope','datos', function($http,$scope,datos){
        this.peliId = datos.getDatos();
        var editar=this;
        $scope.seleccionada = {};

        $http({
            method: 'GET',
            url: urlServer + '/api/movie/'+editar.peliId
        }).then(function successCallback(response) {
            $scope.seleccionada  = response.data;
            console.log($scope.seleccionada);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        //inicializo un objeto en los datos de formulario
        this.editPelicula = function(){
            $http.put(urlServer+'/api/movie/'+editar.peliId, $scope.seleccionada).success(function(res){
                console.log(res);
            });
        };

        this.deletePelicula = function(){
            $http({
                method: 'DELETE',
                url: urlServer + '/api/movie/'+editar.peliId
            }).then(function successCallback(response) {
                console.log('borre');
            }, function errorCallback(response) {
                console.log('error cuando borre');
            });
        };

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
                //$log.log(input);
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

    //--autenticacion

    app.factory('myInterceptor', ['auth','$log', function(auth,$log){

        var myInterceptor = {
            request: function(config) {
                var token = auth.getToken();
                if(config.url.indexOf(getUrlServer()+'/api') === 0 && token) {
                    config.headers.Authorization = token;

                };
                return config;
            },
            response: function(response) {
                if(response.config.url.indexOf(getUrlServer()+'/api/authenticate') === 0 && response.data.token) {
                    $log.log('entro ' + response.data.token);
                    auth.saveToken(response.data.token)
                };
                return response;
            }
        };

        return myInterceptor;
        /*    return {
            // automatically attach Authorization header
            request: function(config) {
                var token = auth.getToken();
                if(config.url.indexOf(getUrlServer()+'/api') === 0 && token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            },

            // If a token was sent back, save it
            response: function(res) {
                $log.log('lalsadafksfjdaskfjdsklfjdsklfasjfdaskfj');
                if(res.config.url.indexOf(getUrlServer()+'/api/authenticate') === 0 && res.data.token) {
                    $log.log('entro');
                    auth.saveToken(res.data.token);

                }

                return res;
            }
        }*/
    }]);


    app.service('user',['$http','auth',function($http,auth){
        this.getQuote = function() {
            return $http.get(getUrlServer() + '/api/me')
        };


        this.login = function(username, password) {
           return $http.post(getUrlServer() + '/api/authenticate', {
                username: username,
                password: password
            });
        }

    }]);

    app.service('auth',['$window', function($window){
        var self = this;
        this.parseJwt = function(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        };

        this.saveToken = function(token) {
            $window.localStorage['jwtToken'] = token;
        };

        this.getToken = function() {
            return $window.localStorage['jwtToken'];
        };

        this.isAuthed = function() {
            var token = self.getToken();
            if(token) {
                var params = self.parseJwt(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        };

        this.logout = function() {
            $window.localStorage.removeItem('jwtToken');
        }
    }]);


    app.controller('CrearPeliculas', ['$http','$scope','$log',function ($http,$scope,$log) {

        var crear=this;
        $scope.palabrasClave=[];

        //inicializo un objeto en los datos de formulario
        crear.pelicula = {};

        crear.addPelicula = function(){
            crear.pelicula.referencias = $scope.palabrasClave;
            $http.post(urlServer+'/api/movies', crear.pelicula).success(function(res){

            });
        };

        $scope.agregarPalabraClave=function(){

            var existe=false;
            for(var i=0;i<$scope.palabrasClave.length;i++)
                 if($scope.palabrasClave[i]==$scope.palabra)
                    existe=true;
                if(!existe)
                    $scope.palabrasClave.push($scope.palabra);


        };


        $scope.eliminarPalabraClave=function(palabra){

            var pos = $scope.palabrasClave.indexOf(palabra);
            $scope.palabrasClave.splice(pos,1);


        };


        $scope.cambio=function(){

            // var titulo = $scope.tituloPelicula;
            var titulo=crear.pelicula.title;
            var  peliculaReferencia={};

            var url = "http://www.omdbapi.com/?t=" +
                titulo +
                "&y=&plot=short&r=json";
          //  console.log("url a buscar " + url);

            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
               // $log.log(response.data.Title);
                $scope.peliculaReferencia=response.data;
                crear.pelicula.sinopsis=response.data.Plot;
                crear.pelicula.directores=response.data.Director;
                crear.pelicula.actores=response.data.Actors;
                crear.pelicula.duracion=response.data.Runtime;
                crear.pelicula.fecha=response.data.Year;

                crear.pelicula.urlFoto=response.data.Poster;
                $log.log(response);
            });

        };


        $scope.showAlert = function(ev) {
            window.alert("pelicula creada");
        }
    }]);
    app.controller('AuthController', ['user','auth',function(user, auth){
        var self = this;

        function handleRequest(res) {
            var token = res.data ? res.data.token : null;
            if(token) { console.log('JWT:', token); }
            self.message = res.data.message;
        }

        self.login = function(use,pass) {
            user.login(use, pass)
                .then(handleRequest, handleRequest)
        };

        self.getQuote = function() {
            user.getQuote()
                .then(handleRequest, handleRequest)
        };
        self.logout = function() {
            auth.logout && auth.logout()
        };
        self.isAuthed = function() {
            return auth.isAuthed ? auth.isAuthed() : false
        }

    }]);

   
})();

