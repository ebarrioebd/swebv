/**
 * 
 * Prepara los datos antes de ser analizados 
 *prepara para generar los indicadores
 * 
 */
//remplace//console.log("funct_load_data.js")
//funciones del boton de filtrar
function button_inactivo(valor, c) {
    var boton = document.getElementById("bsubmit")
    boton.disabled = valor
    boton.style.background = c;
}

//ordena
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
//laamada para extraer datos desde la BD 
/**
 * 
 * 
 * Cargar DAtos desde MongoDB Atlas
 * 
 * 
*/
var data_ovi_csv=[]
 
function getFechas(f1, f2) {
    var fecha1 = document.getElementById(f1).value
    var fecha2 = document.getElementById(f2).value
    let date1 = new Date(fecha1.replace(/-+/g, '/'));
    let date2 = new Date(fecha2.replace(/-+/g, '/'));
    var fechaNum1 = date1.getDate();
    var mes_name1 = date1.getMonth();
    var fechaNum2 = date2.getDate();
    var mes_name2 = date2.getMonth();
    //return [fecha1,fecha2] 
    return [{ d: fechaNum1, m: mes_name1, y: date1.getFullYear() }, { d: fechaNum2, m: mes_name2, y: date2.getFullYear() }]
    ////remplace//console.log(dias[date.getDay()-1] + " " + fechaNum + " de " + meses[mes_name] + " de " + date.getFullYear());     
}
//Agrupa las ovitrampas por gid(identificador de colonia a la que pertenece)
function groupOvi(arr) {
    ////remplace//console.log("arr",arr)
    let a = [[]]
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
 
/**
 * Prepara datos de un archivo .csv
 * Cargar datos desde Archivo csv
 * 
 */
//abre un div flotante para seleccionar el file.csv
function fileSelect() {
    document.getElementById("cont").style.filter = "blur(14px)";
    document.getElementById("filecsv").style.display = "";
}//colors//rango
function closedivCSV() {
    document.getElementById("cont").style.filter = "blur(0px)";
    document.getElementById("filecsv").style.display = "none";
}
//shows NomCol SELECT
let jsCSV = [];
function getArrayNomCol() {
    jsCSV = [];
    jsCSB = _json.sort(GetSortOrder("gid"))//ordenena las ovitrampas respecto a su gid
    jsCSV = groupOvi(_json)// agrupa las ovitrampas por gid 
    let selectZonaCSV = "";
    for (var i = 0; i < jsCSV.length; i++) {
        selectZonaCSV += `
    <div class="row"> 
        <div class="col-2" style="    padding-top: 4px;" ><input class="boxCSV" checked type="checkbox" value="${jsCSV[i][0].gid}" id=""></div>
        <div class="col-9" style="padding: 0">
        <select id="${jsCSV[i][0].gid}-CSV" class="cCSV" onChange="ir_url(this)">
        <option ><marquee loop="40">${jsCSV[i][0].nom_col}</marquee></option>
        <optgroup style="display:none" id="optgroup" label="Geostadisticos">
        <option value='[{"option":"interpolacion","zona":"${jsCSV[i][0].nom_col}","zona_id":"${jsCSV[i][0].gid}"}]' id="option"><a href="">- Interpolación</a></option>
        </optgroup>
        <optgroup style="display:none" id="optgroup" label="Estadisticos">
        <option value='[{"option":"descriptivo","zona":"${jsCSV[i][0].nom_col}","zona_id":"${jsCSV[i][0].gid}"}]' id="option">- Descriptios</option>
        </optgroup>
    </select>
    </div>
    </div>
    <br>
    `
    }
    document.getElementById("selectCSV").innerHTML = selectZonaCSV;
    slectZonaCSV = "";
}
//LEER UN CSV//
function ver_csv_table(a) {
    var csv_table = "<table class='default'>"
    var th_csv = "";
    var tr_csv = ""
    for (var i = 0; i < a.length; i++) {
        tr_csv += "<th>" + a[i][0] + "</th>"
    }
    var td_csv = "";
    var cantShowCsv = 30;
    if (a[0].length <= cantShowCsv) {
        cantShowCsv = a[0].length-1;
    }
    for (var i = 0; i < cantShowCsv; i++) {
        td_csv += "<tr>"
        for (var j = 0; j < a.length; j++) {
            td_csv += "<td>" + a[j][i + 1] + "</td>"
        }
        td_csv += "</tr>";
    }
    let tr_punt="";
    if(cantShowCsv>=30){
        tr_punt = "<tr><td> ..... </td><td> ..... </td><td> ..... </td><td> ..... </td><td> ..... </td><td> ..... </td></tr>";
    }
    //document.getElementById("csv_tr").innerHTML="";
    document.getElementById("csv_table").innerHTML = "<table><thead>" + "<tr>" + tr_csv + "</tr></thead><tbody>" + td_csv + tr_punt+tr_punt+tr_punt+"</tbody></table>";
}
function checkDat(obj, params_id) {
    switch (params_id) {
        case "lat":
            if (isNaN(parseFloat(obj))) {
                return false;
                break;
            }
            else {
                return true;
                break;
            }
        case "long":
            break;
        case "gid":
            if (obj.length > 0) {
                return true;
                break;
            } else {
                return false;
                break;
            }

            break;
        case "nom_col":
            if (obj.length <= 0) {
                return "SN";
                break;
            } else {
                return obj;
                break;
            }
        case "cant_h":
            if (obj.length <= 0 || isNaN(parseInt(obj)) || parseInt(obj) <= 0) {
                return 0;
                break;
            } else {
                return obj;
                break;
            }
            break;
    }
}
var _json = [];
var _json_notAdd = [];
function ver_json(a) {
    var res = true;
    _json = [];
    //remplace//console.log("A:", a, a.length)
    if (a.length >= 6) {
        for (var i = 0; i < a[0].length - 1; i++) {
            if (a[0][i + 1] == null || a[1][i + 1] == null) {
                //remplace//console.log("is null:[" + a[0][i + 1] + "] o :[" + a[1][i + 1] + "]")
            } else
                if (checkDat(a[0][i + 1], "lat") && checkDat(a[1][i + 1], "lat") && checkDat(a[2][i + 1], "gid")) {
                    _json.push({
                        latitud: a[0][i + 1],
                        longitud: a[1][i + 1],
                        gid: a[2][i + 1],
                        nom_col: checkDat(a[3][i + 1], "nom_col"),
                        cantidad_huevos: checkDat(parseInt(a[4][i + 1]), "cant_h"),
                        fecha:a[5][i + 1] /*{
                            y: parseInt(a[5][i + 1].split("-")[0]),
                            m: parseInt(a[5][i + 1].split("-")[1]),
                            d: parseInt(a[5][i + 1].split("-")[2])
                        }*/
                    })
                }
                else {
                    _json_notAdd.push(
                        {
                            latitud: a[0][i + 1],
                            longitud: a[1][i + 1],
                            gid: a[2][i + 1],
                            nom_col: checkDat(a[3][i + 1], "nom_col"),
                            cantidad_huevos: checkDat(parseInt(a[4][i + 1]), "cant_h"),
                            fecha: a[5][i + 1] /*{
                            y: parseInt(a[5][i + 1].split("-")[0]),
                            m: parseInt(a[5][i + 1].split("-")[1]),
                            d: parseInt(a[5][i + 1].split("-")[2])
                        }*/
                        }
                    )
                }
        }
    } else {
        res = false;
    }
    //remplace//console.log("JSON:LENGTH:::", _json.length, _json)
    //remplace//console.log("_json_notAdd::", _json_notAdd)
    return res;
}
function parseCSV(text) {
    // Obtenemos las lineas del texto
    let lines = text.replace(/\r/g, '').split('\n');
    return lines.map(line => {
        // Por cada linea obtenemos los valores
        let values = line.split(',');
        return values;
    });
}
function reverseMatrixCSV(matrix) {
    ////remplace//console.log("Matrix:",matrix)
    let outputCSV = [];
    // Por cada fila
    matrix.forEach((values, row) => {
        // Vemos los valores y su posicion
        values.forEach((value, col) => {
            // Si la posición aún no fue creada
            if (outputCSV[col] === undefined) outputCSV[col] = [];
            outputCSV[col][row] = value;
        });
    });
    return outputCSV;
}
function readFile(evt) {
    document.getElementById("csv_table").innerHTML = "";//vacia la tabla que visualiza los datos del archivo csv
    document.getElementById("selectCSV").innerHTML = "";//vacia la tabal que muestra las zonas del archivo csv 
    let file = evt.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
        // Cuando el archivo se terminó de cargar
        let lines = parseCSV(e.target.result);
        ////remplace//console.log("lines::",lines);
        let output = reverseMatrixCSV(lines);
        //remplace//console.log("Terminado csv...", output)
        if (ver_json(output)) {
            ver_csv_table(output);
            getArrayNomCol();
            document.getElementById("bCSV").innerHTML = "<strong style='font-size: inherit;color: #58ff00;'>" + document.getElementById('files').files[0].name + "</strong>";
            document.getElementById("files").value = "";
        } else {
            alert("Error : Formato incorrecto")
        }
    };
    // Leemos el contenido del archivo seleccionado
    reader.readAsBinaryString(file);
}
document.getElementById('files').addEventListener('change', readFile, false);
//funcion para mostrar el archivo cargado en el mapa


function getDataCSV() { 
    let _jsonGrp = [];
    let checkselect = []
    $('input:checkbox.boxCSV').each(function () {
        if ($(this)[0].checked) {
            checkselect.push($(this).val());
        }
    });
    if (checkselect.length > 0 ) {
        _jsonGrp = _json.sort(GetSortOrder("gid"))//ordenena las ovitrampas respecto a su gid
        _jsonGrp = groupOvi(_json)// agrupa las ovitrampas por gid
        data_ovi_csv = [];
        //remplace//console.log("_jsonGrp::", _jsonGrp)
        for (var i = 0; i < _jsonGrp.length; i++) {
            //analizar solo las colonias seleccionadas
            if (checkselect.indexOf(_jsonGrp[i][0].gid) != -1) {
                 data_ovi_csv.push(_jsonGrp[i])
            }  
        }
        document.getElementById("cont").style.filter = "blur(0px)";
        document.getElementById("filecsv").style.display = "none";
        //puntos_OVI = data_ovi_csv;
        indicadores(data_ovi_csv, checkselect, "type_csv");
        //addOvi(_json)
    } else {
        alert("Seleccione una Colonia.")
    }

}
//fin de leer un CSV 
//mostrar datos del archivo de colonias(Acapulco)
function abrirColoniasInfo(){
    window.open(window.location.origin + "/info_colonias_acapulco_inegi_2010", 'popup', 'width=' + (screen.width - 300) + ', height=' + (screen.height - 100) + ', left=' + 10 + ', top=' + 10 + '');
}




