"use strict";

// CARGAR MONGOOSE Y SCHEMA
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  image: String,
});

// EXPORTAR EL MODELO DE ARTICULO
module.exports = mongoose.model("Article", ArticleSchema);
