//importScripts('math.js'); 
//--console.log("Math.js")

//invertir MAtriz
var Sylvester = {}

Sylvester.Matrix = function() {}
Sylvester.Matrix.create = function(elements) {
    var M = new Sylvester.Matrix()
    return M.setElements(elements)
}

Sylvester.Matrix.I = function(n) {
    var els = [],
        i = n,
        j
    while (i--) {
        j = n
        els[i] = []
        while (j--) {
            els[i][j] = i === j ? 1 : 0
        }
    }
    return Sylvester.Matrix.create(els)
}
Sylvester.Matrix.prototype = {
    dup: function() {
        return Sylvester.Matrix.create(this.elements)
    },

    isSquare: function() {
        var cols = this.elements.length === 0 ? 0 : this.elements[0].length
        return this.elements.length === cols
    },

    toRightTriangular: function() {
        if (this.elements.length === 0) return Sylvester.Matrix.create([])
        var M = this.dup(),
            els
        var n = this.elements.length,
            i,
            j,
            np = this.elements[0].length,
            p
        for (i = 0; i < n; i++) {
            if (M.elements[i][i] === 0) {
                for (j = i + 1; j < n; j++) {
                    if (M.elements[j][i] !== 0) {
                        els = []
                        for (p = 0; p < np; p++) {
                            els.push(M.elements[i][p] + M.elements[j][p])
                        }
                        M.elements[i] = els
                        break
                    }
                }
            }
            if (M.elements[i][i] !== 0) {
                for (j = i + 1; j < n; j++) {
                    var multiplier = M.elements[j][i] / M.elements[i][i]
                    els = []
                    for (p = 0; p < np; p++) {
                        // Elements with column numbers up to an including the number of the
                        // row that we're subtracting can safely be set straight to zero,
                        // since that's the point of this routine and it avoids having to
                        // loop over and correct rounding errors later
                        els.push(
                            p <= i ? 0 : M.elements[j][p] - M.elements[i][p] * multiplier
                        )
                    }
                    M.elements[j] = els
                }
            }
        }
        return M
    },

    determinant: function() {
        if (this.elements.length === 0) {
            return 1
        }
        if (!this.isSquare()) {
            console.log("not isSquare")
            return null
        }
        var M = this.toRightTriangular()
        var det = M.elements[0][0],
            n = M.elements.length
        for (var i = 1; i < n; i++) {
            det = det * M.elements[i][i]
        }
        return det
    },

    isSingular: function() {
        return this.isSquare() && this.determinant() === 0
    },

    augment: function(matrix) {
        if (this.elements.length === 0) {
            return this.dup()
        }
        var M = matrix.elements || matrix
        if (typeof M[0][0] === 'undefined') {
            M = Sylvester.Matrix.create(M).elements
        }
        var T = this.dup(),
            cols = T.elements[0].length
        var i = T.elements.length,
            nj = M[0].length,
            j
        if (i !== M.length) {
            return null
        }
        while (i--) {
            j = nj
            while (j--) {
                T.elements[i][cols + j] = M[i][j]
            }
        }
        return T
    },

    inverse: function() {
        if (this.elements.length === 0) {
            console.log("===0")
            return null
        }
        if (!this.isSquare() || this.isSingular()) {
            console.log("isSingular:",this.isSingular(),"  isSquare:",this.isSquare())
            return null
        }
        var n = this.elements.length,
            i = n,
            j
        var M = this.augment(Sylvester.Matrix.I(n)).toRightTriangular()
        var np = M.elements[0].length,
            p,
            els,
            divisor
        var inverse_elements = [],
            new_element
        // Sylvester.Matrix is non-singular so there will be no zeros on the
        // diagonal. Cycle through rows from last to first.
        while (i--) {
            // First, normalise diagonal elements to 1
            els = []
            inverse_elements[i] = []
            divisor = M.elements[i][i]
            for (p = 0; p < np; p++) {
                new_element = M.elements[i][p] / divisor
                els.push(new_element)
                // Shuffle off the current row of the right hand side into the results
                // array as it will not be modified by later runs through this loop
                if (p >= n) {
                    inverse_elements[i].push(new_element)
                }
            }
            M.elements[i] = els
            // Then, subtract this row from those above it to give the identity matrix
            // on the left hand side
            j = i
            while (j--) {
                els = []
                for (p = 0; p < np; p++) {
                    els.push(M.elements[j][p] - M.elements[i][p] * M.elements[j][i])
                }
                M.elements[j] = els
            }
        }
        return Sylvester.Matrix.create(inverse_elements)
    },

    setElements: function(els) {
        var i,
            j,
            elements = els.elements || els
        if (elements[0] && typeof elements[0][0] !== 'undefined') {
            i = elements.length
            this.elements = []
            while (i--) {
                j = elements[i].length
                this.elements[i] = []
                while (j--) {
                    this.elements[i][j] = elements[i][j]
                }
            }
            return this
        }
        var n = elements.length
        this.elements = []
        for (i = 0; i < n; i++) {
            this.elements.push([elements[i]])
        }
        return this
    },
}

function invMM(elements) {
    const mat = Sylvester.Matrix.create(elements).inverse()
    if (mat !== null) {
        return mat.elements
    } else {
        return null
    }
}

//invertir matriz

function invM(matriz) {
    // Obtener el tamaño de la matriz
    let n = matriz.length;

    // Crear una matriz identidad para almacenar la matriz invertida
    let matrizInvertida = [];
    for (let i = 0; i < n; i++) {
        matrizInvertida[i] = [];
        for (let j = 0; j < n; j++) {
            if (i === j) {
                matrizInvertida[i][j] = 1;
            } else {
                matrizInvertida[i][j] = 0;
            }
        }
    }
    // Crear una copia de la matriz original para realizar las operaciones
    let matrizCopia = [];
    for (let i = 0; i < n; i++) {
        matrizCopia[i] = [];
        for (let j = 0; j < n; j++) {
            matrizCopia[i][j] = matriz[i][j];
        }
    }
    // Algoritmo Gauss-Jordan para invertir la matriz
    for (let i = 0; i < n; i++) {
        // Obtener el elemento diagonal
        let elementoDiagonal = matrizCopia[i][i];

        // Normalizar la fila actual
        for (let j = 0; j < n; j++) {
            matrizCopia[i][j] /= elementoDiagonal;
            matrizInvertida[i][j] /= elementoDiagonal;
        }
        // Hacer ceros en las columnas restantes
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                let factor = matrizCopia[j][i];
                for (let k = 0; k < n; k++) {
                    matrizCopia[j][k] -= factor * matrizCopia[i][k];
                    matrizInvertida[j][k] -= factor * matrizInvertida[i][k];
                }
            }
        }
    }

    return matrizInvertida;
}

//fin de invertir matriz

function c(o, b) {
    //--console.log(o, b);
}
function transpose(matrix) {
    const rows = matrix.length,
        cols = matrix[0].length;
    const grid = [];
    for (let j = 0; j < cols; j++) {
        grid[j] = Array(rows);
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[j][i] = matrix[i][j];
        }
    }
    return grid;
}
function mult(a, b) {
    var aNumRows = a.length,
        aNumCols = a[0].length,
        bNumRows = b.length,
        bNumCols = b[0].length,
        m = new Array(aNumRows); // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
            m[r][c] = 0; // initialize the current cell
            for (var i = 0; i < aNumCols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}
//minimos cuadrados sin nugget
function nimimoSquares(h,a,y){
    let p=0
    let q=0
    let beta0=0
    let vt=0
    for(let i=0;i<h.length;i++){
        vt=(1 - Math.exp(-(1.0 / (1 / 3))* h[i] / a))//vsriogrsmsteorico
        p+=vt*y[i]
        q+=Math.pow(vt,2) 
    }
    beta0=p/q
    //--console.log("BETA+=== :",beta0)
    return beta0
}
function modelExp(h,a){
    //return (1.0-Math.pow(Math.exp(-1*(h/a)),2))//gaussiano
    //return (1.0-Math.exp(-3*(h/a)))//exponecial
    return ((3/2)*(h/a)-(1/2)*Math.pow(h/a,3))//esferico

}
//minimos cuadrados ordinarios
function OrdinaryLeastsquares(X, Y, h, a) {
    //funcion exponencial
    //genera valores del variogrma teorico del valor de Xs
    for (var i = 0; i < Y.length; i++) {
        X[i][1] = modelExp(h[i],a)
        //X[i][1] = 1.0 - Math.exp(-(1.0 / (1 / 3)) * h[i] / a); // 1.0 - Math.exp(-(1.0 / A) * lagsemi[i] /rango );
    }
    c("X:", X)
    //se ajusta el variograma teorico
    var Xt = transpose(X) // math.transpose(X)
    c("1")
    var XtX = mult(Xt, X) //math.multiply(Xt, X) 
    var XtXinv = invM(XtX);
    c("2")
    var xinvxt = mult(XtXinv, Xt)
    var ny = Y.length;
    var ya = Array(ny).fill().map(() => Array(ny).fill(0));
    for (var i = 0; i < ny; i++) {
        ya[i] = [Y[i]];
    }
    c("3")
    return mult(xinvxt, ya);
}

//interpolador IDW
function Zi(centro, puntos, exp) {
    exp = 3
    let d = 0;
    let s1 = 0// new Array();
    let s2 = 0// new Array();
    for (let i = 0; i < puntos.length; i++) {
        d = Math.sqrt(Math.pow(parseFloat(puntos[i].longitud) - centro[0], 2) + Math.pow(parseFloat(puntos[i].latitud) - centro[1], 2));//turf.distance([puntos[i].longitud,puntos[i].latitud], centro, { units: 'meters' });
            s1 += puntos[i].cantidad_huevos / Math.pow(d, exp)
            s2 += 1 / Math.pow(d, exp) 
    }
    return s1 / s2
}
function getVariograma(x, y, z) {
    let nugget = 0;
    let rango = 0;
    let sill = 0;
    let disij = [];
    let dist = [];
    var mD=[]
    for (let i = 0; i < z.length; i++) {
        mD[i]=[]
        for (let j = 0; j < z.length; j++) {
            mD[i][j]=Math.sqrt(Math.pow(x[i] - x[j], 2) + Math.pow(y[i] - y[j], 2)) * 100000
            if (i != j) {
                dist.push(Math.sqrt(Math.pow(x[i] - x[j], 2) + Math.pow(y[i] - y[j], 2)) * 100000); //todas las distancias que nos son el mismo punto !== 0
            }
        }
    } 
    //--console.log("mD:",mD)
    dist.sort((a, b) => { return a - b })
    rango = dist[dist.length-1]/2//toma la distancia mas larga para obtener el rango
    //--console.log("rango:", rango)
    //indica la cantidad de intervalos
    let lags =((z.length*z.length-z.length)/2)>40?40:((z.length*z.length-z.length)/2);
    ////--////--console.log("lags:::"+lags)
    let tolerance = rango / lags;//la tolerancia crea un intervalo para buscar los pares
    ////--////--console.log("tolerance::"+tolerance)
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
    let disMax=0
    for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < x.length; j++) {
            for (let k = 0; k < lags; k++) {
                if (i != j) {
                    dxij = Math.sqrt(Math.pow(x[i] - x[j], 2) + Math.pow(y[i] - y[j], 2)) * 100000; 
                    if (dxij > (k) * tolerance & dxij <= (k + 1) * tolerance) {
                        lag[k] += dxij;//se suman las distancia de cada par, asi despues promeidarlas
                        semi[k] +=Math.abs(z[i] - z[j])// Math.pow(z[i] - z[j],1);//se suman los Zi_Z_j en el intervalo de los puntos que estan en el intervalo de busqueda de los pares
                        par[k] += 1;//se agregan los pares encontrados dentro del intervalo, cada par encontrado aumnta en uno
                    }
                    if(disMax<=dxij){
                        disMax=dxij
                    }
                }


            }
        }
    }
    //--console.log("DISTMAX:",disMax)
    //--console.log("par:", par)
    //--console.log("Semi:", semi)
    //--console.log("lag:", lag)
    for (let k = 0; k < lags; k++) {
        if (par[k] != 0) {
            lag[k] /= par[k] //promedia las distancia a la que encuetra los pares para obtener los lags
            semi[k] /= (2 * par[k])//par[k] //se divide los la dif de los valores entre los números de pares encontrado en el intervalo segun la formula del variograma
        }
    }
    //--////--console.log("SEmivarianza....")
    for (let k = 0; k < lags; k++) {
        if (lag[k] > 0 & semi[k] > 0) {
            //se agregan los lags de distancias a lagsemi
            lagsemi.push(lag[k])
            //se agregan las varianzas a semiva
            semiva.push(semi[k])
        }
    } 
    //el rango se obtiene al restar el lags maximo menos el minimo 
    //Ajuste por minimos cuadrados ordinarios
    let Y = semiva;
    let X = Array(Y.length).fill().map(() => Array(2).fill(1));
    //Ajuste sin el nugget*********
    //*************let beta=nimimoSquares(lagsemi,rango,semiva)
    let beta=0
    //--console.log("Betaaaaaaaaaaa:",typeof(beta),beta)
    //rango=1200
    //W0,W1 son los valores que minimizan el error (Y(h,W)-Y*(h))^2 y w0,w1 ajustan  Y(h,W) a los valores de Y*(h) 
    let W = OrdinaryLeastsquares(X, Y, lagsemi, rango); //valores que minimizan el error cuadratico
    //W[0][0]=0,W[1][0]=10 
    nugget = W[0]// > 0 ? W[0]: 0;
    //--////--console.log("nugget:"+nugget)
    sill = parseFloat(W[1]) + parseFloat(nugget);
    //w0 = W[0];
    let sill_partial = W[1];
    let n = x.length;
    //conseguir la Matriz del Variograma Teorico de los puntos de muestra
    let mvt = Array(n + 1).fill(1).map(() => Array(n + 1).fill(1));
    let mvt2=Array(n + 1).fill(1).map(() => Array(n + 1).fill(1));
    //--////--console.log("MVT=",mvt)
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            //mvt[i][j] = W[0][0] + W[1][0] * (1.0 - Math.exp(-(1.0 / (1 / 3)) * (Math.sqrt(Math.pow(x[j] - x[i], 2) + Math.pow(y[j] - y[i], 2)) * 100000 / rango)))
            mvt[i][j] = W[0][0] + W[1][0] * modelExp(Math.sqrt(Math.pow(x[j] - x[i], 2) + Math.pow(y[j] - y[i], 2)) * 100000,rango)
            //*************mvt2[i][j] = beta*(1.0 - Math.exp(-(1.0 / (1 / 3)) * (Math.sqrt(Math.pow(x[j] - x[i], 2) + Math.pow(y[j] - y[i], 2)) * 100000 / rango)))
        } 
        z[i] = [z[i]]
    }
    mvt[n][n] = 0;
    console.log("mvt:",mvt)
    //*************mvt2[n][n] = 0;
    //--console.log("=",mvt)
    //--console.log("-",mvt2) 
    let matriz_variograma_teorico = invM(mvt) 
    console.log("matriz_variograma_teorico::",matriz_variograma_teorico)
    let matriz_variograma_teorico2 =[]//************* invM(mvt2) 
    //--console.log("matriz_variograma_teorico2::",matriz_variograma_teorico2)
    return {mD:mD, nugget: nugget, mvt2: matriz_variograma_teorico2, mvt: matriz_variograma_teorico, sill: sill, rango: rango, lags: lagsemi, semi: semiva, C1: sill_partial,beta:beta}
};
function estimar(lat, long, variograma, x, y, z) {
    //*************let beta=variograma.beta
    let _Y2=[]
    //c(lat,long)
    let _Y = [];

    for (let i = 0; i < x.length; i++) {
        //_Y[i] = [variograma.nugget[0] + variograma.C1[0] * (1.0 - Math.exp(-(1.0 / (1 / 3)) * ((Math.pow(Math.pow(lat - x[i], 2) + Math.pow(long - y[i], 2), 0.5)) * 100000 / variograma.rango)))];
        _Y[i] = [variograma.nugget[0] + variograma.C1[0] * modelExp((Math.pow(Math.pow(lat - x[i], 2) + Math.pow(long - y[i], 2), 0.5)) * 100000,variograma.rango)]
        //*************_Y2[i] = [beta*(1.0 - Math.exp(-(1.0 / (1 / 3)) * ((Math.pow(Math.pow(lat - x[i], 2) + Math.pow(long - y[i], 2), 0.5)) * 100000 / variograma.rango)))];
         
    }
    //*************_Y2[x.length] = [1]

    _Y[x.length] = [1]
    //c("_Y",_Y)
    //*************let pesos2 = mult(variograma.mvt2, _Y2)//math.multiply(variograma.K, math.transpose(_Y));
    //*************pesos2 = pesos2.slice(0, x.length); 
    //calulor de los pesos y el parametro de lagrange
    let pesos = mult(variograma.mvt, _Y)//math.multiply(variograma.K, math.transpose(_Y));
    pesos = pesos.slice(0, x.length);
    //*************return [mult(transpose(pesos), z),mult(transpose(pesos2), z)]
    return [mult(transpose(pesos), z), []]
}
self.addEventListener('message', function (e) {
    let inf_ovi = e.data.ovi;
    let zona = e.data.zona;
 
    let puntos_i=e.data.pi
    //--console.log("puntos_i::",puntos_i)
    let cajaMulti = e.data.cajaMulti;
    let tamCuadro = e.data.tamCuadro;
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
    //--console.log("Variograma:::::",variograma);
    //--console.time("estimar")
    let k = 0,
        zi = [], zidw = [],zibeta=[];
    let x_c = 0;//centro punto x
    let y_c = 0;//centro punto y
    //--////--console.log("init:",x_c, y_c, variograma,x,y,z)
    for (let i=0;i <puntos_i.length; i++) { 
        x_c = puntos_i[i][0][0];
        y_c = puntos_i[i][0][1]
        if (puntos_i[i][1]) {  
            [ zi[k] , zibeta[k] ] = estimar(x_c, y_c, variograma, x, y, z); // metodo Kriging
            zidw[k] = Zi([x_c, y_c], inf_ovi,3);//metodo idw
        } else {
            zi[k] = -1;
            zidw[k] = -1;
            zibeta[k]=-1
        }
        k++;
    }
    //--console.timeEnd("estimar")
    postMessage({
        mD:variograma.mD,
        beta:variograma.beta,
        zibeta:zibeta, 
        zi: zi, 
        zidw: zidw, 
        h: variograma.lags, 
        semiva: variograma.semi, 
        nugget: parseInt(variograma.nugget[0]), 
        rango: parseInt(variograma.rango), 
        sill: parseInt(variograma.sill), 
        mD: variograma.mD, 
        z: z
    });
}, false); 