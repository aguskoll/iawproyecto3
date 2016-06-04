

  'use config/env.js';

  var urlServer=getUrlServer();
  (function(){
      var app=angular.module('ModuloCrearPelicula',[]);
    /*
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
    */
console.log('entre al modulo crear ');
      })();