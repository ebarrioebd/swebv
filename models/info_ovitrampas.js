const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Info_ovitrampas = new Schema({
     latitud: Number,
     longitud: Number,
     gid: String,
     nom_col: String,
     cantidad_huevos: Number,
     fecha: {
          y: Number,
          m: Number,
          d: Number
     },
     otro: {
          type: String,
          defauld: ""
     }
});
module.exports = mongoose.model("info_ovitrampas", Info_ovitrampas)