console.log("Variables.js")
//Marcadores para los puntos de csv o bd
var markers = [] //new Array(); 
var groupMakers = L.layerGroup(markers);
var markersCSV = [];
var groupMakersCSV = L.layerGroup(markersCSV);
var groupCircleCSV = L.layerGroup(markersCSV);
var circlesCSV = [];
//variables para los datos descriptivos
var nombres_de_colonias = []
var cantidad_h_de_cada_colonia = []
var cantidad_ovi_de_cada_colonia = []
var gid_de_cada_colonnia = [];

///Ventana de Error
// $(document).on("click",function(e) { 
//        var container = $("#divError"); 
//           if (!container.is(e.target) && container.has(e.target).length === 0) { 
//             alert("Aocurrido un ERROR")
//             ///document.getElementById("divError").style.display="none";         
//           }
//    });
function closeVerror() {
    document.getElementById("divError").style.display = "none";
}

function createVError(msg) {
    document.getElementById("divError").style.display = "";
    document.getElementById("msg").innerHTML = "<h3 style='color:black'>MENSAJE</h3><p style='font-size: 20px'>" + msg + "<p>";
}
window.dataLayer = window.dataLayer || [];

function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

gtag('config', 'OUR_GA_ID', { cookie_flags: 'SameSite=None;Secure' });