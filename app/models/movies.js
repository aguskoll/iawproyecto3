var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var movieSchema = new Schema({
    title:    String ,
    fecha:    Date ,
    directores: [String ],
    actores:  [String],
    sinopsis: String,
    duracion:   Number,
    calificaciones: Number,
    valoracion: Number,
    refe: [Schema.Types.ObjectId],
    referencias:  [String]
});

module.exports = mongoose.model('Movies', movieSchema);