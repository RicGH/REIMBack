var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tipoContenedorSchema = new Schema({
  tipo: { type: String },
  descripcion: { type: String },
}, { collection: 'tiposContenedor' });

module.exports = mongoose.model('TipoContenedor', tipoContenedorSchema);