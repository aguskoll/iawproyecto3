
'use config/env.js';

(function(){
    var urlServer=getUrlServer();
    //Variables de ambiente
   var app= angular.module('library', ['ngRoute','angularUtils.directives.dirPagination','ui.bootstrap']);

    app.config(['$routeProvider', '$httpProvider',function($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('myInterceptor');

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

        this.selectFilm = function (seleccionada) {
            $log.log(seleccionada);
            $http({
                method: 'GET',
                url: urlServer + '/api/movie/'+seleccionada
            }).then(function successCallback(response) {
                pelis.seleccionada  = response.data;
                pelis.rate = pelis.seleccionada.valoracion;
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
                crear.pelicula.sinopsis=response.data.Plot;
                crear.pelicula.directores=response.data.Director;
                crear.pelicula.actores=response.data.Actors;
                crear.pelicula.duracion=response.data.Runtime;
                crear.pelicula.fecha=response.data.Year;
            }, function errorCallback(response) {
                $log.log(response);
            });

        };


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
    //---face
    app.run(['$rootScope', '$window',
        function($rootScope, $window) {

            $rootScope.user = {};

            $window.fbAsyncInit = function() {
                // Executed when the SDK is loaded

                FB.init({

                    appId: '501245940060729',

                    /*
                     Adding a Channel File improves the performance
                     of the javascript SDK, by addressing issues
                     with cross-domain communication in certain browsers.
                     */

                    channelUrl: 'app/channel.html',

                    /*
                     Set if you want to check the authentication status
                     at the start up of the app
                     */

                    status: false,

                    /*
                     Enable cookies to allow the server to access
                     the session
                     */

                    cookie: true,

                    /* Parse XFBML */

                    xfbml: true
                });

//                sAuth.watchAuthenticationStatusChange();

            };

            (function(d){
                // load the Facebook javascript SDK

                var js,
                    id = 'facebook-jssdk',
                    ref = d.getElementsByTagName('script')[0];

                if (d.getElementById(id)) {
                    return;
                }

                js = d.createElement('script');
                js.id = id;
                js.async = true;
                js.src = "//connect.facebook.net/en_US/all.js";

                ref.parentNode.insertBefore(js, ref);

            }(document));

        }]);

    watchLoginChange = function() {

        var _self = this;

        FB.Event.subscribe('auth.authResponseChange', function(res) {

            if (res.status === 'connected') {

                /*
                 The user is already logged,
                 is possible retrieve his personal info
                 */
                _self.getUserInfo();

                /*
                 This is also the point where you should create a
                 session for the current user.
                 For this purpose you can use the data inside the
                 res.authResponse object.
                 */

            }
            else {

                /*
                 The user is not logged to the app, or into Facebook:
                 destroy the session on the server.
                 */

            }

        });

    }
    getUserInfo = function() {

        var _self = this;

        FB.api('/me', function(res) {
            $rootScope.$apply(function() {
                $rootScope.user = _self.user = res;
            });
        });

    }
    logout = function() {

        var _self = this;

        FB.logout(function(response) {
            $rootScope.$apply(function() {
                $rootScope.user = _self.user = {};
            });
        });

    }


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

