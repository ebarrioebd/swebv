const mongoose = require("mongoose")
const Schema = mongoose.Schema

const info_promedioZona= new Schema({
    zona:String,
    pop:Number,
    fecha: {
        y: String,
        m:String,
        d:String
    }
});

module.exports = mongoose.model("info_promedioZona",info_promedioZona)