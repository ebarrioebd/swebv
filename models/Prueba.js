const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ZonasGeo = new Schema({
    type: String,
    geometry: {
        type: String,
        cordinates: Array
    },
    geometry_name: String,
    properties: {
        gid: Number,
        cvegeoedo: String,
        cvegeomuni: String,
        cve_mun: String,
        nom_col: String,
        clasifica: Number,
        cod_post: String,
        otros_cp: String,
        control: Number,
        id: Number
    }
});
module.exports = mongoose.model("ZonasGeo", ZonasGeo)