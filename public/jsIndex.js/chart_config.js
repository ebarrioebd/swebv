console.log("chart_config.js")
//Configuracion para las graficas de la aplicacion
/**
 * grafica de dona
 * Porcentaje de Huevos por Colonia
 */
const ctx = document.getElementById('graf_ph').getContext('2d');
let config = { 
    type: 'doughnut', 
    data: {
        labels: [],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: [],
            hoverOffset: 4
        }]
    },
    options: { 
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: 'rgb(255, 255, 255)'
                }
            }
        }
    }
};
const porcentaje_por_colonia = new Chart(ctx, config);
/**
 * grafica porcentaje de ovitrampa positiva
 */
const ctx_pop = document.getElementById("graph_pop").getContext('2d');
var gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, "rgba(254,0,0,0.9)")
gradient.addColorStop(0.1, "rgba(254,62,0,0.9)")
gradient.addColorStop(0.2, "rgba(254,146,0,0.9)")
gradient.addColorStop(0.3, "rgba(254,242,0,0.7)")
gradient.addColorStop(0.4, "rgba(204,254,0,0.7)")
gradient.addColorStop(0.7, "rgba(123,254,0,0.9)")
gradient.addColorStop(1, "rgba(0,254,0,0.9)")
let config_pop = {
    data: {
        labels: [],
        datasets: [{
            type: 'bar',
            fill: true,
            label: 'Porcentaje de Ovitrampas positivas',
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
                    borderWidth: 1,
                },
                ticks: {
                    position: "center",
                    align: 'center',
                    color: "white"
                },
                display: true,
            },
            y: {
                grid: {
                    borderColor: "rgb(255,255,255)",
                    borderWidth: 1,
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
                        size: 14,
                        family: "'Fredoka',sans-serif"
                    }
                }
            }
        },
        elements: {
            point: {
                radius: 8,
                pointStyle: "rectRounded",

            }
        }
    },
};
const chart_porcentaje_ovi_positiva = new Chart(ctx_pop, config_pop);



/**
 * promedio de huevos por hovtrampas
 */
const config_pm = {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            type: 'bar',
            fill: true,
            label: 'Promedio de huevos por ovitrampas',
            tension: 0.2,
            borderColor: 'rgb(255,255,255)',
            backgroundColor: 'rgb(0,90,255)',
            data: []
        }]
    },
    options: {
        scales: {
            x: {
                grid: {
                    borderColor: "rgb(255,255,255)",
                    borderWidth: 1,
                },
                ticks: {
                    position: "center",
                    align: 'center',
                    color: "white"
                },
                display: true,
            },
            y: {
                grid: {
                    borderColor: "rgb(255,255,255)",
                    borderWidth: 1,
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
                        size: 14,
                        family: "'Fredoka',sans-serif"
                    }
                }
            }
        },
        elements: {
            point: {
                radius: 8,
                pointStyle: "rectRounded",

            }
        }
    },
};
const chart_pm = document.getElementById("graphPM").getContext("2d");
const chart_promedio_huevos = new Chart(chart_pm, config_pm);


/**
 * Chart Variograma
 * 
 */
const ctxVariograma = document.getElementById('variograma').getContext('2d');
const chartVariograma = new Chart(ctxVariograma, {
    type: 'scatter',
    data: {
        labels: [], //add
        datasets: [{
            type: 'bubble',
            data: [], //add
            label: 'Variograma Experimental',
            options: {},
            backgroundColor: 'rgb(0, 0, 255)'
        },
        {
            type: 'line',
            label: 'Variograma Teórico',
            data: [], //add
            fill: false,
            pointHitRadius: 0,
            pointBorderWidth: 0,
            pointBackgroundColor: 'rgb(255, 0, 0)',
            backgroundColor: 'rgb(255, 0, 0)',
            borderColor: 'rgb(255, 0, 0)',
            tension: 0.1
        }
        ]
    },
    options: {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Distancia (m)'
                },
                beginAtZero: true
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Semivarianza'
                },
                beginAtZero: true
            }
        }
    }
});
var charHistograma = document.getElementById("histogramaChart");
var densityData = {
    label: 'Cantidad de Huevos',
    data: [],//hist.frec,
    backgroundColor: ['rgba(0, 0, 255, 0.8)']
};
var barChartHistograma = new Chart(charHistograma, {
    type: 'bar',
    data: {
        labels: [],// hist.labelClass,
        datasets: [densityData]
    }, options: {
        scales: {
            x: {
                grid: {
                    borderColor: "rgb(0,0,0)",
                    borderWidth: 3,
                },
                ticks: {
                    color: "black"
                },
                title: {
                    display: true,
                    text: 'Cantidad de huevos'
                },
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 20
                    }
                }
            },
            y: {
                grid: {
                    borderColor: "rgb(0,0,0)",
                    borderWidth: 3,
                },
                ticks: {
                    color: "black"
                },
                title: {
                    display: true,
                    text: 'Frecuencia',
                    size: 32
                },
                beginAtZero: true, 
                ticks: {
                    font: {
                        size: 20
                    }
                }
            }
        }, plugins: {
            legend: {
                display: true,
                labels: {
                    color: "rgb(0,0,0)",
                    boxWidth: 0,
                    font: {
                        size: 18,
                        family: "'Fredoka',sans-serif"
                    }
                }
            }
        },
    }
});
Chart.defaults.font.size = 15;
/*
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
const chartVariograma = new Chart(ctxVariograma, configVariograma);*/

const ctx_error = document.getElementById("z_v").getContext("2d");
const graf_vz = new Chart(ctx_error,{
    type: 'scatter',
    data: 
         {
            datasets: [{
                type: 'bubble',
                label: ['Modelo Kriging ordinario'],
                data: [],
                backgroundColor: "rgb(0, 0, 255)",
                display: true,

                },
                {
                    type: 'line',
                    label: 'Recta ajustada',
                    data: [], //add
                    fill: false,
                    pointHitRadius: 0,
                    pointBorderWidth: 0,
                    pointBackgroundColor: 'rgb(255, 0, 0)',
                    backgroundColor: 'rgb(255, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
            tension: 0
        }
                ]
        }
    ,
    options: {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Valor Real'
                },
                beginAtZero: false
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Valor estimado'
                },
                beginAtZero: false
            }
        }
    }
}); 

///charError
const error_graf = document.getElementById('error_prediccion').getContext('2d');
 
const chart_error = new Chart(error_graf, {
    type: 'line',
    data: {
            labels: [],
            datasets: [{
                label: 'Error de estimación',
                data: [],
                fill: false,
                pointHitRadius: 0,
                pointBorderWidth: 0,
                pointBackgroundColor: 'rgb(255, 0, 0)',
                backgroundColor: 'rgb(255, 0, 0)',
                borderColor: 'rgb(255, 0, 0)',
                tension: 0.1
            }]
    },
    options: {
        scales: {
            x: {
                display: false,
                title: {
                    display: true,
                    text: 'Distancia (m)'
                },
                beginAtZero: false
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Error'
                },
                beginAtZero: false
            }
        }
    }
}); 