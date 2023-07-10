function maxDistance(x, y) {
    let dist = [];
    //let d=0
    //let d_aux=Math.sqrt(Math.pow(x[1] - x[0], 2) + Math.pow(y[0] - y[1], 2)) * 100000
    for (let i = 0; i < x.length; i++) {
        for (let j = i; j < x.length; j++) {
            if (i != j) {
                dist.push(Math.sqrt(Math.pow(x[i] - x[j], 2) + Math.pow(y[i] - y[j], 2)) * 100000); //todas las distancias que nos son el mismo punto !== 0

            }
        }
    }
    dist.sort((a, b) => { return a - b })
    return dist[dist.length - 1] //toma la distancia mas larga para obtener el rango
}
//interpolador IDW
function Zi(centro, puntos, exp, maxD) {
    let d = 0;
    let s1 = 0 // new Array();
    let s2 = 0 // new Array();
    for (let i = 0; i < puntos.length; i++) {
        d = Math.sqrt(Math.pow(parseFloat(puntos[i].longitud) - centro[0], 2) + Math.pow(parseFloat(puntos[i].latitud) - centro[1], 2)) * 100000; //turf.distance([puntos[i].longitud,puntos[i].latitud], centro, { units: 'meters' });

        s1 += puntos[i].cantidad_huevos / Math.pow(d, exp);
        s2 += 1 / Math.pow(d, exp);
    }

    return s1 / s2
}

self.addEventListener('message', function(e) {
    let inf_ovi = e.data.ovi;

    let puntos_i = e.data.pi
    let p = e.data.p
    let k = 0,
        zidw = [];
    let ipi = parseInt(puntos_i.length / 10) //numero postMSG al gui
    console.log(" puntos_i.length1:", puntos_i.length)
    for (let i = 0; i < puntos_i.length; i++) {

        if (puntos_i[i].length > 0) {
            zidw[k] = Zi([puntos_i[i][0], puntos_i[i][1]], inf_ovi, p, 1); //metodo idw   

        } else {
            zidw[k] = -1;
        }
        k++;
        if (i % ipi == 0) { self.postMessage({ type: "progress", p: (i * 100) / puntos_i.length }) }
    }
    self.postMessage({ type: "result", zi: zidw })
});