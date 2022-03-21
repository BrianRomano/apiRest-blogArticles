"use strict";

// MODELO DE ARTICULO
var Article = require("./../models/article");

// IMPORTAR LIBRERIA VALIDATOR PARA VALIDACIONES
var validator = require("validator");

// LIBRERIAS/DEPENDECIAS PARA ELIMINAR UN ARCHIVO SUBIDO
var fs = require("fs");
var path = require("path");

var controller = {
  // OBTENER TODOS LOS ARTICULOS
  getArticles: (req, res) => {
    // OBTENER TODOS LOS ARTICULOS DE LA BD CON EL METODO "FIND" ORDENADOS DE NUEVO A VIEJO
    Article.find({})
      .sort("-_id")
      .exec((err, articles) => {
        // COMPROBAR SI EXISTE UN ERROR Y MOSTRAR EL ERROR
        if (err) {
          return res.status(500).send({
            status: "Error",
            message: "Se ha producido un error",
          });
        }

        // SI NO EXISTEN ARTICULOS EN LA BD, MOSTRAR ERROR
        if (!articles) {
          return res.status(404).send({
            status: "Error",
            message: "No hay articulos guardados",
          });
        }

        // SI NO EXISTEN ERRORES, DEVOLVER RESPUESTA CON ARTICULOS
        return res.status(200).send({
          status: "Success",
          articles,
        });
      });
  },

  // OBTENER SOLO UN ARTICULO
  getArticle: (req, res) => {
    // RECOGER ID QUE LLEGA POR LA URL
    var articleId = req.params.id;

    // COMPROBAR QUE EL ID SEA VALIDO
    if (!articleId || articleId == null) {
      // RETORNAR UN MENSAJE DE ERROR
      return res.status(404).send({
        status: "Error",
        message: "No existe el articulo",
      });
    }

    // BUSCAR EL ARTICULO EN LA BD
    Article.findById(articleId, (err, article) => {
      // SI EXISTE UN ERROR, DEVOLVER RESPUESTA
      if (err) {
        return res.status(500).send({
          status: "Error",
          message: "Error en el servidor",
        });
      }

      // SI EXISTE UN ERROR CON EL ARTICULO, DEVOLVER RESPUESTA
      if (!article) {
        return res.status(404).send({
          status: "Error",
          message: "No existe el articulo",
        });
      }

      // EN CASO DE NO EXISTIR ERROR, DEVOLVER ARTICULO
      return res.status(200).send({
        status: "Success",
        article,
      });
    });
  },

  // GUARDAR UN ARTICULO
  save: (req, res) => {
    // RECOGER LOS DATOS DEl "BODY"
    var params = req.body;

    // VALIDAR DATOS CON EL "VALIDATOR"
    try {
      // COMPROBAR QUE "TITLE" NO ESTE VACIO
      var validate_title = !validator.isEmpty(params.title);
      // COMPROBAR QUE "CONTENT" NO ESTE VACIO
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      // RETORNAR ERROR DE VALIDACIÓN
      return res.status(200).send({
        status: "Error",
        message: "Faltan datos",
      });
    }

    // VALIDAR DATOS
    if (validate_title & validate_content) {
      // CREAR EL OBJETO A GUARDAR
      var article = new Article();

      // ASIGNAR VALORES ENVIADOS POR POST AL OBJETO
      article.title = params.title;
      article.content = params.content;
      article.image = null;

      // GUARDAR ARTICULO EN BD MONGODB USANDO EL METODO "SAVE"
      article.save((err, articleStored) => {
        // COMPROBAR SI EXISTE UN ERROR AL GUARDAR
        if (err || !articleStored) {
          return res.status(404).send({
            status: "Error",
            message: "No se ha podido guardar el articulo",
          });
        }

        // SI NO EXISTE ERROR AL GUARDAR, MOSTRAR MENSAJE DE RESPUESTA
        return res.status(200).send({
          status: "Success",
          article,
        });
      });
    } else {
      // RETORNAR ERROR DE VALIDACIÓN
      return res.status(200).send({
        status: "Error",
        message: "Datos incorrectos",
      });
    }
  },

  // ACTUALIZAR UN ARTICULO
  modify: (req, res) => {
    // OBTENER EL ID EN LA URL DEL ARTICULO A ACTULIZAR
    var articleId = req.params.id;

    // OBTENER LOS PARAMETROS A ACTUALIZAR DEL ARTICULO
    var params = req.body;

    // VALIDAR DATOS CON "VALIDATOR"
    try {
      // DE NO EXISTIR ERROR, GUARDAR DATOS VALIDADOS
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Faltan datos por enviar",
      });
    }

    // SI LA PRIMER VALIDACIÓN ES CORRECTA, BUSCAR Y ACTUALIZAR, SI NO DEVOLVER UN ERROR
    if (validate_title && validate_content) {
      // BUSCAR Y ACTUALIZAR UTILIZANDO EL METODO "findByIdAndUpdate"
      Article.findByIdAndUpdate(
        { _id: articleId },
        params,
        { new: true },
        (err, articleUpdated) => {
          // SI EXISTE UN ERROR, DEVOLVER RESPUESTA
          if (err) {
            return res.status(500).send({
              status: "Error",
              message: "Error al actualizar",
            });
          }

          // SI EL ARTICULO NO SE PUDO ACTUALIZAR O NO EXISTE, DEVOLVER UN ERROR
          if (!articleUpdated) {
            return res.status(404).send({
              status: "Error",
              message: "El articulo no existe",
            });
          }

          // SI NO EXISTEN ERRORES, DEVOLVER RESPUESTA CON EL ARTICULO ACTUALIZADO
          return res.status(200).send({
            status: "Success",
            article: articleUpdated,
          });
        }
      );
    } else {
      // DEVOLVER ERROR
      return res.status(200).send({
        status: "Error",
        message: "Los datos no son correctos",
      });
    }
  },

  // ELIMINAR UN ARTICULO
  delete: (req, res) => {
    // RECOGER EL ID DE LA URL DEL ARTICULO A ELIMINAR
    var articleId = req.params.id;

    // BUSCAR Y ELIMINAR EL ARTICULO CON EL METODO "findOneAndDelete"
    Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      // SI EXISTE UN ERROR, DEVOLVER UNA RESPUESTA
      if (err) {
        return res.status(500).send({
          status: "Error",
          message: "Error al eliminar el articulo",
        });
      }

      // SI EL ARTICULO A ELIMINAR NO EXISTE, MOSTRAR ERROR
      if (!articleRemoved) {
        return res.status(404).send({
          status: "Error",
          message: "El articulo que quiere eliminar, no existe",
        });
      }

      // SI NO EXISTE UN ERROR, DEVOLVER RESPUESTA Y EL ARTICULO ELIMINADO
      return res.status(200).send({
        status: "Success",
        article: articleRemoved,
      });
    });
  },

  // SUBIR ARCHIVOS
  upload: (req, res) => {
    // COMPROBAR QUE LA IMAGEN LLEGA, SINO DEVOLVER UN ERROR
    if (!req.files) {
      return res.status(404).send({
        status: "Error",
        message: "Imagen no subida",
      });
    }

    // OBTENER NOMBRE, EXTENSION Y PATH DEL ARCHIVO
    var file_path = req.files.file0.path;
    /* 
      SEPARAR VARIABLE "file_path" POR "/" EN LINUX Y MAC 
      EN WINDOWS SE DIVIDIRA POR "\\"
      PARA OBTENER NOMBRE Y EXTENSION DEL ARCHIVO
    */
    var file_split = file_path.split("/");

    // NOMBRE DEL ARCHIVO
    var file_name = file_split[2];

    // EXTENSION DEL ARCHIVO
    var extension_split = file_name.split(".");
    var file_extension = extension_split[1];

    // VALIDAR QUE EL ARCHIVO SEA UNA EXTENSION DE IMAGEN, SI NO DEVOLVER UN ERROR Y BORRAR EL ARCHIVO
    if (
      file_extension != "png" &&
      file_extension != "jpeg" &&
      file_extension != "jpg" &&
      file_extension != "gif"
    ) {
      // BORRAR EL ARCHIVO SUBIDO
      fs.unlink(file_path, (err) => {
        return res.status(500).send({
          status: "Error",
          message: "La extensión de la imagen no es valida",
        });
      });
    } else {
      // SI TODO ES VALIDO, CAPTURAR ID DE LA URL
      var articleId = req.params.id;

      // BUSCAR EL ARTICULO, ASIGNARLE EL NOMBRE DE LA IMAGEN Y ACTUALIZARLO CON EL METODO "findOneAndUpdate"
      Article.findOneAndUpdate(
        { _id: articleId },
        { image: file_name },
        { new: true },
        (err, articleUpdated) => {
          // EN CASO DE ERROR AL GUARDAR, DEVOLVER RESPUESTA
          if (err || !articleUpdated) {
            return res.status(500).send({
              status: "Error",
              message: "No se ha podido guardar el archivo",
            });
          }

          // DE NO EXISTIR ERROR, DEVOLVER RESPUESTA Y EL ARCHIVO GUARDADO
          return res.status(200).send({
            status: "Success",
            articleUpdated,
          });
        }
      );
    }
  },

  // OBTENER UNA IMAGEN
  getImage: (req, res) => {
    // OBTENER EL ARCHIVO ENVIADO POR LA URL
    var file = req.params.image;

    // OBTENER EL PATH DE LA IMAGEN ENVIADA POR LA URL
    var path_file = "./upload/articles/" + file;

    // COMPROBAR SI EL ARCHIVO EXISTE EN LA BD CON EL METODO "EXISTS"
    fs.exists(path_file, (exists) => {
      // COMPROBAR SI LA IMAGEN EXISTE
      if (exists) {
        // NO DEVUELVE UN JSON - DEVUELVE LA IMAGEN
        return res.sendFile(path.resolve(path_file));
      } else {
        // DEVOLVER UN ERROR SI LA IMAGEN NO EXISTE EN LA BD
        return res.status(404).send({
          status: "Error",
          message: "La imagen no existe",
        });
      }
    });
  },

  // BUSCADOR DE ARTICULOS
  search: (req, res) => {
    // CAPTURAR EL STRING A BUSCAR, ENVIADO POR LA URL
    var searchString = req.params.search;

    // BUSCAR EL ARTICULO EN LA BASE DE DATOS CON EL METODO "FIND" CON CONDICION "OR"
    Article.find({
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { content: { $regex: searchString, $options: "i" } },
      ],
    }).exec((err, articles) => {
      // EN CASO DE EXISTIR UN ERROR, DEVOLVER RESPUESTA
      if (err) {
        return res.status(500).send({
          status: "Error",
          message: "Error en la petición",
        });
      }

      // EN CASO DE NO EXISTIR ARTICULOS QUE COINCIDAN CON LA BUSQUEDA, DEVOLVER RESPUESTA
      if (!articles || articles.length <= 0) {
        return res.status(404).send({
          status: "Error",
          message: "No existen archivos que coincidan con la busqueda",
        });
      }

      // EN CASO DE NO EXISTIR ERROR, DEVOLVER LOS ARTICULOS
      return res.status(200).send({
        status: "Success",
        articles,
      });
    });
  },
};

// EXPORTAR CONTROLLER DE ARTICULO
module.exports = controller;
