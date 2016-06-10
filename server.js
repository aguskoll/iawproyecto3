var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

var jwt    = require('jsonwebtoken');
var config = require('./app/js/config/config');

mongoose.connect(config.database, function(err, res) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    }else{
        console.log('conecte');
    }
});


app.set('claveSecreta', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(function (req,res,next) {
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
});

// Import Models and controllers
var models     = require('./app/models/movies')(app, mongoose);
var moviesCtrl = require('./app/controllers/movies');
var User   = require('./app/models/user');

var router = express.Router();

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

                                            /*AUTENTICACION*/
app.get('/setup', function(req, res) {

    // create a sample user
    var nick = new User({
        name: 'Nick Rivera',
        password: 'imDoctor',
        admin: true
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

// API AUTENTICATION ROUTES -------------------

// route to authenticate a user (POST http://localhost:3000/api/authenticate)
movies.post('/authenticate', function(req, res) {

    // bucar usuario
    User.findOne({
        name: req.body.name
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Error de autenticacion, contraseña o usuario erroneo' });
        } else if (user) {

            // chequeo de contraseña
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Error de autenticacion, contraseña o usuario erroneo' });
            } else {
                //Creo el token
                var token = jwt.sign(user, app.get('claveSecreta'), {
                    expiresIn: 120 //Valido por 2 horas
                });

                //Retorno informcacion y token
                res.json({
                    success: true,
                    message: 'Autenticacion correcta',
                    token: token
                });
            }

        }

    });
});


// route middleware
movies.use(function(req, res, next) {

    //Busco el token en los parametros o header
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //Decodifico el token
    if (token) {
        jwt.verify(token, app.get('claveSecreta'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'No puedo autenticar el token, es trucho o expiro' });
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'Falto el token'
        });

    }
});

// route to show a random message (GET http://localhost:8080/api/)
movies.get('/index', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
movies.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});