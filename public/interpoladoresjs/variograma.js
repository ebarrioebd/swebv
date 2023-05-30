
function getVariograma(x, y, z) { 
    let nugget = 0;
    let rango = 0;
    let sill = 0;
    let disij = [];
    let dist = [];
    var mD = []
    for (let i = 0; i < z.length; i++) {
        mD[i] = []
        for (let j = 0; j < z.length; j++) {
            mD[i][j] = Math.sqrt(Math.pow(x[i] - x[j], 2) + Math.pow(y[i] - y[j], 2)) * 100000
            if (i != j) {
                dist.push(Math.sqrt(Math.pow(x[i] - x[j], 2) + Math.pow(y[i] - y[j], 2)) * 100000); //todas las distancias que nos son el mismo punto !== 0
            }
        }
    }
    //--//remplace//console.log("mD:",mD)
    dist.sort((a, b) => { return a - b })
    rango = dist[dist.length - 1]//toma la distancia mas larga para obtener el rango
    //--//remplace//console.log("rango:", rango)
    //indica la cantidad de intervalos
    let lags = 50//((z.length*z.length-z.length)/2)>30?30:((z.length*z.length-z.length)/2);
    ////--////--//remplace//console.log("lags:::"+lags)
    let tolerance = rango / lags;//la tolerancia crea un intervalo para buscar los pares
    ////--////--//remplace//console.log("tolerance::"+tolerance)
    let lag = []
    let semi = []
    let par = []
    let semiva = [];
    let lagsemi = []
    for (let k = 0; k < lags; k++) {
        par[k] = 0;
        lag[k] = 0
        semi[k] = 0
    }
    let dxij = 0
    let disMax = 0
    for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < x.length; j++) {
            for (let k = 0; k < lags; k++) {
                if (i != j) {
                    dxij = Math.sqrt(Math.pow(x[i] - x[j], 2) + Math.pow(y[i] - y[j], 2)) * 100000;
                    if (dxij > (k) * tolerance & dxij <= (k + 1) * tolerance && dxij <= (rango / 1)) {//
                        lag[k] += dxij;//se suman las distancia de cada par, asi despues promeidarlas
                        semi[k] += Math.abs(z[i] - z[j])// Math.pow(z[i] - z[j],1);//se suman los Zi_Z_j en el intervalo de los puntos que estan en el intervalo de busqueda de los pares
                        par[k] += 1;//se agregan los pares encontrados dentro del intervalo, cada par encontrado aumnta en uno
                    }
                    //if(disMax<=dxij){
                    //disMax=dxij
                    //}
                }


            }
        }
    }
    for (let k = 0; k < lags; k++) {
        if (par[k] != 0) {
            lag[k] /= par[k] //promedia las distancia a la que encuetra los pares para obtener los lags
            semi[k] /= (2 * par[k])//par[k] //se divide los la dif de los valores entre los números de pares encontrado en el intervalo segun la formula del variograma
        }
    }
    //remplace//console.log("lag:", lag)
    //remplace//console.log("SEmivarianza....")
    for (let k = 0; k < lags; k++) {
        if (lag[k] > 0 & semi[k] > 0) {
            //se agregan los lags de distancias a lagsemi
            lagsemi.push(lag[k])
            //se agregan las varianzas a semiva
            semiva.push(semi[k])
        }
    }
    //remplace//console.log("Rango:", rango)
    rango = lagsemi[lagsemi.length - 1] - lagsemi[0]
    //remplace//console.log("Rango:", rango)
    return { rango: parseInt(rango), lags: lagsemi, semi: semiva }
};
self.addEventListener('message', function (e) {
    let inf_ovi = e.data.ovi;
    let x = []
    let y = []
    let z = []
    for (let i = 0; i < inf_ovi.length; i++) {
        //ovitrampas.push(inf_ovi[i])
        z.push(inf_ovi[i].cantidad_huevos);
        x.push(parseFloat(inf_ovi[i].longitud));
        y.push(parseFloat(inf_ovi[i].latitud));
    }
    let variograma = getVariograma(x, y, z);
    
    //remplace//console.log("Variograma:::::", variograma);
    postMessage({ variograma: variograma, x: x, y: y, z: z })
});