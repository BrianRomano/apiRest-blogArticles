"use strict";

// CARGAR MODULOS/DEPENDENCIAS PARA CREAR EL SERVIDOR
var express = require("express");
var bodyParser = require("body-parser");

// CARGAR APLICACIÓN - EJECUTAR EXPRESS
var app = express();

// CARGAR FICHEROS/RUTAS
var article_route = require("./routes/article");

// MIDDLEWARE - CARGAR BODY-PARSER
app.use(bodyParser.urlencoded({ extended: false }));

// MIDDLEWARE - CONVERTIR PETICIONES EN JSON
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// AÑADIR PREFIJOS A RUTAS / CARGAR RUTAS
app.use("/api", article_route);

// EXPORTAR MODULO (FICHERO ACTUAL: app.js)
module.exports = app;
