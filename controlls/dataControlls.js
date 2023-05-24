const fs = require("fs")
var _ = require("underscore");
const Info_ovitrampas = require("../models/info_ovitrampas");
//variables
const zonasAca = fs.readFileSync('./files/acapulco_colonias.json');
let jsonZonaAca = JSON.parse(zonasAca); 
async function loadColonias(req, res) { 
    let rawdata = fs.readFileSync('./files/nom_id_colonias.json');
    let nom_col = JSON.parse(rawdata);
    let ordJson = nom_col.nombres_col.sort(GetSortOrder("nombre_colonia"));
    res.send(ordJson);
    //res.render('ajax', { zonasT: ordJson });
}
async function getColJSON(req, res) {
    console.log("rgetZonaArraygid:", req.body.gid)
    let filtrado = _.filter(jsonZonaAca.features, function (item, index) { return _.contains(jsonAarray(req.body.gid), item.id); });
    
    console.log(".." + filtrado.length)
    res.send({ zona: filtrado })
}
async function searchDat(req, res) {
    try {
        console.log("Filtrar")
        const fechas = req.body[1]
        console.log("Fechas:", fechas)
        console.log("Col:", req.body[0])
        const ovi = await Info_ovitrampas.find({
            gid: req.body[0],
            fecha: { y: fechas[0].y, m: fechas[0].m + 1, d: fechas[0].d }
        });
        console.log("Ovi", ovi.length)
        //ovi= ovi.sort(GetSortOrder("gid"));
        if (ovi.length > 0) {
            let filtrado = _.filter(jsonZonaAca.features, function (item, index) { return _.contains(jsonAarray(req.body[0]), item.id); })
            console.log("Filter:", filtrado.length)
            res.send({ zona: filtrado, ovi: ovi })
        } else {
            res.send({ zona: {}, ovi: {} })
        }
        // do something with JSON
    } catch (error) {
        console.error(error.message);
    };
}
async function interpolarDataBD(req, res) {
    console.log("Zona:", req.body.x, "gid:", req.body.gid, " FEcha:", req.body.fecha);
    //console.log("req.body.infOvi.length:", req.body.infOvi.length)
    let filtrado = _.filter(jsonZonaAca.features, function (item, index) { return _.contains(["u_territorial_colonias_inegi_2010." + req.body.gid], item.id); })
    //console.log(filtrado)
    const fecha = (req.body.fecha).split("-")
    const oviI = await Info_ovitrampas.find({
        gid: req.body.gid,
        fecha: { y: parseInt(fecha[0]), m: parseInt(fecha[1]), d: parseInt(fecha[2]) }
    });
    console.log("ovi.length:", oviI.length)
    res.send({ zona: req.body.x, ovi: oviI, infoZona: filtrado })
}
//Comparer Function    
function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}
//convertit json a un arreglo
function jsonAarray(json_) {
    let a = []
    for (let i in json_) {
        a.push('u_territorial_colonias_inegi_2010.' + json_[i])
    }
    return a;
}
module.exports = { loadColonias, getColJSON, searchDat, interpolarDataBD }