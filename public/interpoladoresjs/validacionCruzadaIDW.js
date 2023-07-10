 function Zi(centro, x, y, z, exp, maxDistance) {
     let d = 0;
     let s1 = 0 // new Array();
     let s2 = 0 // new Array();
     for (let i = 0; i < x.length; i++) {
         d = Math.sqrt(Math.pow(parseFloat(x[i]) - centro[0], 2) + Math.pow(parseFloat(y[i]) - centro[1], 2)) //* 100000;

         s1 += z[i] / Math.pow(d, exp);
         s2 += 1 / Math.pow(d, exp);
     }

     return s1 / s2
 }

 self.addEventListener('message', function(e) {
     console.log(e.data)
     console.time("t1");
     var x = [],
         y = [],
         z = [];
    var dataovi=e.data.ovi
     for (var i = 0; i < dataovi.length; i++) {
         x[i] = dataovi[i].latitud
         y[i] = dataovi[i].longitud
         z[i] = dataovi[i].cantidad_huevos
     }
     var p = e.data.p
     let n = x.length
     var ve = []
     var vr = []
     var err = []
     for (var k = 0; k < n; k++) {
         let lat = x.slice()
         let lat_inter = lat.splice(k, 1)[0]
         let long = y.slice()
         let long_inter = long.splice(k, 1)[0]
         let zv = z.slice()
         zv.splice(k, 1)
         ve[k] = Zi([lat_inter, long_inter], lat, long, zv, p, 200)
         vr[k] = z[k]
         err[k] = ve[k] - vr[k]
         postMessage({type:"progress",p:(k*100)/n})
     }
     let error = []
     let erro_sm = []
     for (var i = 0; i < ve.length; i++) {
         error[i] = ve[i] - z[i]
     }
     console.timeEnd("t1");
     postMessage({type:"result", ve: ve, zv: z, error: error })
 })