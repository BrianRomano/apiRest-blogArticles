"use strict";

// GUARDAR/CARGAR DEPENDECIAS Y MODULOS
var app = require("./app");
var mongoose = require("mongoose");

// PUERTO EN EL QUE SE EJECUTARA EL SERVIDOR
var port = 3900;

// DESACTIVAR METODOS ANTIGUOS
mongoose.set("useFindAndModify", false);

// CONFIGURACIÓN INTERNA DE MONGODB
mongoose.Promise = global.Promise;

// CONECCION A BASE DE DATOS MONGODB
mongoose
  .connect("mongodb://localhost:27017/api_rest_mern", { useNewUrlParser: true })
  .then(() => {
    console.log("Conexión exitosa");
    // CREAR SERVIDOR
    app.listen(port, () => {
      console.log("Servidor corriendo en http://localhost:" + port);
    });
  });
