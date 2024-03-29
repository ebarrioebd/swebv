//remplace//console.log("mapacalor.js")


/*Prepara mapa de calor*/
var imgOpaci = "",
    imgKrig = "",
    imgIDW = "",
    imgZonaAlta = "";
var ovitrampas;

var positions = [];
var zonaCoord = [];
var scope = new L.polyline([0, 0]);


var botonesControlCSV = L.control({ position: 'bottomleft' });
var botonesControlInfo = L.control({ position: 'topright' });
var botonesControlRango = L.control({ position: 'topleft' });
botonesControlRango.onAdd = function () { // creación de los botones
    var botones = L.DomUtil.create('div', 'class-css-botones');
    botones.innerHTML = "<div style='color: black;background:#34c234b5'>Porcentaje Bajo</div><div style='color: black;background:#d3d331b5'>Porcentaje Medio</div><div style='color: black;background:#ff0000b5'>Porcentaje Alto</div>"
    return botones;
};

botonesControlCSV.onAdd = function () { // creación de los botones
    var botones = L.DomUtil.create('div', 'class-css-botones');
    botones.innerHTML = `<buttom  id="agregar-marcadoresCSV" class="btn btn-primary" style="background:'green'">Mostrar Marcadores</buttom>`;
    botones.innerHTML += `<buttom  id="remover-marcadoresCSV" class="btn btn-warning">Ocultar Marcadores</buttom>`;
    return botones;
};
botonesControlCSV.addTo(mapCSVInter); // adición del contenedor dentro del mapa
const colors = ["#0f99dd", "#35bbdd", "#68dca7", "#e3f46c", "#fcfd61", "#fecf4f", "#fea43d", "#fa4815", "#fa4815"];

function inv(params) {
    ////remplace//console.log("get :"+params.length)
    ////remplace//console.log(params)
    let a = new Array(params.length);
    for (var i = 0; i < params.length; i++) {
        a[i] = [params[i][1], params[i][0]]
    }
    ////remplace//console.log(a)
    ////remplace//console.log("return :"+a.length)
    return a
}

function getMaxValor(z) {
    ////remplace//console.log("getV(Z):",z)
    var d = []
    for (var i = 0; i < z.length; i++) {
        d.push(z[i].cantidad_huevos)
    }
    return [0, Math.max.apply(null, d)]
    //return [Math.min.apply(null, d), Math.max.apply(null, d)]
};

function getC(v, maximo) {
    var z = v / maximo
    if (z < 0) { z = 0 } else if (z > 1) { z = 1 } else if (isNaN(z)) { z = 0 }
    return colors[Math.floor((colors.length - 1) * z)]
}
//correlacio
function V(mD, z, wij, pZ) {
    var S1 = 0
    var s2_0 = 0
    var s2_1 = 0
    var S2 = 0
    var s3_0 = 0
    var s3_1 = 0
    var S0 = 0
    var s1_0 = 0
    var s1_1 = 0
    var N = z.length
    for (var i = 0; i < z.length; i++) {
        s1_0 = 0
        s2_0 = 0
        s2_1 = 0
        for (var j = 0; j < z.length; j++) {
            S0 += wij[i][j]
            s1_0 += Math.pow(wij[i][j] + wij[j][i], 2)
            s2_0 += wij[i][j]
            s2_1 += wij[j][i]

        }
        s1_1 += s1_0
        S2 += Math.pow(s2_0 + s2_1, 2)
        s3_0 += Math.pow(z[i] - pZ, 4) //*(1/N)
        s3_1 += Math.pow(z[i] - pZ, 2)
    }
    S1 = (1 / 2) * s1_1
    //remplace//console.log("S0:", S0)

    var D = s3_0 / Math.pow(s3_1, 2)
    var A = N * ((Math.pow(N, 2) - 3 * N + 3) * S1 - N * S2 + 3 * Math.pow(S0, 2))
    var B = D * ((Math.pow(N, 2) - N) * S1 - 2 * N * S2 + 6 * Math.pow(S0, 2))
    var C = (N - 1) * (N - 2) * (N - 3) * Math.pow(S0, 2)
    var EI2 = (A - B) / C
    var EI = (-1) / (N - 1)
    var varianza = EI2 - Math.pow(EI, 2)
    //remplace//console.log("EI:", EI, "EI2:", EI2, "varianza:", varianza)
    return varianza

}

function correlacio(mD, z) {
    var pZ = 0;
    var E = (-1) / (z.length - 1)
    var wij = Array(z.length).fill(0).map(() => Array(z.length).fill(0));
    for (var i = 0; i < z.length; i++) {
        pZ += z[i][0];
    };
    pZ /= z.length; //promedio o media
    var sW = 0;
    var sWVAR_X = 0,
        sVAR2 = 0;
    for (var i = 0; i < z.length; i++) {
        for (var j = 0; j < z.length; j++) {
            if (i !== j) {
                wij[i][j] = (1 / mD[i][j]);
                sW += wij[i][j];
                sWVAR_X += (wij[i][j] * (z[i] - pZ)) * (z[j] - pZ);
            } else {
                wij[i][j] = 0;
            }
        }
        sVAR2 += Math.pow(z[i] - pZ, 2);
    };
    var Imoran = ((z.length) * sWVAR_X) / (sW * sVAR2);
    //remplace//console.log("Imoran:", Imoran)
    //remplace//console.log("pZ:", pZ);
    //remplace//console.log("E:", E)
    var Varianza = V(mD, z, wij, pZ)
    var z_score = (Imoran - E) / Math.sqrt(Varianza)
    //remplace//console.log("Z-score:", z_score)

}
///crea una imagen con A,B como sus dimenciones
//zi arrays de valores para cada cuadro dentro
//id del canvas

function creaImagen(A, B, zi, id, imgOpcion) {//imgOpcion=imgZonaAlta
    var mayorDato = imgOpcion === "imgZonaAlta" ? 5 * (data_ovi_max / colors.length) : 0;
    console.log("MAyorDato:: ", mayorDato)
    //remplace//console.log("A:", A, "B::", B)
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    canvas.width = 1000;
    canvas.height = 1000;
    var x0 = 0,
        y0 = 0,
        x1 = 0,
        y1 = 0;
    var k = 0;
    //remplace//console.log("Est_Des_Data.data_max:::", Est_Des_Data.data_max)
    var max = data_ovi_max //getMaxValor(ovitrampas);
    for (var i = 0; i < A; i++) {
        var aumentI =0.3; //-0.8
        y0 = 0;
        y1 = 0;
        y1 = canvas.width
        y0 = y1 - (canvas.height / B)
        for (var j = 0; j < B; j++) {
            x1 = canvas.width / A
            y1 = canvas.height / B
            if (zi[k] !== (-1) && zi[k] >= mayorDato) {
                ctx.fillStyle = getC(zi[k], max);
                ctx.fillRect(x0 - aumentI, y0 - aumentI, x1 + 2 * aumentI, y1 + 2 * aumentI);
                //ctx.arc((x0+x1)/2, (y0+y1)/2, (canvas.width/A)/2 , 0,Math.PI * 2);
                //ctx.stroke();
                //ctx.strokeRect(x0, y0, x1, y1);
                //ctx.lineWidth = 0.5;
            }
            //ctx.strokeRect(x0, y0, x1, y1);
            y0 -= (canvas.width / B)
            y1 -= (canvas.width / B)
            k++;
        }
        x0 += canvas.width / A
        x1 += canvas.width / A
    }

    return canvas.toDataURL("image/png");

}

function closeWCSVInter() {
    document.getElementById("interpolarCSV").style.top = "";
    document.getElementById("ventana_seleccionar_p").style.display = "none";
}

function ck() {
    mapCSVInter.removeLayer(imgOpaci)
    imgOpaci = imgKrig
    document.getElementById("idw").checked = false
    //document.getElementById("fbr").checked=false
    imgOpaci.addTo(mapCSVInter)
}

function cidw() {
    mapCSVInter.removeLayer(imgOpaci)
    imgOpaci = imgIDW
    //document.getElementById("fbr").checked=false
    document.getElementById("kriging").checked = false
    imgOpaci.addTo(mapCSVInter)
}

function updateOpacity(value) {
    imgOpaci.remove()
    imgOpaci = L.imageOverlay(returnImgae(), imageBounds, {
        opacity: value
    }).addTo(mapCSVInter);
}

function inv(params) {
    ////remplace//console.log("get :"+params.length)
    ////remplace//console.log(params)
    let a = new Array(params.length);
    for (var i = 0; i < params.length; i++) {
        a[i] = [params[i][1], params[i][0]]
    }
    ////remplace//console.log(a)
    ////remplace//console.log("return :"+a.length)
    return a
}

function addTablaIndicador(data) {
    var max = data_ovi_max //getMaxValor(data);
    var v1 = 0;
    var v2 = "";
    var divRango = "<div class='col-md-12'  style='color: black;font-family: revert;background: whitesmoke;'>Densidad de Mosquitos</div>";
    for (var i = 0; i < colors.length; i++) {
        v2 += "" + Math.round(v1) + "-";
        v1 += (max) / colors.length
        v2 += Math.round(v1) + ""
        if (i == 0) {
            divRango += "<div class='col-md-2' id='rango' style='color:black;background:" + colors[i] + "'></div><div id='n_rango' class='col-md-10' >Muy Bajo " + v2 + "</div>";
        } else if (i == 2) {
            divRango += "<div class='col-md-2'  id='rango' style='color:black;background:" + colors[i] + "'></div><div id='n_rango' class='col-md-10'>Bajo " + v2 + "</div>";
        } else if (i == 4) {
            divRango += "<div class='col-md-2'  id='rango' style='color:black;background:" + colors[i] + "'></div><div id='n_rango' class='col-md-10'>Medio " + v2 + "</div>";
        } else if (i == 6) {
            divRango += "<div class='col-md-2'  id='rango' style='color:black;background:" + colors[i] + "'></div><div id='n_rango' class='col-md-10'>Alto " + v2 + "</div>";
        } else if (i == 8) {
            divRango += "<div class='col-md-2'  id='rango' style='color:black;background:" + colors[i] + "'></div><div id='n_rango' class='col-md-10'>Muy Alto " + v2 + "</div>";
        } else {
            divRango += "<div class='col-md-2'  id='rango' style='color:black;background:" + colors[i] + "'></div><div id='n_rango' class='col-md-10'></div>";
        }
        //divRango += "<div id='rango' style='color:black;background:" + colors[i] + "'>" + v2 + "</div>";
        v2 = "";
    }
    botonesControlInfo.onAdd = function () { // creación de los botones
        var botones = L.DomUtil.create('div', 'class-css-botones');
        //botones.style.width=22+"%"
        botones.innerHTML += "<div class='row' style='width: 200px;'>" + divRango + "</div>"
        return botones;
    };
    botonesControlInfo.addTo(mapCSVInter);
}
//crea datos para chartbubble crearDatoSemivariograma(x,y,r)
function crearDataSemivariograma(x, y, r) {
    let dataArrBubble = [];
    dataArrBubble.push({ x: 0, y: 0, r: r });
    for (var i = 0; i < x.length; i++) {
        dataArrBubble.push({ x: x[i], y: y[i], r: r });
    }
    return dataArrBubble;
}
//funcion de error en el worker
function onError(e) {
    //remplace//console.log('ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message)
    document.getElementById("imgLoading").style.display = "none";
    document.getElementById("interpolarCSV").style.display = "none";
    createVError(['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join(''))
    //alert(['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join(''))
}
//variograma Exponencial Teorico
function modelExp(h, a, m_s) {
    switch (m_s) {
        case "exp":
            return (1.0 - Math.exp(-3 * (h / a))) //exponecial
            break;
        case "gauss":
            return (1.0 - Math.exp(-3 * Math.pow(h / a, 2))) //gaussiano
            break
        case "esf":
            return h > a ? 1 : ((3 / 2) * (h / a) - (1 / 2) * Math.pow(h / a, 3)) //esferico
            break
    }
}

//genera valores del variograma teorico que se ha ajustado
function dataVT(nugget, sillPartial, rango, model_semi) {
    var distRange = chartVariograma.data.datasets[0].data[chartVariograma.data.datasets[0].data.length - 1].x
    //remplace//console.log("distRange::::", distRange)
    var x = []; //h
    var y = []; //variogramas teorico
    var cantP = 200
    var aument = distRange / cantP
    for (var i = 1; i < cantP + 1; i++) {
        y[i] = nugget + sillPartial * modelExp(i * aument, rango, model_semi) // vt(nugget, sillPartial, rango, i * aument,model_semi);
        x[i] = i * aument;
    }
    return [y, x]
}
//funcion crea puntos para la grafica del variograma Experimental
function createDP(x, y) {
    let points = []
    for (let i = 0; i < x.length; i++) {
        points.push({ x: x[i], y: y[i], r: 5 })
    }
    return points
}

function createDPX(x) {
    let Y = []
    let X = []
    for (let i = 0; i < x.length; i++) {
        Y[i] = x[i]
        X[i] = i
    }
    return [X, Y]
}

var semivariograma;
var dat_semivariograma = {
    nugget: 0,
    sill_parcial: 0,
    sill: 0,
    rango: 0,
    m: '',
    modelo: "",
    mvt: []
}
//ajuste mediante minimos cuadrados ordinario
function MCO(isAuto) {
    dat_semivariograma.modelo = document.getElementById("select_model").value
    console.log("dat_semivariograma ::", dat_semivariograma)
    const wk_mco = new Worker('/interpoladoresjs/mco.js');
    wk_mco.onerror = (event) => {
        alert("Error Al ajustar datos")
        console.log(event)
        wk_mco.terminate();
    };
    wk_mco.postMessage([semivariograma, dat_semivariograma.modelo])
    wk_mco.onmessage = (e) => {
        let rango = semivariograma.rango
        let nugget = e.data[0] ////Math.round(e.data[0])
        let sill = e.data[0] + e.data[1] //// Math.round(e.data[0] + e.data[1])
        let sill_parcial = e.data[1] ////Math.round(e.data[1])
        document.getElementById("data_mco").innerHTML = "<p>Nugget:" + nugget + "<br>Sill:" + sill + "<br>Rango:" + rango + "<br>Sill-parcial:" + sill_parcial + "</p>"
        //remplace//console.log("W:", e.data)

        let [dataSemivaTeorico, xVT] = dataVT(nugget, sill_parcial, rango, dat_semivariograma.modelo);
        chartVariograma.data.labels = xVT;
        chartVariograma.data.datasets[1].data = dataSemivaTeorico;
        chartVariograma.update();

        dat_semivariograma.nugget = nugget
        dat_semivariograma.sill_parcial = sill_parcial
        dat_semivariograma.rango = rango
        dat_semivariograma.sill = sill
        dat_semivariograma.m = "MCO"
        wk_mco.terminate();
        //remplace//console.log("dat_semivariograma:",dat_semivariograma)
        if (isAuto) { interpolar("kriging") }

    }

}

function ajusteManual() {
    dat_semivariograma.modelo = document.getElementById("select_model").value;
    let sill = parseFloat(document.getElementById("sill").value);
    let nugget = parseFloat(document.getElementById("nugget").value);
    let rango = parseFloat(document.getElementById("range").value);
    let [dataSemivaTeorico, xVT] = dataVT(nugget, (sill - nugget), rango, dat_semivariograma.modelo);
    chartVariograma.data.labels = xVT;
    chartVariograma.data.datasets[1].data = dataSemivaTeorico;
    chartVariograma.update();

    dat_semivariograma.nugget = nugget;
    dat_semivariograma.sill_parcial = sill - nugget;
    dat_semivariograma.rango = rango;
    dat_semivariograma.sill = sill;
    dat_semivariograma.m = "ajusteManual";
    //remplace//console.log("dat_semivariograma:",dat_semivariograma)
}
var x = []
var y = []
var z = []

function crear_SemiVariograna_Experimental() {
    //document.getElementById("id_variograma").style.display = "";
    //remplace//console.log("dat_semivariograma::", dat_semivariograma)
    //Actualizar chart del modelo teorico
    chartVariograma.data.labels = [];
    chartVariograma.data.datasets[1].data = [];
    chartVariograma.update();
    //actualizar valores del semivariograma teorico
    dat_semivariograma.nugget = 0
    dat_semivariograma.sill_parcial = 0
    dat_semivariograma.rango = 0
    dat_semivariograma.sill = 0
    dat_semivariograma.m = ""
    //actualizar datos del semiVa en MCO
    document.getElementById("data_mco").innerHTML = "<p>Nugget:" + "<br>Sill:" + "<br>Rango:" + "<br>Sill-parcial:" + "</p>"
    //actualizar entradas del ajuste manual
    document.getElementById("sill").value = ""
    document.getElementById("nugget").value = ""
    document.getElementById("range").value = ""
    const wk_semiva = new Worker('/interpoladoresjs/variograma.js');
    wk_semiva.onerror = (event) => {
        alert("Error")
        console.log(event)
        wk_semiva.terminate();
    };
    wk_semiva.postMessage({ ovi: ovitrampas })
    wk_semiva.onmessage = (event) => {
        //remplace//console.log(event.data)
        let lags = event.data.variograma.lags;
        let semi = event.data.variograma.semi
        var dataP = createDP(lags, semi)
        chartVariograma.data.datasets[0].data = dataP;
        //remplace//console.log(event.data)
        chartVariograma.update();
        semivariograma = event.data.variograma
        x = event.data.x
        y = event.data.y
        z = event.data.z
        wk_semiva.terminate();
        MCO(true)
    }

}
//var zonaSelect;
//pi,B,A,cajaMulti
var puntos_a_interpolar, A, B, cajaMulti;
var wk_kriging, wk_idw;
var metodo_aplicado = "";

function cancelar_interpolacion() {
    //document.getElementById("interpolarCSV").style.top = "";
    document.getElementById("divProgressInterpolar").style.display = "none";
    if (metodo_aplicado == "kriging") { wk_kriging.terminate(); } else if (metodo_aplicado == "idw") { wk_idw.terminate(); }
    console.log("Interpolacion Cancelada......")
}

function interpolar(metodo) {
    document.getElementById("ventana_seleccionar_p").style.display = "none"
    document.getElementById("progressInter").value = 0 //reinicira progreso

    document.getElementById("interpolarCSV").style.display = "";
    document.getElementById("interpolarCSV").style.top = 0 + "%";
    if (metodo === "kriging") {
        metodo_aplicado = metodo
        if (dat_semivariograma.m !== "") {
            document.getElementById("divProgressInterpolar").style.display = ""
            //document.getElementById("imgLoading").style.display = "";
            document.getElementById("interpolarCSV").style.filter = "blur(0px)";
            document.getElementById("id_variograma").style.display = "none";
            //creamos el worker
            //remplace//console.log("dat_semivariograma:;", dat_semivariograma)
            wk_kriging = new Worker('/interpoladoresjs/kriging_ordinario.js');
            wk_kriging.onerror = (event) => {
                alert("Error")
                console.log(event)
                document.getElementById("imgLoading").style.display = "none";
                wk_kriging.terminate();
            };
            wk_kriging.postMessage({ x: x, y: y, z: z, semivariograma: dat_semivariograma, pi: puntos_a_interpolar, ms: dat_semivariograma.modelo })
            wk_kriging.onmessage = (event) => {
                if (event.data.type === "result") {
                    //remplace//console.log("DataKriging:", event.data);
                    dat_semivariograma.mvt = event.data.mvt
                    var zi = event.data.zi;
                    if (B != zi.length / A) {
                        B = zi.length / A;
                        //remplace//console.log("!B")
                    }
                    let opacidad_img = 1;
                    if (mapCSVInter.hasLayer(imgOpaci)) { mapCSVInter.removeLayer(imgOpaci); }
                    if (mapCSVInter.hasLayer(imgZonaAlta)) { mapCSVInter.removeLayer(imgZonaAlta); }

                    imgZonaAlta = L.imageOverlay(creaImagen(A, B, zi, "canvasMapZonaAlta", "imgZonaAlta"), [
                        [cajaMulti[1], cajaMulti[0]],
                        [cajaMulti[3], cajaMulti[2]]
                    ], {
                        opacity: 1
                    });

                    var imgk = L.imageOverlay(creaImagen(A, B, zi, "canvasMap", ""), [
                        [cajaMulti[1], cajaMulti[0]],
                        [cajaMulti[3], cajaMulti[2]]
                    ], {
                        opacity: opacidad_img
                    });
                    imgOpaci = imgk
                    imgOpaci.addTo(mapCSVInter);
                    addTablaIndicador(ovitrampas);
                    //document.getElementById("imgLoading").style.display = "none";
                    document.getElementById("divProgressInterpolar").style.display = "none"
                    ////
                } else if (event.data.type == "progress") {
                    document.getElementById("progressInter").value = parseInt(event.data.p)
                }

                ////

            }
        } else {
            alert("Ajuste el semivariograma")
        }

    } else if (metodo === "idw") {
        metodo_aplicado = metodo
        document.getElementById("divProgressInterpolar").style.display = ""
        //document.getElementById("imgLoading").style.display = "";
        //creamos el worker
        //remplace//console.log("dat_semivariograma:;", dat_semivariograma)
        wk_idw = new Worker('/interpoladoresjs/idw.js');

        wk_idw.onerror = (event) => {
            alert("Error")
            console.log(event)
            //document.getElementById("imgLoading").style.display = "none";
            document.getElementById("divProgressInterpolar").style.display = "none"
            wk_idw.terminate();
        };
        wk_idw.postMessage({ ovi: ovitrampas, pi: puntos_a_interpolar, p: document.getElementById("valor_potencia_p").value })
        wk_idw.onmessage = (event) => {
            if (event.data.type == "result") {
                var zi = event.data.zi;
                //remplace//console.log("Zidw::", zi)
                if (B != zi.length / A) {
                    B = zi.length / A;
                    //remplace//console.log("!B")
                }
                let opacidad_img = 1;
                if (mapCSVInter.hasLayer(imgOpaci)) { mapCSVInter.removeLayer(imgOpaci); }
                if (mapCSVInter.hasLayer(imgZonaAlta)) { mapCSVInter.removeLayer(imgZonaAlta); }
                imgZonaAlta = L.imageOverlay(creaImagen(A, B, zi, "canvasMapZonaAlta", "imgZonaAlta"), [
                    [cajaMulti[1], cajaMulti[0]],
                    [cajaMulti[3], cajaMulti[2]]
                ], {
                    opacity: 1
                });
                imgOpaci = L.imageOverlay(creaImagen(A, B, zi, "canvasMap", ""), [
                    [cajaMulti[1], cajaMulti[0]],
                    [cajaMulti[3], cajaMulti[2]]
                ], {
                    opacity: opacidad_img
                });
                //imgOpaci = img_idw
                imgOpaci.addTo(mapCSVInter);
                addTablaIndicador(ovitrampas);
                //document.getElementById("imgLoading").style.display = "none";
                document.getElementById("divProgressInterpolar").style.display = "none"
                wk_idw.terminate();
            } else if (event.data.type == "progress") {
                document.getElementById("progressInter").value = parseInt(event.data.p)
            }
        }

    }
}
function SZA() {
    mapCSVInter.removeLayer(imgOpaci);
    imgZonaAlta.addTo(mapCSVInter)
}


function generarPI(zonaSelect) { //genear puntos a interpolar
    //console.log("zonaSelect::", zonaSelect)
    //var zonaCoord = zonaSelect[0].geometry.coordinates[0]
    //remplace//console.log("1")
    let positions = []
    zonaSelect[0].geometry.coordinates[0][0].forEach(function (point) {
        positions.push([point[1], point[0]]);
    });
    mapCSVInter.removeLayer(scope);
    scope = new L.polyline(positions, {
        color: 'blue'
    }).addTo(mapCSVInter);
    mapCSVInter.fitBounds(scope.getBounds());
    let options = { units: 'meters' } //unidades con las que se trabaja metros
    let line = turf.lineString(inv(positions));
    let bbox = turf.bbox(line);
    let dcuadro = turf.distance([bbox[0], bbox[1]], [bbox[0], bbox[3]], options);
    let cantidad_de_cuadrados_por_ladao = 150
    let tamCuadro = Math.ceil(dcuadro / cantidad_de_cuadrados_por_ladao) //80
    let squareGrid = turf.squareGrid(bbox, tamCuadro, options);
    cajaMulti = turf.bbox(squareGrid); //cuadro dlimitador del poligono
    let d = turf.distance([cajaMulti[0], cajaMulti[3]], [cajaMulti[2], cajaMulti[3]], {
        units: 'meters'
    });
    let d2 = turf.distance([cajaMulti[0], cajaMulti[1]], [cajaMulti[0], cajaMulti[3]], {
        units: 'meters'
    });
    A = Math.ceil(d / tamCuadro)

    B = Math.ceil(d2 / tamCuadro)

    puntos_a_interpolar = [];
    //propiedad centro de masa
    let centro;
    let poligonoDeZona = turf.lineToPolygon(line);
    for (let i = 0; i < squareGrid.features.length; i++) {
        centro = turf.centerOfMass(squareGrid.features[i]).geometry.coordinates;
        if (turf.booleanWithin(turf.point(centro), poligonoDeZona)) {
            puntos_a_interpolar.push(centro)
        } else {
            puntos_a_interpolar.push([])
        }

    }
    //pi,B,A,cajaMulti
}

function crearXY(p, min, max) {
    min = 0; // min - (10 * min) / 100
    max = max + (0.3 * max); // max + (30 * max) / 100
    const x_rect = [];
    const y_rect = [];
    for (let i = parseInt(min); i < parseInt(max); i++) {
        x_rect.push(i);
        y_rect.push(i); // p[0] * (i) + p[1]
    }
    return [x_rect, y_rect];
}
var wk_vcross;

function cancelar_vc() {
    document.getElementById("validacioncruzada").style.display = "none";
    wk_vcross.terminate();
    console.log("Validación cruzada Cancelada.....")
}

function validacionCruzada(metodo_interpolador) {
    document.getElementById("ventana_seleccionar_p").style.display = "none" //cerrar div de seleccionar paramatro p en IDW
    document.getElementById("divProgressVC").style.display = "" //div que contiene a process bar
    console.log("ovitrampas.length:", ovitrampas.length)
    console.log("metodo_interpolador:::", metodo_interpolador)
    var file_vc_path = metodo_interpolador == "kriging" ? "/interpoladoresjs/validacionCruzada.js" : "/interpoladoresjs/validacionCruzadaIDW.js"
    wk_vcross = new Worker(file_vc_path)
    if (ovitrampas.length >= 500 && metodo_interpolador == "kriging") {
        wk_vcross.terminate();
        alert("No es posible realizar la V.C con mas de 150 datos")
    } else {
        document.getElementById("validacioncruzada").style.top = 2 + "%"
        document.getElementById("validacioncruzada").style.display = "";
        wk_vcross.onerror = (event) => {
            alert("Error")
            console.log(event)
            wk_vcross.terminate();
        };
        var valor_potencia_p = document.getElementById("valor_potencia_p").value
        var datos_vc = metodo_interpolador == "kriging" ? { x: x, y: y, z: z, semivariograma: dat_semivariograma } : { ovi: ovitrampas, p: valor_potencia_p }
        wk_vcross.postMessage(datos_vc)
        wk_vcross.onmessage = (e) => {
            if (e.data.type == "result") {
                //remplace//console.log("VCROSS:", e.data)
                let error = e.data.error
                let promedioError = promedio(error)
                //remplace//console.log("Error medio:", promedioError)
                let ve = e.data.ve
                let zv = e.data.zv
                let correlacioDeV = calcularCorrelacion(zv, ve)
                document.getElementById("errorpromedio").innerHTML = "Error medio: " + promedioError.toFixed(3)
                document.getElementById("correlaciozv").innerHTML = "Correlación(VR,VE):" + correlacioDeV.toFixed(5)
                //remplace//console.log("Correlacion:", correlacioDeV)
                var dataP = createDP(zv, ve)
                var a_xb = [] /// calcularRectaDeMejorAjuste(ve, zv)
                let minve = Math.min(...ve);
                let maxve = Math.max(...ve);
                let minzv = Math.min(...zv);
                let maxzv = Math.max(...zv);
                //remplace//console.log(minve, maxve)
                //remplace//console.log(minzv, maxzv)
                //var crearxy=crearXY(a_xb,Math.min(minve,minzv),Math.max(maxve,maxzv))
                var crearxy = crearXY(a_xb, Math.max(minve, minzv), Math.min(maxzv, maxve))
                //remplace//console.log("crearxy::", crearxy)
                var xy_rect = createDP(crearxy[0], crearxy[1])
                //remplace//console.log("dataP:", dataP)
                graf_vz.data.datasets[0].data = dataP;
                graf_vz.data.datasets[1].data = xy_rect;
                [chart_error.data.labels, chart_error.data.datasets[0].data] = createDPX(error);
                graf_vz.update();
                chart_error.update()
                var tableVC = "<tr><th>Valor Real(VR)</th> <th>Valor Estimado(VE)</th><th>Error</th></tr>"
                for (var i = 0; i < error.length; i++) {
                    tableVC += `
            <tr>
                <td>${zv[i]}</td>
                <td>${ve[i].toFixed(3)}</td>
                <td>${error[i].toFixed(3)}</td>
            </tr>
         `
                }
                document.getElementById("tableVC").innerHTML = tableVC
                document.getElementById("divProgressVC").style.display = "none" //cerrar div que contiene a process bar
                //remplace//console.log("VIEW VALIDACION CRUZADA")
            }
            if (e.data.type == "progress") {
                document.getElementById("progressVC").value = parseInt(event.data.p)
            }
        }
    }
}

function crearMapaDeCalor(zonaV, m_i) {
    document.getElementById("muestra_button_v_interpolar").innerHTML = "" //borra botones de ventana de interpolar
    //zonaSelect=zonaV
    generarPI(zonaV) //generar puntos a interpolar
    if (m_i == "kriging") {
        let button_view = '<button onclick="showVariograma()"><img src="/images/graf.png" id="icon_inter">Ver Semivariograma</button><button onclick="validacionCruzada(' + '\'kriging\'' + ')"><img src="/images/graf.png" id="icon_inter">Validación cruzada</button><button  onclick="ocultarIMG()" id="ocultarIMG"><img src="/images/oculto.png" id="icon_inter">Ocultar superficie</button><button onclick="mostrarIMG()" id="mostrarIMG"><img src="/images/ojo.png" id="icon_inter">Mostrar superficie</button><button onclick="dIMG()"><img src="/images/salvar.png" id="icon_inter">Descargar superficie</button><button id="ocultarPuntos" onclick="ocultarPuntos()"><img src="/images/oculto.png" id="icon_inter">Ocultar Puntos</button><button id="mostrarPuntos" onclick="mostrarPuntos()"><img src="/images/ojo.png" id="icon_inter">Mostrar Puntos</button><button onclick="SZA()"><img src="/images/ojo.png" id="icon_inter">Mostrar Zonas Altas</button>'; //<button onclick="showError()"><img src="/images/ojo.png" id="icon_inter">Mostrar Res. validacion cruzada</button>'
        document.getElementById("muestra_button_v_interpolar").innerHTML = button_view
        //document.getElementById("interpolarCSV").style.filter = "blur(5px)";
        crear_SemiVariograna_Experimental()

    } else if (m_i == "idw") {
        let button_view = '<button onclick="ajustarP()"> <img src="/images/graf.png" id="icon_inter">Seleccionar parametro <strong>p</strong></button><button  onclick="ocultarIMG()" id="ocultarIMG"><img src="/images/oculto.png" id="icon_inter">Ocultar superficie</button><button onclick="mostrarIMG()" id="mostrarIMG"><img src="/images/ojo.png" id="icon_inter">Mostrar superficie</button><button onclick="dIMG()"><img src="/images/salvar.png" id="icon_inter">Descargar superficie</button><button id="ocultarPuntos" onclick="ocultarPuntos()"><img src="/images/oculto.png" id="icon_inter">Ocultar Puntos</button><button id="mostrarPuntos" onclick="mostrarPuntos()"><img src="/images/ojo.png" id="icon_inter">Mostrar Puntos</button><button onclick="SZA()"><img src="/images/ojo.png" id="icon_inter">Mostrar Zonas Altas</button>'
        document.getElementById("muestra_button_v_interpolar").innerHTML = button_view
        interpolar(m_i)
    }
}

function mapaCalor(n, id, f, type_dat, m_interpolacion) {
    //remplace//console.log("mapaCalor(" + n + "," + id + "," + f + "," + type_dat + ")")
    if (type_dat === "type_bd") { //si se analiza desde la bd
        //remplace//console.log(n, id, f)
        ir_url(n, id, "type_bd", m_interpolacion);
        //window.open(window.location.origin + "/info?x=" + n + "&gid=" + id + "&fecha=" + f, 'popup', 'width=' + (screen.width - 100) + ', height=' + (screen.height - 100) + ', left=' + 10 + ', top=' + 10 + '');
    } else if (type_dat === "type_csv") { //si proviene de un csv y el id de zona pertenece a alguna zona del fileZonaAcapulco.json
        //remplace//console.log(n, id, f);
        ir_url(n, id, "", m_interpolacion);
    } else if (type_dat === "type_csv_no_zona") { //si proviene de un csv y el id no esta en filezonaaca.json
        ir_url(n, id, "type_csv_no_zona", m_interpolacion);
    }
}
//ocular / mostrar puntos
function ocultarPuntos() {
    groupCircleCSV.remove();
}

function mostrarPuntos() {
    groupCircleCSV.addTo(mapCSVInter);
}
//ocular / mostrar Marcadores
function addMarcadores() {
    groupMakersCSV.addTo(mapCSVInter)
}

function ocultarMarcadores() {
    groupMakersCSV.remove();
}


//redireccionar a Ventana de Mapa de calor
function ir_url(n, c_id, type_dat, m_i) { //value
    document.getElementById("interpolarCSV").style.display = "";
    //document.getElementById("imgLoading").style.display = "";
    document.getElementById('agregar-marcadoresCSV').addEventListener('click', function () {
        groupMakersCSV.addTo(mapCSVInter)
    })
    document.getElementById('remover-marcadoresCSV').addEventListener('click', function () {
        groupMakersCSV.remove();
    })

    //elimina la imagen si esta en el mapa
    if (mapCSVInter.hasLayer(imgOpaci)) { mapCSVInter.removeLayer(imgOpaci); }//imgZonaAlta
    if (mapCSVInter.hasLayer(imgZonaAlta)) { mapCSVInter.removeLayer(imgZonaAlta); }

    //document.getElementById("imgLoading").style.display = ""; //muestra la imagen en mapCSVInter
    //groupCirclesCSV.remove()
    document.getElementById("interpolarCSV").style.top = 0 + "%";
    document.getElementById("nomColInterp").innerHTML = "Colonia : " + n; //+paramsValue[0].zona;

    positions = [];
    ovitrampas = [];
    markersCSV = [];
    circlesCSV = [];

    //remplace//console.log("c_id::", c_id, n);
    console.log("OVICSV:", data_ovi_csv)
    var nombreColonia = ""
    for (var i = 0; i < data_ovi_csv.length; i++) {
        //remplace//console.log(data_ovi_csv[i][0].gid)
        if (c_id === data_ovi_csv[i][0].gid) {
            ovitrampas = data_ovi_csv[i]
            nombreColonia = data_ovi_csv[i][0]["nom_col"]
            break
        }
    }
    console.log(nombreColonia)

    groupMakersCSV.remove(); //remueve
    groupCircleCSV.remove(); //remueve circulos de add
    for (var i = 0; i < ovitrampas.length; i++) { ///RADIO=(parseInt(ovitrampas[i].cantidad_huevos)*100)/(Est_Des_Data.data_max)
        circlesCSV[i] = L.circle([ovitrampas[i].latitud, ovitrampas[i].longitud], (parseInt(ovitrampas[i].cantidad_huevos) * 100) / (data_ovi_max), { weight: 2, opacity: 1, fillOpacity: 1, fillColor: getC(ovitrampas[i].cantidad_huevos, data_ovi_max), fill: true, color: "black" });
        markersCSV[i] = L.marker([ovitrampas[i].latitud, ovitrampas[i].longitud], { color: "red", draggable: false, title: "Ovitrampa" + (i + 1) + ": Cantidad de Huevos : " + ovitrampas[i].cantidad_huevos });
        markersCSV[i].bindPopup("Lat:" + ovitrampas[i].latitud + "<br>Lng:" + ovitrampas[i].longitud + "<br>Colonia:" + nombreColonia + "<br> Cantidad de Huevos : " + ovitrampas[i].cantidad_huevos)
    }
    groupCircleCSV = L.layerGroup(circlesCSV);
    //groupCircleCSV.addTo(mapCSVInter);
    groupMakersCSV = L.layerGroup(markersCSV);
    //groupMakersCSV.addTo(mapCSVInter);

    var zona;
    if (type_dat === "type_csv_no_zona") {
        zona = zonaGeneral; ///agrega las zonas al mapa
        for (var i = 0; i < zonaGeneral.length; i++) {
            if (zonaGeneral[i].properties.gid === c_id) {
                zona = [zonaGeneral[i]]
                break;
            }
        }
        //remplace//console.log("zona despues:", zona)
        crearMapaDeCalor(zona, m_i);
    } else {
        fetch("/getZona", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gid: [c_id] //[paramsValue[0].zona_id]
            })
        })
            .then(res => res.json())
            .then(data => {
                zona = data.zona; ///agrega las zonas al mapa
                //remplace//console.log("zona despues:", zona);
                crearMapaDeCalor(zona, m_i);
            });
    }
};

//document.getElementById('mostrarIMG').addEventListener("click", function () {
//layerGroup.addTo(map);
function mostrarIMG() {
    imgZonaAlta.addTo(mapCSVInter);
    imgOpaci.addTo(mapCSVInter);
}
//})
//document.getElementById('ocultarIMG').addEventListener("click", function () {
//map.removeLayer(layerGroup)
function ocultarIMG() {
    mapCSVInter.removeLayer(imgZonaAlta);
    mapCSVInter.removeLayer(imgOpaci);
}
//});
//funcion para cerrar la ventana del semivariograma
function closeVariograma() {
    document.getElementById("interpolarCSV").style.filter = "blur(0px)";
    document.getElementById("id_variograma").style.display = "none";
}

function showVariograma() {
    document.getElementById("id_variograma").style.display = "";
    document.getElementById("interpolarCSV").style.filter = "blur(5px)";
}

function dIMG() {
    const canvas = document.querySelector("#canvasMap")
    let enlace = document.createElement('a');
    // El título
    let nameAleatorio = (Math.floor(Math.random() * 100000)).toString()
    enlace.download = "MAPA_" + nameAleatorio + ".PNG";
    // Convertir la imagen a Base64 y ponerlo en el enlace
    enlace.href = canvas.toDataURL("image/jpeg", 1);
    // Hacer click en él
    enlace.click();
}

function closeError() {
    document.getElementById("validacioncruzada").style.display = "none";
}

function showError() {
    document.getElementById("validacioncruzada").style.display = "";
}

function closeSelectP() {
    document.getElementById("ventana_seleccionar_p").style.display = "none"
}

function ajustarP() {
    document.getElementById("ventana_seleccionar_p").style.display = ""
}


