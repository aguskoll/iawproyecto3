/**
 * Created by tino on 17/06/2016.
 */
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

module.exports = mongoose.model('Votos', new Schema({
    idUsuario: String,
    idPeliculas: [String],
}));