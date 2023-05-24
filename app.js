const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//Parsear el body usando body parser
app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: false })); //body formulario
const port = process.env.PORT || 3000;
/*"mongodb+srv://ebarriosebd:awYo0bsX5UoTguf7@leaflet.kcui8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority */
//const bd='mongodb://localhost/baseOvi'
const bd = "mongodb+srv://ebarriosebd:awYo0bsX5UoTguf7@leaflet.kcui8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose
    .connect(bd, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(x => {
        console.log(`Conectado a Mongo, Nombre de la bd: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error al conectar a Mongodb', err)
    });
//
var eng = 'ejs' //'pug'
//var eng = 'pug'
app.set('view engine', eng);
app.set("views", __dirname + "/views"); 
app.use(express.static(__dirname + "/public"));
//Routes setup
//const index = require('./routes/index');
//app.use('/', index); 
//datos
const dat = require('./routes/datos');
app.use('/', dat);
//pages
const pages = require('./routes/pages');
app.use('/', pages);
//exclusva para leer las geometrias de geoAcapulco
const loadjsonAcapulco = require('./routes/loadjson');
app.use('/', loadjsonAcapulco);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
app.use((req, res, next) => {
    // res.status(404).send("Sorry cant find that!");
    res.status(404).render("404");
}); // error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    // render the error page
    res.status(err.status || 500);
    res.render('error', { error: err, message: err.message });
});
module.exports = app;