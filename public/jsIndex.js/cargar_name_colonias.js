//Comienza carga para los nombres de las zonas 
console.log("cargar_name_colonias.js") 
function ggetNomCol() {
    return fetch("/map", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify({}), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => addNameHTML(response));
}
 