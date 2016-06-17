/**
 * Created by sebalr on 29/05/16.
 */
var mongoose = require('mongoose');
var Movie  = mongoose.model('Movies');

//GET - Return all movies in the DB
exports.findAllMovies = function(req, res) {
    Movie.find(function(err, movies) {
        if(err) return res.send(500, err.message);

        console.log('GET /movies');
        res.status(200).jsonp(movies);
    });
};

//apartir de un conjunto de palaras clave retorna las relacionadas
exports.buscarRelacionadas=function(req, res) {
   var pelicula;
    Movie.findById(req.params.id, function (err, movie) {
        if (err) return res.status(500).send(err.message);
        console.log("pelicula a buscar ref: " + req.params.id);
        pelicula=movie;
    });

    Movie.find(function (err, movies) {
            if (err) return res.send(500, err.message);
            var salida = new Array();
            var suficiente=false;
        if(pelicula!=null) {
            var palabras = pelicula.referencias.toString().split(' ');
            var i = 0;

            var puntero = 0;
            for (i; i < movies.length&&!suficiente; i++) {

                var j = 0;
                var relaciona = false;
                var palabrasMovie = movies[i].referencias.toString().split(' ');
                if(pelicula.id!=movies[i].id) {
                    for (j; j < palabras.length && !relaciona; j++) {
                        var k = 0;

                        for (k; k < palabrasMovie.length && !relaciona; k++) {
                            if (palabras[j] == palabrasMovie[k]&&palabras[j]!=' ') {
                                salida[puntero] = movies[i];
                                puntero++;
                                relaciona = true;
                                console.log("agregue relacionada " + palabras[j]);
                            }
                        }
                    }
                }
                if(salida.length>3)
                    suficiente=true;
            }
            console.log('Relacionadas /movies');
        }

             res.status(200).jsonp(salida);



        });
};

//GET - Return a movie with specified ID
exports.findById = function(req, res) {
    Movie.findById(req.params.id, function(err, movie) {
        if(err) return res.status(500).send(err.message);

        console.log('GET /movie/' + req.params.id);
        res.status(200).jsonp(movie);
    });
};

//POST - Insert a new movie in the DB
exports.addMovie = function(req, res) {
    console.log('POST');
    console.log(req.body);
    if(typeof req.body.title == 'undefined' || req.body.title=='' || req.body.title==null){
        return res.status(400).send('falta el titulo');
    }
        var mov = new Movie({
            title:    req.body.title,
            fecha:    req.body.fecha,
            directores: req.body.directores,
            actores:  req.body.actores,
            sinopsis: req.body.sinopsis,
            duracion:   req.body.duracion,
            calificaciones: req.body.calificaciones,
            valoracion: req.body.valoracion,
            refe: req.body.refe,
            referencias:  req.body.referencias,
            urlFoto:req.body.urlFoto
            
    });

    mov.save(function(err, movie) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(movie);
    });
};

//PUT - Update a register already exists
exports.updateMovie = function(req, res) {
    if(typeof req.body.title == 'undefined' || req.body.title=='' || req.body.title==null){
        return res.status(400).send('falta el titulo');
    };
    Movie.findById(req.params.id, function(err, movie) {
        movie.title = req.body.title;
        movie.fecha = req.body.fecha;
        movie.directores = req.body.directores;
        movie.actores = req.body.actores;
        movie.sinopsis = req.body.sinopsis;
        movie.duracion = req.body.duracion;
        movie.calificaciones = req.body.calificaciones;
        movie.valoracion =req.body.valoracion;
        movie.refe = req.body.refe;
        movie.referencias =  req.body.referencias;

        movie.save(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).jsonp(movie);
        });
    });
};

//PUT - Update a register already exists
exports.calificateMovie = function(req, res) {
    Movie.findById(req.params.id, function(err, movie) {
        movie.calificaciones = (movie.calificaciones|| 0) +1;
        movie.valoracion =req.body.valoracion + (movie.valoracion || 0);

        movie.save(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).jsonp(movie);
        });
    });
};


//DELETE - Delete a movie with specified ID
exports.deleteMovie = function(req, res) {
    Movie.findById(req.params.id, function(err, movie) {
        movie.remove(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).send();
        })
    });
};
