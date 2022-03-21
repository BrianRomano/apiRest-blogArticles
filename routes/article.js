"use strict";

// CARGAR EXPRESS
var express = require("express");

// CARGAR CONTROLADOR DE ARTICULO
var ArticleController = require("./../controllers/article");

// DEPENDECIA "CONNECT MULTIPARTY" PARA SUBIDA DE ARCHIVOS
var multipart = require("connect-multiparty");
// GUARDAR ARCHIVOS EN EL DIRECTORIO "UPLOAD/ARTICLES"
var md_upload = multipart({ uploadDir: "./upload/articles" });

// RUTAS Y METODOS
var router = express.Router();

// RUTAS - ARTICULOS
router.post("/save", ArticleController.save);
router.get("/articles", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.put("/article/:id", ArticleController.modify);
router.delete("/article/:id", ArticleController.delete);
router.post("/upload-image/:id", md_upload, ArticleController.upload); // MIDDLEWARE [md_upload]
router.get("/get-image/:image", ArticleController.getImage);
router.get("/search/:search", ArticleController.search);

// EXPORTAR MODULO DE RUTAS DE ARTICULO
module.exports = router;
