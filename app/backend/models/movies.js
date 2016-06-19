var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var movieSchema = new Schema({
    title:    String ,
    fecha:    String ,
    directores: [String ],
    actores:  [String],
    sinopsis: String,
    duracion:   String,
    calificaciones: Number,
    valoracion: Number,
    refe: [Schema.Types.ObjectId],
    referencias:  [String],
    urlFoto:String
});

module.exports = mongoose.model('Movies', movieSchema);