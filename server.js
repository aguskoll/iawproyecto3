var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/DB_PELICULAS', function(err, res) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    }else{
        console.log('conecte');
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
var models     = require('./app/models/movies')(app, mongoose);
var moviesCtrl = require('./app/controllers/movies');

// Example Route
var router = express.Router();
router.get('/', function(req, res) {
    res.send("Hello world!");
});

app.use(router);

// API routes
var movies = express.Router();

movies.route('/movies')
    .get(moviesCtrl.findAllMovies)
    .post(moviesCtrl.addMovie);

movies.route('/movie/:id')
    .get(moviesCtrl.findById)
    .put(moviesCtrl.updateMovie)
    .delete(moviesCtrl.deleteMovie);

app.use('/api', movies);

app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});