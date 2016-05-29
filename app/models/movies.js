var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var movieSchema = new Schema({
    title:    { type: String },
    fecha:     { type: Date },
    directores:  { type: Array },
    actores:  { type: Array },
    sinopsis:  { type: String },
    duracion:   {type: Number},
    calificaciones: {type: Number},
    valoracion: {type: Number},
    ref: [Schema.Types.ObjectId],
    referencias: {type: Array }
});

module.exports = mongoose.model('movie', movieSchema);