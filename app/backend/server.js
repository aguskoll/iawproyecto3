var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

var jwt    = require('jsonwebtoken');
var config = require('./../js/config/config');
var request = require('request');

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
    res.header('Access-Control-Allow-Headers','X-Requested-With,content-type, Authorization');
    next();
});

// Import Models and controllers
var votos   = require('./models/votos');
var models     = require('./models/movies')(app, mongoose);
var moviesCtrl = require('./controllers/movies');
var User   = require('./models/user');
var router = express.Router();

app.use(router);

// API routes
var movies = express.Router();
var user = express.Router();

//Ruta para el usuario
user.put('/movie/calificate/:id',ensureAuthorizedUser);
user.route('/movie/calificate/:id').put(moviesCtrl.calificateMovie);
app.use('/user',user);

//comentari para sacar autorizacion

movies.put('/movie/:id',ensureAuthorized);
movies.delete('/movie/:id',ensureAuthorized);
movies.post('/movies',ensureAuthorized);

movies.route('/movies')
    .get(moviesCtrl.findAllMovies)
    .post(moviesCtrl.addMovie);

movies.route('/movie/:id')
    .get(moviesCtrl.findById)
    .put(moviesCtrl.updateMovie)
    .delete(moviesCtrl.deleteMovie);

movies.route('/movies/relacionadas/:id')
    .get(moviesCtrl.buscarRelacionadas);

app.use('/api', movies);

app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});

// route to authenticate a user (POST http://localhost:3000/api/authenticate)
movies.post('/authenticate', function(req, res) {
    // bucar usuario
    User.findOne({
        username: req.body.username
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
                    expiresIn: "24h" //Valido por 24 horas
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

function ensureAuthorized(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers["authorization"];

    //Decodifico el token
    if (token) {
        jwt.verify(token, app.get('claveSecreta'), function(err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: err,
                });
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
}

function ensureAuthorizedUser(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers["authorization"];

    //Decodifico el token
    if (token) {
        request('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+token, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                req.decoded = body;
                next();
            }else{
                return res.status(403).send({
                    success: false,
                    message: error,
                });
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'Falto el token'
        });

    }
}
// route to return all users (GET http://localhost:8080/api/users)
movies.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});


app.get('/setup', function(req, res) {

    // create a sample user
    var nick = new User({
        username: 'admin',
        password: 'admin',
        admin: true
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});
