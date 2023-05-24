console.log("Indicadores.js")
/*let markers = []//new Array(); 
var groupMakers = L.layerGroup(markers); 
*/
//agrega marcadores al mapa(map)
function addOvi(ovi_i) {
    markers = []
    groupMakers.remove();
    var _i = 0;
    for (var j = 0; j < ovi_i.length; j++) {
        for (var i = 0; i < ovi_i[j].length; i++) {
            if (!isNaN(ovi_i[j][i].latitud) && !isNaN(ovi_i[j][i].longitud)) {
                markers[_i] = L.marker([ovi_i[j][i].latitud, ovi_i[j][i].longitud], { color: "red", draggable: false, title: "" + ovi_i[j][i].cantidad_huevos });
                markers[_i].bindPopup("<b>Latitud:</b>"+ovi_i[j][i].latitud+"<br><b>Longitud:</b>"+ ovi_i[j][i].longitud+"<br><b>Colonia</b> : " + ovi_i[j][i].nom_col + " <br><b>cant :</b> <var>" + ovi_i[j][i].cantidad_huevos + "</var>")
                _i++; //index markers
            }
        }
        //}
    }
    groupMakers = L.layerGroup(markers);
}

function graphPromedioHoy(a) { //agrega los datos a la grafia de promedios de hoy para cada zona
    var iGDay = {
        promedios: [],
        nom_col: [],
    }
    for (var i = 0; i < a.length; i++) {
        iGDay.promedios.push(a[i].ph);
        iGDay.nom_col.push(a[i].nom_col)
    }
    if (iGDay.promedios.length > 10) {
        c_pm.options.scales.x.display = false;
    } else {
        c_pm.options.scales.x.display = true;
    }
    c_pm.data.labels = iGDay.nom_col;
    c_pm.data.datasets[0].data = iGDay.promedios;
    //c_pm.data.datasets[0].backgroundColor = gradient
    c_pm.update();
}

function addZonaName(id, l, p, c, c_h) {
    //l=nombre dcolonia[]
    //p=numeros de ovitrampa[]
    //c=color[]
    //c_h=cantidad de huevos[]
    var doc_ = "";
    for (var i = 0; i < l.length; i++) {
        doc_ += '<tr><td id="td_color" style="background:' + c[i] + ' ;text-shadow: 2px 0 black, -2px 0 black, 0 2px black, 0 -2px black, 1px 1px black, -1px -1px black, -1px 1px black, 1px -1px black;font-size: 18px;width: 2px;" >' + p[i] + '</td><td style="text-align: initial">' + l[i] + '</td><td>' + parseInt(c_h[i]) + '</td></tr>';
    }
    document.getElementById(id).innerHTML = '<table style="width:100%"><thead><th>#Ovit</th><th>Colonia</th> <th>#Huevos</th></thead><tbody>' + doc_ + '<tbody></table>';
}
//funcion fin
function generarNumero(numero) {
    return (Math.random() * numero).toFixed(0);
}
var _PH = [] //indices de recipientes
function colorRGB() {
    var coolor = "(" + generarNumero(255) + "," + generarNumero(255) + "," + generarNumero(255) + ")";
    return "rgb" + coolor;
}
function mostrarVentanaEstDesc() {
    document.getElementById("cont").style.filter = "blur(14px)"
    document.getElementById("ventanaEstDesc").style.display = ""

}
function closeTableDescri() {
    document.getElementById("cont").style.filter = "blur(0px)"
    document.getElementById("ventanaEstDesc").style.display = "none"
}
function createTablaDescriptivos(data) {
    document.getElementById("decriptivo_table_body").innerHTML = ""
    var tr = ""
    console.log(data.gid.length)
    let dh = []
    for (var i = 0; i < data.gid.length; i++) {
        dh = data.cant_h[i].sort((a, b) => { return a - b })
        tr += `<tr>
           <td>${data.gid[i]}</td><td>${data.nom_col[i]}</td><td>${data.cant_ovi[i]}</td><td>${data.total_huevos[i]}</td>
           <td>${data.media[i]}</td><td>${data.varianza[i]}</td><td>${data.desviacions_estandar[i]}</td>
           <td>${data.coef_variacion[i]}%</td><td>${dh[0]}</td><td>${dh[dh.length - 1]}</td><td>${dh[dh.length - 1] - dh[0]}</td>
           <td><button onclick="calcularHistograma(${i})">Ver Histograma</button></td>
        </tr>`;
    }
    document.getElementById("decriptivo_table_body").innerHTML = tr
}
function groupOvi(arr) {
    //console.log("arr",arr)
    let a = [
        []
    ]
    let k = 0;
    for (var i = 0; i < arr.length; i++) {
        if (i > 0 && arr[i]['gid'] !== arr[i - 1]['gid']) {
            a.push([])
            k++;
        }
        a[k].push(arr[i]);

    }
    return a;
}
var colorsL = [] //color de cada labels 
//generar indicadores entomologicos
function varza(m, x) {
    let suma = 0
    for (let i = 0; i < x.length; i++) {
        suma += Math.pow(x[i] - m, 2);
    }
    return [suma / (x.length - 1), Math.sqrt(suma / x.length - 1)]
}
var Est_Des_Data = {
    gid: [],//
    cant_ovi: [],//
    cant_h: [],
    nom_col: [],//
    media: [],//
    total_huevos: [],//
    varianza: [],
    desviacions_estandar: [],
    coef_variacion: [],
    data_max:0
}
function indicadores(inf_ovi, _zona, type_dat) {
    Est_Des_Data = {
        gid: [],//
        cant_ovi: [],//
        cant_h: [],
        nom_col: [],//
        media: [],//
        total_huevos: [],//
        varianza: [],
        desviacions_estandar: [],
        coef_variacion: [],
    }
    console.log("TypeDat:" + type_dat)
    console.log("inf_ovi::", inf_ovi)
    _zona = [];
    _PH = [] //Promedio de Huevos
    let c_pop = { //val para chart porcentaje de ovitrampa positiva
        nom_col: [], //save nombre de las colonias
        pop: [],
        gid: []
    }

    let sum_cant; //cantidad de huevos
    let cant_ovi = 0; //cuenta las ovitrampas
    let n_c = [] //almacena la cantidad de huevo de cada colonia
    let p_n_c = [] //almacena el porcentaje de huevos del total de las colonias
    let t_huevos = 0; //total de huevos
    let cant_ovi_colonia = [];
    let cant_t_ovi = 0; //variable para almacenar el total de oivitrampas
    let max_data=[]
    for (var j = 0; j < inf_ovi.length; j++) {
        max_data[j]=getMaxValor(inf_ovi[j])[1]
        Est_Des_Data.cant_h[j] = []
        Est_Des_Data.nom_col[j] = inf_ovi[j][0].nom_col//add nom col
        Est_Des_Data.gid[j] = inf_ovi[j][0].gid//add gid a json
        Est_Des_Data.cant_ovi[j] = inf_ovi[j].length//cantida ovi de cada colonia
        cant_ovi += inf_ovi[j].length;
        sum_cant = 0;

        cant_ovi_colonia.push(inf_ovi[j].length);
        cant_t_ovi = inf_ovi[j].length;
        for (var i = 0; i < inf_ovi[j].length; i++) {
            if (!isNaN(inf_ovi[j][i].cantidad_huevos)) {
                Est_Des_Data.cant_h[j][i] = inf_ovi[j][i].cantidad_huevos
                t_huevos += inf_ovi[j][i].cantidad_huevos;
                sum_cant += inf_ovi[j][i].cantidad_huevos;//suma los h de cada colonia
            }
            if (inf_ovi[j][i].cantidad_huevos <= 0 || isNaN(inf_ovi[j][i].cantidad_huevos)) {
                cant_t_ovi -= 1;
            }
        }
        Est_Des_Data.media[j] = parseInt(sum_cant / inf_ovi[j].length);
        Est_Des_Data.total_huevos[j] = sum_cant;
        Est_Des_Data.varianza[j] = parseInt(varza(Est_Des_Data.media[j], Est_Des_Data.cant_h[j]));
        Est_Des_Data.desviacions_estandar[j] = parseInt(Math.sqrt(Est_Des_Data.varianza[j]));
        Est_Des_Data.coef_variacion[j] = parseInt(Est_Des_Data.desviacions_estandar[j] / Math.abs(Est_Des_Data.media[j]) * 100);
        c_pop.nom_col.push(inf_ovi[j][0].nom_col);
        c_pop.gid.push(inf_ovi[j][0].gid);
        c_pop.pop.push(parseInt((cant_t_ovi * 100) / inf_ovi[j].length))
        n_c.push(sum_cant)
        _zona.push(inf_ovi[j][0].gid);
        colorsL.push(colorRGB());
        cant_t_ovi = 0;
        _PH.push({ ph: sum_cant / (inf_ovi[j].length), sumaH: sum_cant, nom_col: inf_ovi[j][0].nom_col, fecha: inf_ovi[j][0].fecha, cant_ovi: inf_ovi[j].length });
    }
    console.log("max_data::",max_data)
    Est_Des_Data.data_max=Math.max(...max_data)
    //var aux_suma = 0
    for (var i = 0; i < inf_ovi.length; i++) {
        p_n_c[i] = ((n_c[i] * 100) / t_huevos).toFixed(3)
        //aux_suma+=parseInt(p_n_c[i]);
    }
    //console.log("Porcentaje:", p_n_c, "Suma:", aux_suma)
    //dar valore a las siguientes varibles definidas como variables_G
    nombres_de_colonias = c_pop.nom_col;
    cantidad_h_de_cada_colonia = n_c;
    cantidad_ovi_de_cada_colonia = cant_ovi_colonia;
    gid_de_cada_colonnia = c_pop.gid;
    //
    document.getElementById("n_ovi").innerHTML = cant_ovi;
    myLineChart.data.datasets[0].data = p_n_c //ph;
    myLineChart.data.datasets[0].backgroundColor = colorsL; //color a la grafica
    myLineChart.data.labels = c_pop.nom_col; // Would update the first dataset's value of 'March' to be 50
    myLineChart.update();
    //graph_POP 
    if(c_pop.gid.length>10){chart_pop.options.scales.x.display = false;}else{chart_pop.options.scales.x.display = true;}
    chart_pop.data.labels = c_pop.nom_col;
    chart_pop.data.datasets[0].data = c_pop.pop;
    chart_pop.update();
    addZonaName("zona_name", c_pop.nom_col, cant_ovi_colonia, colorsL, n_c)
    graphPromedioHoy(_PH);
    console.log("Agregando zona..")
    console.log("AddZona::::", _zona)
    console.log("getZona()", c_pop)
    getZonas(_zona, c_pop, type_dat)
    console.log("Zonas agregadas..")
    addOvi(inf_ovi);
    console.log(Est_Des_Data)
    createTablaDescriptivos(Est_Des_Data)
}
function sumClass(arr) {
    let suma = 0
    for (var i = 0; i < arr.length; i++) {
        suma += arr[i]
    }
    return suma
}
function crearHistogramaDeFrecuencias(od) {
    var dataVal = []
    dataVal.push(od[0])
    var auxDataVal = od[0]
    for (var i = 1; i < od.length; i++) {
        if (auxDataVal != od[i]) {
            dataVal.push(od[i]);
            auxDataVal = od[i]
        }
    }
    var contador = []
    var auxcontador = 0

    for (var i = 0; i < dataVal.length; i++) {
        auxcontador = 0
        for (var j = 0; j < od.length; j++) {
            if (dataVal[i] == od[j]) {
                auxcontador++;
            }
        }
        contador[i] = auxcontador;
    }
    //console.log(contador)
    var inter = Math.ceil(Math.sqrt(od.length))>15?15:Math.ceil(Math.sqrt(od.length))
    console.log("valored del array:", dataVal, "\ncantidad de V:", dataVal.length, "canta:", dataVal.length / inter)

    var tamClases = Math.round(dataVal.length / inter)
    console.log("Tamano de classes:", tamClases, "Cantidad de Intervalos:", inter)
    var frecuencia = []
    var interClass = []

    for (var i = 0; i < inter - 1; i++) {
        frecuencia[i] = sumClass(contador.slice(tamClases * i, tamClases * (i + 1)))
        if (i < inter - 1) {
            interClass[i] = "["+dataVal[tamClases * i] + "," + (dataVal[(tamClases * (i + 1))] - 1)+"]"
        } else {
            interClass[i] = "["+dataVal[tamClases * i] + "-" + dataVal[(tamClases * (i)) + 1]+"]"
        }
    }
    frecuencia.push(sumClass(contador.slice(tamClases * (inter - 1))))
    interClass.push(">" + dataVal[tamClases * (inter - 1)])

    return { frec: frecuencia, labelClass: interClass }

}
function calcularHistograma(index) {
    //console.log(index)
    //console.log("Datos Analizar:",Est_Des_Data.cant_h[index])
    var hist = crearHistogramaDeFrecuencias(Est_Des_Data.cant_h[index])
    document.getElementById("ventanaHistogramaDeFrecuencias").style.display = "";
    barChartHistograma.data.labels = hist.labelClass;
    barChartHistograma.data.datasets[0].data = hist.frec;
    barChartHistograma.update();
    console.log(hist)
}
function closeHistograma() { document.getElementById("ventanaHistogramaDeFrecuencias").style.display = "none"; }

function promedio(lista){
    var suma = 0;
    for (var i = 0; i < lista.length; i++) {
        suma +=  (lista[i]);
    }
    var promedio = suma / lista.length;
    return promedio;
}
function calcularRectaDeMejorAjuste(punto1,punto2) {
  var n = punto1.length;

  // Calcular sumatorias
  var sumX = 0;
  var sumY = 0;
  var sumXY = 0;
  var sumXX = 0;
  for (var i = 0; i < n; i++) { 
    var x = punto1[i];
    var y = punto2[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  // Calcular coeficientes de la recta de mejor ajuste
  var m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  var b = (sumY - m * sumX) / n;

  return [m, b];
}
function calcularCorrelacion(variableX, variableY) {
  var n = variableX.length;

  // Calcular sumatorias
  var sumX = 0;
  var sumY = 0;
  var sumXY = 0;
  var sumXX = 0;
  var sumYY = 0;
  for (var i = 0; i < n; i++) {
    var x = variableX[i];
    var y = variableY[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  }

  // Calcular coeficiente de correlación de Pearson
  var numerador = n * sumXY - sumX * sumY;
  var denominador = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  var correlacion = numerador / denominador;

  return correlacion;
}

