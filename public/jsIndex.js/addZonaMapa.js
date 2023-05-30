/**
 * 
 * Agrega los colonias al mapa
 * 
 */
//remplace//console.log("addZonaMap.js")
var geoZona = [];
var geoZona2 = [];

function setColor(v) {
    return v >= 0 && v <= 14 ? "#1bbc0e" : v > 14 && v <= 28 ? "#6cbc0e" : v > 28 && v <= 42 ? "#b1bc0e" : v > 42 && v <= 56 ? "#bcb90e" : v > 56 && v <= 70 ? "#c0840e" : v > 70 && v <= 84 ? "#c0520e" : v > 84 && v <= 100 ? "#c02d0e" : "";
}
function onEachFeature(feature, layer) {
    //+feature.properties.nom_col,feature.properties.gid,document.getElementById("fecha1").value+"
    //remplace//console.log("OnEachFeature  : : ", feature.properties.nom_col, feature.properties.gid)
    layer.bindPopup(`<div  id="popup">
        <div id="name_col"><strong>${feature.properties.nom_col}</strong></div> 
        Acapulco
        <div style="margin: 5px;">
            <div id="div_pop">Porcentaje de Ovitrampas Positivas</div>
            <div id="num_pop">
                <div id="num_porcent" style="width:${feature.cant}%; background:${setColor(feature.cant)}">${feature.cant}%</div>
            </div>
        </div> 
        <button id="mapaCalor" onclick="mapaCalor('${feature.properties.nom_col}','${feature.properties.gid}','','${feature.type_dat}','kriging')" class="button-30" role="button">Interpolación Kriging Ordinario</button>
        <button id="mapaCalor" onclick="mapaCalor('${feature.properties.nom_col}','${feature.properties.gid}','','${feature.type_dat}','idw')" class="button-30" role="button">Interpolación IDW</button>
    </div>`);
    //layer.bindPopup("<button onClick='mapaCalor(\"" + feature.properties.nom_col + "\",\"" + feature.properties.gid + "\",\"" + document.getElementById("fecha1").value + "\",\"" + feature.type_dat + "\")'>Crear Mapa de Calor</button><p>" + "Acapulco " + '</hp><p>colonia : ' + feature.properties.nom_col + '</p><p>Porcentaje de Ovitrampas Positivas:<strong>' + feature.cant + "%</strong></p>");
}
function style(feature) { return { fillColor: setColor(feature.cant), fillOpacity: 0.4, weight: 3, color: setColor(feature.cant) } }
//guarda las coord del csv que no tengan zona, para crear una caja como zona;

function createZonaBBOX(gidEnBD) {//crea ua caja para los puntos seleccionado 
    var geoJSON_CSV_collection = [];
    // geoJSON_CSV_collection = []//vacia las zonas creadas para reiniciar.
    //remplace//console.log("CREANDO CAJA....");
    //remplace//console.log("puntos_OVI::", data_ovi_csv, gidEnBD)
    for (var i = 0; i < data_ovi_csv.length; i++) {
        //remplace//console.log(gidEnBD.indexOf((data_ovi_csv[i][0].gid), gidEnBD, " ____ E ___" + data_ovi_csv[i][0].gid))
        if (gidEnBD.indexOf((data_ovi_csv[i][0].gid).toString()) == -1) {
            //var puntosCSV_zona_bbox = [];
            let xlat = [], ylong = []
            for (var j = 0; j < data_ovi_csv[i].length; j++) {
                xlat[j] = parseFloat(data_ovi_csv[i][j].latitud)
                ylong[j] = parseFloat(data_ovi_csv[i][j].longitud)
                //puntosCSV_zona_bbox.push([puntos_OVI[i][j].longitud, puntos_OVI[i][j].latitud]);
            }
            //remplace//console.log(xlat, ylong)
            let tS = 0.001
            let xmax = Math.max(...xlat) + tS
            let xmin = Math.min(...xlat) - tS
            let ymax = Math.max(...ylong) + tS
            let ymin = Math.min(...ylong) - tS
            //remplace//console.log(xmax, xmin)
            //remplace//console.log(ymax, ymin)
            if (xlat.length > 1) {
                /******var lineCoord = turf.lineString(puntosCSV_zona_bbox);//transforma puntos en una linea
                var bbox = turf.bbox(lineCoord);//obtiene un cuadro delimitador de una feature
                //remplace//console.log("box", bbox)
                //remplace//console.log(bbox);
                var bboxPolygon = turf.bboxPolygon(bbox);//toma un bbox y genera un poligono
                bbox = turf.bbox(turf.transformScale(bboxPolygon, 1.3));*****/
                geoJSON_CSV_collection.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates":
                            [[
                                [[ymin, xmin], [ymax, xmin], [ymax, xmax], [ymin, xmax], [ymin, xmin]]
                                //[[bbox[0], bbox[1]], [bbox[2], bbox[1]], [bbox[2], bbox[3]], [bbox[0], bbox[3]], [bbox[0], bbox[1]]]
                            ]]
                    },
                    "properties": {
                        "gid": data_ovi_csv[i][0].gid,
                        "nom_col": data_ovi_csv[i][0].nom_col
                    },
                    "type_dat": "type_csv_no_zona"
                });
            }
        } else {

        }
    }//fin for 
    //remplace//console.log("geoJSON_CSV_collection::", geoJSON_CSV_collection);
    return geoJSON_CSV_collection;
};
function createZ(a, b) {
    var z = [];
    for (var i = 0; i < a.length; i++) {
        z.push(a[i])
    }
    for (var i = 0; i < b.length; i++) {
        z.push(b[i]);
    }
    return z;
}
var zonaGeneral = []
function addZonaSelect(zona_, pop, type_dat, gids) {//funcion que agrega las zonas al mapa 
    //remplace//console.log("ZONA_____", zona_)
    var zona_aux = []
    var gidEnBD = [];//guarda las gid que si estan en la base de datos(file.json)
    //zona_aux=zona_;
    for (var i = 0; i < zona_.length; i++) {
        gidEnBD.push("" + zona_[i].properties.gid);
    }
    if (zona_.length < gids.length) { /// if(zona_.length != gids.length){ Dillexia
        //zona_=createZonaBBOX(gidEnBD);
        zona_aux = createZonaBBOX(gidEnBD);//zona_aux_ cajas como zonas
    }
    //remplace//console.log("zona_aux ::", zona_aux)
    geoJSON_CSV_collection = zona_aux;
    for (var i = 0; i < zona_.length; i++) {
        zona_[i].type_dat = type_dat;
    }
    zonaGeneral = createZ(zona_aux, zona_);
    //remplace//console.log(" zonaGeneral:::", zonaGeneral)
    for (var i = 0; i < pop.gid.length; i++) {
        for (var j = 0; j < zonaGeneral.length; j++) {
            if (zonaGeneral[j].properties.gid == pop.gid[i]) {
                zonaGeneral[j].cant = pop.pop[i];
            }
        }
    }
    map.removeLayer(geoZona);
    //setColorZona csv 
    //setZonaBD
    geoZona = L.geoJson({ type: "FeatureCollection", features: zonaGeneral }, { style: style, onEachFeature: onEachFeature })
    geoZona.addTo(map);
    map.setView(new L.LatLng(zonaGeneral[0].geometry.coordinates[0][0][0][1], zonaGeneral[0].geometry.coordinates[0][0][0][0]));
}
function getZonas(zona, pop, type_dat) {//obtiene las zonas segun su gid
    let json = zona// {...zonas}; 
    //remplace//console.log("ZONA:", zona)
    fetch("/getZona", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            {
                gid: json
            })
    })
        .then(res => res.json())
        .then(data => {
            if (data.zona.length == 0) {
                try {
                    addZonaSelect(data.zona, pop, "type_csv_no_zona", json)//agrega las zonas al mapa 
                } catch (err) {
                    alert("Error al Generar Zona");
                    //remplace//console.log("Err:", err)
                }
            } else {
                try {
                    addZonaSelect(data.zona, pop, type_dat, json)//agrega las zonas al mapa
                } catch (err) {
                    alert("Error al Obtener Zona");
                    //remplace//console.log("Err:", err)
                }
            }

        }).catch(function (error) {
            //remplace//console.log('Hubo un problema con la petición Fetch:' + error.message);
        });

}