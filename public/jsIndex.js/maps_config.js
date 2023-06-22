//configuracion de mapa1
console.log("maps_config.js")
//mapa agrear capas y un selector
var map = L.map('map_c1', {
    center: [16.9077743, -99.8276894],
    zoom: 15,
});
var mapCSVInter = L.map('map_c2', {
    center: [16.9077743, -99.8276894],
    zoom: 12,
});
var maxZoom = 20, minZoom = 5;
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
//L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { minZoom: minZoom, maxZoom: maxZoom, attribution: '&copy; ' + mapLink + ' Contributors', subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }).addTo(mapCSVInter);
L.control.scale({ metric: true, imperial: false }).addTo(mapCSVInter);

var capaOSM = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: minZoom,
    maxZoom: maxZoom,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
var line = turf.lineString([[-99.8589592, 16.8926019], [-99.8388648, 16.937438],
[-99.7857949, 16.9098479], [-99.8204879, 16.8661551], [-99.8496849, 16.8822536]]);
var bbox = turf.bbox(line);
//console.log("BBox",bbox)
var urlWMS = "https://www.gits.igg.unam.mx/wmsproxy/wms?service=WMS&version=1.1.0&request=GetMap&layers=GITS:u_territorial_colonias_inegi_2010&styles=&bbox=-118.566139221191,14.4411649703979,-86.5519180297852,32.8095855712891&width=575&height=330&srs=EPSG:4326&format=image/png";
var colonias = new L.TileLayer.WMS('https://www.gits.igg.unam.mx/wmsproxy/wms', {
    layers: 'GITS:u_territorial_colonias_inegi_2010',
    format: 'image/png',
    transparent: true,
    cql_filter: "cvegeoedo==12 AND cvegeomuni==12001",
    //bbox:bbox[0]+','+bbox[1]+','+bbox[2]+','+bbox[3],
    //cql_filter:'(geom+IS+NOT+NULL+AND+l_room+IS+NOT+NULL+AND+BBOX(geom,'+bbox[0]+','+bbox[1]+','+bbox[2]+','+bbox[3]+'))',
    version: '1.1.0',
    crs: L.CRS.EPSG4326
})
var capasBase = {
    "colonias": colonias, 
    "sat_text": sat_text
};
var capasBaseCSV = {
    "colonias": colonias,
    "satelite": satellite
}
sat_text.addTo(map)

var selectorCapas = new L.control.layers(capasBase);
selectorCapas.addTo(map);

var selectorCapasCSV = new L.control.layers(capasBaseCSV)
selectorCapasCSV.addTo(mapCSVInter);
//fin de la seccion del mapa

/*Añadir controlles para remover o agreagar los marcadores en el mapa*/
botonesControl = L.control({ position: 'bottomleft' }); ////_________var gloval_________
botonesControl.onAdd = function () {                     // creación de los botones
    var botones = L.DomUtil.create('div', 'class-css-botonesMAP');
    botones.innerHTML = `<buttom id="agregar-marcadoresMAP" class="btn btn-primary" style="font-size: smaller">Mostrar marcadores</buttom>`;
    botones.innerHTML += `<buttom id="remover-marcadoresMAP" class="btn btn-warning" style="font-size: smaller">Ocultar marcadores</buttom>`;
    return botones;
};

botonesControl.addTo(map);
document.getElementById('agregar-marcadoresMAP').addEventListener('click', function () {
    console.log("AddMArker Map")
    groupMakers.addTo(map)
})
document.getElementById('remover-marcadoresMAP').addEventListener('click', function () {
    console.log("Close Markers Map")
    groupMakers.remove();
});
L.easyPrint({
    title: 'Imprimir',
    position: 'bottomright',
    hideControlContainer: false,
    sizeModes: ['A4Portrait', 'A4Landscape']
}).addTo(map);
L.easyPrint({
    title: 'Imprimir',
    position: 'bottomright',
    hideControlContainer: false,
    sizeModes: ['A4Portrait', 'A4Landscape']
}).addTo(mapCSVInter);



var latld = "";
var csvH = "latitud,longitud,gid,nom_col,cantidad_huevos,fecha\n";
var c = "";
console.log("EventClick..")
var coordZona = "[[["
mapCSVInter.on("click_", function (event) {
    coordZona += "[" + event.latlng.lng + ", " + event.latlng.lat + "],"
    //console.log("EventClick....")
    //console.log("user right-clicked on map coordinates: " + event.latlng.lat + ", " + event.latlng.lng);
    L.marker(event.latlng).addTo(mapCSVInter);
    latld = "[" + event.latlng.lat + ", " + event.latlng.lng + "]";
    //L.marker([event.latlng.lat, event.latlng.lng], { color: "red", draggable: false, title: "" + latld }).addTo(map)
    //document.getElementById("area").value += latld = "[" + event.latlng.lat + ", " + event.latlng.lng + "]" + ",";
    //console.log(latld)
    c += "" + event.latlng.lat + "," + event.latlng.lng + ",26982,CIUDAD RENACIMIENTO,,2016\n";
    console.log(csvH + c)
});
/*fin añadir controles*/