const express = require('express');
const loadjson = express.Router();
const Info_ovitrampas = require("../models/info_ovitrampas");
const fs = require("fs");

var date = new Date();
function priDia() {
    var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
    return {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: 1
    }
}
function ultDia() {
    var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: 31
    }
}
/*Get */
loadjson.post("/promMes", async (req, res, next) => {
    console.log("diaP:", priDia())
    console.log("diaU:", ultDia())
    const ovi_mes = await Info_ovitrampas.find({
        gid: req.body.gid,
        fecha: {
            "$gte": priDia(),
            "$lte": ultDia()
        }
    })
    console.log("length:", ovi_mes.length)
    res.send({ regMes: ovi_mes })
    //res.render("404",{msg:"dp:"+priDia()+"<br>du"+ultDia()+"<br>length:"+ovi_mes.length})
});
loadjson.post("/getDatFecha", async (req, res, next) => {
    console.log("gid:", req.body.gid)
    const f1 = (req.body.f1).split("-");
    const f2 = (req.body.f2).split("-");
    const gid = req.body.gid;
    console.log("Fecha1:", f1);
    console.log("Fecha2:", f2);
    const ovi_mes = await Info_ovitrampas.find({
        gid: req.body.gid,
        fecha: {
            "$gte": { y: parseInt(f1[0]), m: parseInt(f1[1]), d: parseInt(f1[2]) },
            "$lte": { y: parseInt(f2[0]), m: parseInt(f2[1]), d: parseInt(f2[2]) }
        }
    })
    console.log("lengthOvi:", ovi_mes.length)
    res.send({ ovi: ovi_mes });
    //res.render("404",{msg:"dp:"+priDia()+"<br>du"+ultDia()+"<br>length:"+ovi_mes.length})
});
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
loadjson.get("/nada",(req,res)=>{
    res.send("<h1>NADA</h1>")
});

loadjson.get("/info_colonias_acapulco_inegi_2010", async (req, res) => {
    console.log("info_colonias_acapulco_inegi_2010")
    const infoColoniasAcapulco = fs.readFileSync('./files/nom_id_colonias1.json');
    let jsonInfoCol = JSON.parse(infoColoniasAcapulco);
    let ordColonias = jsonInfoCol.nombres_col.sort(GetSortOrder("nombre_colonia"));
    console.log("ordColonias.length::",ordColonias.length) 
    res.render("colonias_inf",{ordColonias:JSON.stringify(ordColonias)})
})


module.exports = loadjson;