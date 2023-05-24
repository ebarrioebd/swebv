function closeVariograma() {//ocultar semivariograma
    document.getElementById("id_variograma").style.display = "none";
}

function showVariograma() {//mostrar semivariograma
    document.getElementById("id_variograma").style.display = "";
}
function crearDataSemivariograma(x,y,r){
    let dataArrBubble=[];
    dataArrBubble.push({x:0,y:0,r:r});
    for(var i=0;i<x.length;i++){
        dataArrBubble.push({x:x[i],y:y[i],r:r});
    }
    return dataArrBubble;
}
/**
 * Chart Variograma
 * 
 */
const ctxVariograma = document.getElementById("variograma").getContext("2d");
const configVariograma = {
    type: 'bubble',
    data: {
        datasets: [{
            label: 'Semivarianza',
            data: [],
            backgroundColor: 'rgb(0, 0, 255)'
        }]
    },
    options: {}
};
const chartVariograma = new Chart(ctxVariograma, configVariograma);

//obtener paramtros de la url
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
//document.getElementById("nameCol").innerHTML = "" + getParameterByName("x");
var nameCol = getParameterByName("x");
var gid = getParameterByName("gid");
var fecha = getParameterByName("fecha");
console.log(nameCol, gid, fecha);
/**
 * 
 * configuracion de mapa leafletjs
 * 
 */
var map = L.map('map').setView([16.8861548, -99.8436579] /*c*/ , 13);
L.control.scale({ metric: true, imperial: false }).addTo(map);
var maxZoom = 20,
    minZoom = 12;
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var capaOSM = new L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: minZoom,
    maxZoom: maxZoom,
    attribution: '&copy; ' + mapLink + ' Contributors',
});
var satellite = new L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    minZoom: minZoom,
    maxZoom: maxZoom,
    attribution: '&copy; ' + mapLink + ' Contributors',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
var sat_text = new L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    minZoom: minZoom,
    maxZoom: maxZoom,
    attribution: '&copy; ' + mapLink + ' Contributors',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
var roadmap = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    minZoom: minZoom,
    maxZoom: maxZoom,
    attribution: '&copy; ' + mapLink + ' Contributors',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
satellite.addTo(map);
var capasBase = {
    "roadMap": roadmap,
    "OpenStreetMap": capaOSM,
    "sat_text": sat_text,
    "satelite": satellite
};
var selectorCapas = new L.control.layers(capasBase);
selectorCapas.addTo(map);


//controles map
var interpoladoresButton = L.control({ position: 'topleft' });
var botonesControl = L.control({ position: 'bottomleft' });
var botonesControlInfo = L.control({ position: 'topright' });
const colors = ["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf", "#fee08b", "#fdae61",
    "#f46d43", "#d73027", "#a50026"
];


/*Añadir controlles para remover o agreagar los marcadores en el mapa*/
botonesControl.onAdd = function() { // creación de los botones
    var botones = L.DomUtil.create('div', 'class-css-botones');
    botones.innerHTML = `<buttom id="agregar-marcadores" class="btn btn-primary" style="background:'green'">Mostrar marcadores</buttom>`;
    botones.innerHTML += `<buttom id="remover-marcadores" class="btn btn-warning">Ocultar marcadores</buttom>`;
    return botones;
};
botonesControl.addTo(map); // adición del contenedor dentro del mapa  
document.getElementById('agregar-marcadores').addEventListener('click', function() {
    groupMakers.addTo(map)
})
document.getElementById('remover-marcadores').addEventListener('click', function() {
    groupMakers.remove();
})

interpoladoresButton.onAdd = function() {
    var botones = L.DomUtil.create('div', 'class-css-botones');
    botones.innerHTML = `<div id="id_radio">
                    <p>Interpolador</p>
                    <input type="radio" name="kriging" value="kriging" id="kriging" onClick="ck()"> Kriging <br>
                    <input type="radio" name="idw" value="idw" id="idw" onClick="cidw()"> IDW <br>
                    <!--<input type="radio" name="fbr" value="fbr" id="fbr" onClick="cfbr()" ochange="Funcion de Base Radial"> FBR </div>-->`;
    //botones.innerHTML += ``; 
    return botones;
}
interpoladoresButton.addTo(map);

document.getElementById('mostrar').addEventListener("click", function() {
    //layerGroup.addTo(map);
    imgOpaci.addTo(map);
})
document.getElementById('ocultar').addEventListener("click", function() {
    //map.removeLayer(layerGroup)
    map.removeLayer(imgOpaci);
})
//varibles  
var ovitrampas = {} //!{ JSON.stringify(ovi) }  
var zona = {} //!{ JSON.stringify(infoZona) } 
let markers = []; //marcadores: arreglo de coordenadas
var groupMakers = L.layerGroup(markers);

var imgOpaci = "",
    imgKrig = "",
    imgIDW = "";
var positions = [];
var zonaCoord = [];
var scope = new L.polyline([0, 0]);


function getC(v, rango, limit0) {
    var z = (v - limit0) / rango
    if (z < 0) { z = 0 } else if (z > 1) { z = 1 } else if (isNaN(z)) { z = 0 }
    return colors[Math.floor((colors.length - 1) * z)]
}
function inv(params) {
    //console.log("get :"+params.length)
    //console.log(params)
    let a = new Array(params.length);
    for (var i = 0; i < params.length; i++) {
        a[i] = [params[i][1], params[i][0]]
    }
    //console.log(a)
    //console.log("return :"+a.length)
    return a
}
/**
 * 
 * Añade indicador de huevos
 * 
 */
function addTablaIndicador(data) {
    var max = getMaxValor(data);
    var v1 = 0 // max[0]
    var v2 = ""
    var divRango = ""
    for (var i = 0; i < colors.length; i++) {
        v2 += "" + Math.round(v1 + 1) + "-";
        v1 += (max[1] - max[0]) / colors.length
        v2 += Math.round(v1) + ""
        divRango += "<div id='rango' style='background:" + colors[i] + "'>" + v2 + "</div>";
        v2 = ""
    }
    botonesControlInfo.onAdd = function() { // creación de los botones
        var botones = L.DomUtil.create('div', 'class-css-botones');
        botones.innerHTML += divRango
        return botones;
    };
    botonesControlInfo.addTo(map);
}

/**
 * addMarkers
 */
function addMarkers() {
    for (var i = 0; i < ovitrampas.length; i++) {
        L.circle([ovitrampas[i].latitud, ovitrampas[i].longitud], 4, { fill: true, color: "red" }).addTo(map);
        markers.push(L.marker([ovitrampas[i].latitud, ovitrampas[i].longitud], { color: "red", draggable: false, title: "Ovitrampa" + (i + 1) + ": Cantidad de Huevos : " + ovitrampas[i].cantidad_huevos }))
        //markers[i] = L.marker([ovitrampas[i].latitud, ovitrampas[i].longitud], { color: "red", draggable: false, title: "Ovitrampa" + (i + 1) + ": Cantidad de Huevos : " + ovitrampas[i].cantidad_huevos });
        markers[i].bindPopup("Ovitrampa" + (i + 1) + ": Cantidad de Huevos : " + ovitrampas[i].cantidad_huevos)
    }
    groupMakers = L.layerGroup(markers);
    groupMakers.addTo(map);
}
/**
 * Obtiene el valor maximo y minimo
 */
function getMaxValor(z) {
    console.log("getV(Z):", z)
    var d = []
    for (var i = 0; i < z.length; i++) {
        d.push(z[i].cantidad_huevos)
    }
    return [Math.min.apply(null, d), Math.max.apply(null, d)]
}
/**
 * muestra el mapa interpolado Kriging
 */
function ck() {
    map.removeLayer(imgOpaci)
    imgOpaci = imgKrig
    document.getElementById("idw").checked = false
    //document.getElementById("fbr").checked=false
    imgOpaci.addTo(map)
}
/**
 * muestra el mapa interpolado idw
 */
function cidw() {
    map.removeLayer(imgOpaci)
    imgOpaci = imgIDW
    //document.getElementById("fbr").checked=false
    document.getElementById("kriging").checked = false
    imgOpaci.addTo(map)
}
///crea una imagen con A,B como sus dimenciones
//zi arrays de valores para cada cuadro dentro
//id del canvas
function creaImagen(A, B, zi, id) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    canvas.width = 1000;
    canvas.height = 1000;
    var x0 = 0,
        y0 = 0,
        x1 = 0,
        y1 = 0;
    var k = 0;
    var max = getMaxValor(ovitrampas)
    var rango = max[1] - max[0];
    for (var i = 0; i < A; i++) {
        y0 = 0;
        y1 = 0;
        y1 = canvas.width
        y0 = y1 - (canvas.height / B)
        for (var j = 0; j < B; j++) {
            x1 = canvas.width / A
            y1 = canvas.height / B
            if (zi[k] >= 0) {
                ctx.fillStyle = getC(zi[k], rango, max[0]);
                //console.log("getC()",getC(zi[k],rango,max[0]),zi[k])
                ctx.fillRect(x0, y0, x1, y1);
            }
            //ctx.strokeRect(x0, y0, x1, y1);
            y0 -= (canvas.width / B)
            y1 -= (canvas.width / B)
            k++;
        }
        x0 += canvas.width / A
        x1 += canvas.width / A
    }
    //function returnImgae() {
    return canvas.toDataURL("image/png");
    //}
}

function closeWCSVInter() {
    document.getElementById("interpolarCSV").style.top = "";
}

function crearMapaDeCalor(zona) {
    zonaCoord = zona[0].geometry.coordinates[0]
    console.log("1")
    //console.log("zonas",zona);  
    zonaCoord[0].forEach(function(point) {
        positions.push([point[1], point[0]]);
    });
    map.removeLayer(scope);
    scope = new L.polyline(positions, {
        color: 'blue'
    }).addTo(map);
    console.log("scope::", scope)
    console.log("zonaCoord:::", zonaCoord)
    map.fitBounds(scope.getBounds());
    /**/
    var options = { units: 'meters' } //unidades con las que se trabaja metros
    var line = turf.lineString(inv(positions));
    var bbox = turf.bbox(line);
    var dcuadro = turf.distance([bbox[0], bbox[1]], [bbox[0], bbox[3]], options);
    var tamCuadro = Math.ceil(dcuadro / 100) //80
    var squareGrid = turf.squareGrid(bbox, tamCuadro, options);
    var cajaMulti = turf.bbox(squareGrid); //cuadro dlimitador del poligono 
    //propiedad centro de masa
    for (var i = 0; i < squareGrid.features.length; i++) {
        squareGrid.features[i].properties.centro = turf.centerOfMass(squareGrid.features[i]).geometry.coordinates;
    }
    map.fitBounds(scope.getBounds());
    const worker = new Worker('/interpoladoresjs/interpolar_sn_reeplace.js');
    worker.postMessage({ ovi: ovitrampas, zona: zonaCoord, squareGrid: squareGrid, cajaMulti: cajaMulti, tamCuadro: tamCuadro });
    worker.onmessage = (event) => {
        console.log("enenDAta", event.data);
        var zi = event.data.zi;
        var zidw = event.data.zidw
        var d = turf.distance([cajaMulti[0], cajaMulti[3]], [cajaMulti[2], cajaMulti[3]], {
            units: 'meters'
        });
        var d2 = turf.distance([cajaMulti[0], cajaMulti[1]], [cajaMulti[0], cajaMulti[3]], {
            units: 'meters'
        });
        var A = Math.ceil(d / tamCuadro)

        var B = Math.ceil(d2 / tamCuadro)
        if (B != zi.length / A) {
            B = zi.length / A;
            //console.log("!B")
        }
        imgKrig = L.imageOverlay(creaImagen(A, B, zi, "canvasMap", ovitrampas), [
            [cajaMulti[1], cajaMulti[0]],
            [cajaMulti[3], cajaMulti[2]]
        ], {
            opacity: 0.8
        });
        imgIDW = L.imageOverlay(creaImagen(A, B, zidw, "canvasMap", ovitrampas), [
            [cajaMulti[1], cajaMulti[0]],
            [cajaMulti[3], cajaMulti[2]]
        ], {
            opacity: 0.8
        });
        imgOpaci = imgKrig;
        //imgOpaci = imgIDW;
        document.getElementById("kriging").checked = true;
        imgOpaci.addTo(map);
        document.getElementById("VARIO_TITLE").innerHTML="Semivariograma | nugget:["+event.data.nugget+" ], Rango:[ "+event.data.rango+" ], Sill:["+event.data.sill+"]";
        chartVariograma.data.datasets[0].data=crearDataSemivariograma(event.data.h,event.data.semiva,5);
        chartVariograma.update();
        document.getElementById("imgLoading").style.display = "none";
    }
}

/**
 * obtiene la informacion desde la base de datos
 */
function getInfo() {
    fetch("/info", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                x: nameCol,
                gid: gid,
                fecha: fecha
            })
        })
        .then(res => res.json())
        .then(data => {
            ovitrampas = data.ovi; 
           
            zona = data.infoZona
            //prepareDatos();//prepara los datos antes de interpolar
            crearMapaDeCalor(zona);
            addTablaIndicador(ovitrampas);
            addMarkers();
        })
}
//Carga la informacin para generar el mapa de calorl
getInfo();