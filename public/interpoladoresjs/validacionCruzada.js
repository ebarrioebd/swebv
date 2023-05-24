
//invertir MAtriz
var Sylvester = {}
Sylvester.Matrix = function () { }
Sylvester.Matrix.create = function (elements) {
    var M = new Sylvester.Matrix()
    return M.setElements(elements)
}

Sylvester.Matrix.I = function (n) {
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
    dup: function () {
        return Sylvester.Matrix.create(this.elements)
    },

    isSquare: function () {
        var cols = this.elements.length === 0 ? 0 : this.elements[0].length
        return this.elements.length === cols
    },

    toRightTriangular: function () {
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

    determinant: function () {
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

    isSingular: function () {
        return this.isSquare() && this.determinant() === 0
    },

    augment: function (matrix) {
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

    inverse: function () {
        if (this.elements.length === 0) {
            console.log("===0")
            return null
        }
        if (!this.isSquare() || this.isSingular()) {
            console.log("isSingular:", this.isSingular(), "  isSquare:", this.isSquare())
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

    setElements: function (els) {
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

function invM(elements) {
    const mat = Sylvester.Matrix.create(elements).inverse()
    if (mat !== null) {
        return mat.elements
    } else {
        return null
    }
}

//invertir matriz

function invMM(matriz) {
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
function modelExp(h, a, m_s) {
    switch (m_s) {
        case "exp":
            return (1.0 - Math.exp(-3 * (h / a)))//exponecial
            break;
        case "gauss":
            return (1.0 - Math.exp(-3 * Math.pow(h / a, 2)))//gaussiano
            break
        case "esf":
            return h > a ? 1 : ((3 / 2) * (h / a) - (1 / 2) * Math.pow(h / a, 3))//esferico
            break
    }
}

function estimar(lat, long, variograma, x, y, z, mvt, m_s) {
    //console.log("estimar:",variograma.nugget,variograma.sill_parcial,modelExp((Math.pow(Math.pow(lat - x[0], 2) + Math.pow(long - y[0], 2), 0.5)) * 100000,variograma.rango,m_s))      
    c(lat, long)
    let _Y = [];
    for (let i = 0; i < x.length; i++) {
        z[i] = [z[i]]
        _Y[i] = [variograma.nugget + variograma.sill_parcial * modelExp((Math.pow(Math.pow(lat - x[i], 2) + Math.pow(long - y[i], 2), 0.5)) * 100000, variograma.rango, m_s)]
        //console.log(_Y[i])   
    }
    _Y[x.length] = [1]
    //console.log("_Y:",_Y)
    //calulor de los pesos y el parametro de lagrange
    //console.log("MVT:",mvt)
    let pesos = mult(mvt, _Y)
    //console.log("pesos::",pesos)
    //console.log("Z:",z)
    pesos = pesos.slice(0, x.length);
    return mult(transpose(pesos), z)[0]
}
self.addEventListener('message', function (e) {
    //console.log("******************************************************************8")
    let variograma = e.data.semivariograma
    //console.log("VJSCROSS:",e.data)
    let v_estimados = []
    //console.log("nugget:",variograma.nugget)
    //console.log("sill_parcial:",variograma.sill_parcial)
    //console.log("[rango,modelo]:",[variograma.rango,variograma.modelo])
    let cantidad_de_puntos_a_estimar = 40
    let x = (e.data.x).splice(0, cantidad_de_puntos_a_estimar)

    console.log("lengthx:", x.length)
    let y = e.data.y.splice(0, cantidad_de_puntos_a_estimar)

    console.log("lengthy:", y.length)
    let z = e.data.z.splice(0, cantidad_de_puntos_a_estimar)

    console.log("lengthx:", z.length)
    let n = x.length > cantidad_de_puntos_a_estimar ? cantidad_de_puntos_a_estimar : x.length
    console.log("n:", n)
    for (let k = 0; k < n; k++) {
        let lat = x.slice()
        let lat_inter = lat.splice(k, 1)[0]
        let long = y.slice()
        let long_inter = long.splice(k, 1)[0]
        let zv = z.slice()
        zv.slice(k, 1)
        let nc = lat.length
        //console.log("X:",lat)
        //console.log("Y:",long)
        //console.log("puntos_inter:",[lat_inter,long_inter])
        let mvt = Array(nc + 1).fill(1).map(() => Array(nc + 1).fill(1));
        for (let i = 0; i < nc; i++) {
            zv[i] = [zv[i]]
            //console.log("[x,y]:",[lat[i],long[i]])
            for (let j = 0; j < nc; j++) {
                //console.log(Math.sqrt(Math.pow(lat[j] - long[i], 2) + Math.pow(lat[j] - long[i], 2)) * 100000,variograma.rango,variograma.modelo)
                //console.log("===:",modelExp(Math.sqrt(Math.pow(lat[j] - long[i], 2) + Math.pow(lat[j] - long[i], 2)) * 100000,variograma.rango,variograma.modelo))
                mvt[i][j] = variograma.nugget + variograma.sill_parcial * modelExp((Math.pow(Math.pow(lat[j] - lat[i], 2) + Math.pow(long[j] - long[i], 2), 0.5)) * 100000, variograma.rango, variograma.modelo)
                //console.log(mvt[i][j])
            }
        }
        mvt[nc][nc] = 0;
        //console.log("MVT"+k+":",mvt)
        let matriz_variograma_teorico = invM(mvt)
        //console.log("matriz_variograma_teorico::",matriz_variograma_teorico) 
        //for(let i=0;i<1;i++){
        //console.log("zv:",zv)
        v_estimados[k] = estimar(lat_inter, long_inter, variograma, lat, long, zv, matriz_variograma_teorico, variograma.modelo)[0];
        //console.log("v_estimados",v_estimados[k])
        //console.log("_________________________________________________________")
        //}
    }
    let error = []
    for (var i = 0; i < v_estimados.length; i++) {
        error[i] = v_estimados[i] - z[i]
    }
    postMessage({ ve: v_estimados, zv: z, error: error })
})