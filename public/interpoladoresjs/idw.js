//interpolador IDW
function Zi(centro, puntos, exp, maxDistance) {
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
    let k = 0,
        zidw = [];
    let x_c = 0; //centro punto x
    let y_c = 0; //centro punto y 
    for (let i = 0; i < puntos_i.length; i++) {
        x_c = puntos_i[i][0][0];
        y_c = puntos_i[i][0][1]
        if (puntos_i[i][1]) {
            zidw[k] = Zi([x_c, y_c], inf_ovi, 2, 200); //metodo idw  
        } else {
            zidw[k] = -1;
        }
        k++;
    }
    console.log(zidw)
    postMessage({ zi: zidw })
});