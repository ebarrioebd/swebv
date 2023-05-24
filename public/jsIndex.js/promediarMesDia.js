//evita que no se selecciones mas de unno de los box 
function showContentResumen() { //$(document).on('ready', 
    $('input:checkbox.clMes').on('click', function() {
        var $box = $(this);
        if ($box.is(":checked")) {
            var group = "input:checkbox[name='clMesName']";
            $(group).prop("checked", false);
            $box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
    });
}
//function optMoD(){
$('input:checkbox.optMesDia').on('click', function() {
    console.log("ck")
    // in the handler, 'this' refers to the box clicked on
    var $box = $(this);
    if ($box.is(":checked")) {
        var group = "input:checkbox[name='optMesDiaN']";
        $(group).prop("checked", false);
        $box.prop("checked", true);
    } else {
        $box.prop("checked", false);
    }
});
//}
function addColProm(a) {
    var contDivPromMes = "";
    for (var i = 0; i < a.length; i++) {
        contDivPromMes += `<div class="row" id="nomColMes" onchange="javascript:showContentResumen()" style="width:90%;"><div class="col-1"><input class="clMes" name="clMesName"  type="checkbox" value="${JSON.parse(a[i])[1]}"></div><div class="col-10">${JSON.parse(a[i])[0]}</div></div>`;
    }
    document.getElementById("coloniasSelecDivProm").innerHTML = contDivPromMes + "";
}

function closeDivHistoMes() { //cierra divcloseDivHistoMes()
    document.getElementById("divHistoMes").style.display = "none";
}

function getDatMesProm() { //obtiene y analiza los datos por una fecha de rango 
    var checkselectNOM = [];
    //cbSelectAllCol
    $('input:checkbox.cbSelectAllCol').each(function() {
        if ($(this)[0].checked) {
            checkselectNOM.push($(this).val());
        }
    });
    document.getElementById("divHistoMes").style.display = "";
    addColProm(checkselectNOM);
    /**/
}
//agrupa Por Fechas Dias
function groupID(arr, id) {
    //console.log("arr",arr)
    let a = [
        []
    ]
    let k = 0;
    for (var i = 0; i < arr.length; i++) {
        if (i > 0 && JSON.stringify(arr[i][id]) !== JSON.stringify(arr[i - 1][id])) {
            a.push([])
            k++;
        }
        a[k].push(arr[i]);

    }
    return a;
}
//agrupa Por fechas Mes
function groupIDMes(arr, id) {
    let a = [
        []
    ]
    let k = 0;
    for (var i = 0; i < arr.length; i++) {
        if (i > 0 && JSON.stringify(arr[i][id]["m"]) !== JSON.stringify(arr[i - 1][id]["m"])) {
            a.push([])
            k++;
        }
        a[k].push(arr[i]);
    }
    return a;
}
//ordena Por FEchas aa-mm-dd
function GetSortOrderFecha(prop) {
    return function(a, b) {
        if (JSON.stringify(a[prop]) > JSON.stringify(b[prop])) {
            return 1;
        } else if (JSON.stringify(a[prop]) < JSON.stringify(b[prop])) {
            return -1;
        }
        return 0;
    }
}
//ordena por MES
function GetSortOrderFechaMes(prop) {
    return function(a, b) {
        if ((a[prop]["m"]) > (b[prop]["m"])) {
            return 1;
        } else if ((a[prop]["m"]) < (b[prop]["m"])) {
            return -1;
        }
        return 0;
    }
}
/*Canvas PAra el promedio de cada zona por un rango de fecha*/
//grapMesProm
const grapMesProm = document.getElementById('grapMesProm').getContext('2d');
let config_grapMesProm = {
    data: {
        labels: [],
        datasets: [{
            type: 'bar',
            fill: true,
            label: '',
            tension: 0.2,
            borderColor: 'rgb(255,255,255)',
            backgroundColor: gradient,
            data: []
        }]
    },
    options: {
        scales: {
            x: {
                grid: {
                    borderColor: "rgb(255,255,255)",
                    borderWidth: 3,
                },
                ticks: {
                    position: "start",
                    align: 'start',
                    color: "white"
                }
            },
            y: {
                grid: {
                    borderColor: "rgb(255,255,255)",
                    borderWidth: 3,
                },
                ticks: {
                    color: "white"
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: "rgb(255,255,255)",
                    boxWidth: 0,
                    font: {
                        size: 10,
                        family: "'Fredoka',sans-serif"
                    }
                }
            }
        },
        elements: {
            point: {
                radius: 5,
                pointStyle: "rectRounded",

            }
        }
    },
};
const grapMesPromChart = new Chart(grapMesProm, config_grapMesProm);

function promColFecha(a) { //Promedia la info por dias
    var s1 = 0;
    var promsColFecha = [];
    var promedio = "";
    var fechasD = [];
    var nom_col = [];
    for (var i = a.length - 1; i >= 0; i--) {
        for (var k = 0; k < a[i].length; k++) {
            for (var j = 0; j < a[i][k].length; j++) {
                s1 += a[i][k][j].cantidad_huevos
            }
            promsColFecha[i] = [];
            fechasD[i] = [];
            nom_col[i] = [];
            promsColFecha[i][k] = parseInt(s1 / a[i][k].length);
            //promsColFecha.push(parseInt(s1/a[i][0].length))
            promedio += "," + parseInt(s1 / a[i][0].length);
            s1 = 0;
            fechasD[i][k] = (a[i][k][0].fecha.y + "/" + a[i][k][0].fecha.m + "/" + a[i][k][0].fecha.d);
            nom_col[i][k] = (a[i][k][0].nom_col)
        }
    }
    grapMesPromChart.data.labels = fechasD;
    grapMesPromChart.data.datasets[0].data = promsColFecha;
    grapMesPromChart.data.datasets[0].backgroundColor = gradient;
    grapMesPromChart.data.datasets[0].label = 'Promedio de Huevos por ovitrampa :' + nom_col[0];
    grapMesPromChart.update();
}
//promedia la info por mes 
function promColFechaM(a) {
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var suma = 0;
    var promM = [],
        fechaM = [],
        nom_colM = a[0][0]["nom_col"];
    for (var i = 0; i < a.length; i++) {
        suma = 0;
        for (var j = 0; j < a[i].length; j++) {
            suma += a[i][j].cantidad_huevos;
        }
        promM[i] = parseInt(suma / a[i].length);
        fechaM[i] = meses[parseInt(a[i][0]["fecha"]["m"]) - 1]
    }
    console.log("Promedios:", promM);
    console.log("Fechas:", fechaM);
    console.log("Nom_Col", nom_colM);
    grapMesPromChart.data.labels = fechaM;
    grapMesPromChart.data.datasets[0].data = promM;
    grapMesPromChart.data.datasets[0].backgroundColor = gradient;
    grapMesPromChart.data.datasets[0].label = 'Promedio de Huevos por ovitrampa :' + nom_colM;
    grapMesPromChart.update();
}

function getDatMes() {
    var checkselectGid = [];
    $('input:checkbox.clMes').each(function() {
        if ($(this)[0].checked) {
            checkselectGid.push($(this).val());
        }
    });
    var f1Mes = document.getElementById("fecha1Mes").value;
    var f2Mes = document.getElementById("fecha2Mes").value;
    console.log("Gid:", checkselectGid)
    console.log("f1:", f1Mes.split("-"), "f2:", f2Mes.split("-"))
    if (f1Mes.length > 0 && f2Mes.length > 0) {
        fetch("/getDatFecha", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gid: checkselectGid,
                    f1: f1Mes,
                    f2: f2Mes
                })
            })
            .then(res => res.json())
            .then(data => {
                var checkMes = document.getElementById("checkMes").checked;
                var checkDia = document.getElementById("checkDia").checked;
                console.log(checkMes, checkDia)
                if (checkMes) {
                    //var dataP=[{"fecha": {"y": 2022,"m": 4,"d": 2 }},{"fecha": {"y": 2022,"m": 4,"d": 3 }},{"fecha": {"y": 2022,"m": 3,"d": 1 }},{"fecha": {"y": 2022,"m": 1,"d": 8 }},{"fecha": {"y": 2022,"m": 4,"d": 8 }},{"fecha": {"y": 2022,"m": 1,"d": 1 }}]
                    var oviM = (data.ovi).sort(GetSortOrderFechaMes("fecha"));
                    var dataG = groupIDMes(oviM, "fecha")
                    console.log(dataG)
                    promColFechaM(dataG);
                } else if (checkDia) {
                    var ovi = (data.ovi).sort(GetSortOrderFecha("fecha")) //ordenena las ovitrampas respecto a su Fecha
                    var oviGroupFecha = groupID(ovi, "fecha") // agrupa las ovitrampas por Params=fecha
                    console.log("OviAgrupadoPorFecha:", oviGroupFecha);
                    var oviGroupColFecha = [];
                    for (var i = 0; i < oviGroupFecha.length; i++) {
                        oviGroupColFecha.push(groupID(oviGroupFecha[i], "gid"))
                    }
                    console.log("oviGroupColFecha:", oviGroupColFecha)
                    promColFecha(oviGroupColFecha);
                } else {
                    alert("Seleccione uno .. ")
                }
                /**/
                console.log("Hecho")
            })
    } else {
        alert("Selecciones fecha")
    }

}