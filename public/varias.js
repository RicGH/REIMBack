var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');
var configuracion = require('../config/config');

AWS.config.update(configuracion.CONFIG_BUCKET);

var s3 = new AWS.S3();

exports.MoverArchivoFromTemp = function MoverArchivoFromTemp(rutaTmp, nametmp, rutaDestino, nameActual) {
  if (nametmp != null && nametmp != undefined && nametmp != '' && fs.existsSync(rutaTmp + nametmp)) {
    if (nameActual != null && nameActual != undefined && nameActual != '' && fs.existsSync(rutaDestino + nameActual)) {
      fs.unlink(rutaDestino + nameActual, (err) => {
        if (err) {
          // console.log(err);
        } else {
          // console.log('Documento anterior borrado con éxito');
        }
      });
    }
    if (!fs.existsSync(rutaDestino)) { // CHECAMOS SI EXISTE LA CARPETA CORRESPONDIENTE.. SI NO, LO CREAMOS.
      fs.mkdirSync(rutaDestino);
    }
    fs.rename(rutaTmp + nametmp, rutaDestino + nametmp, (err) => {
      if (err) { console.log(err); throw err; }
    });
    return (true);
  }
  return false;
};

exports.BorrarArchivo = function BorrarArchivo(ruta, nameFile) {
  if (nameFile != null && nameFile != undefined && nameFile != '' && fs.existsSync(ruta + nameFile)) {
    fs.unlink(ruta + nameFile, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Documento borrado con éxito');
      }
    });
  }
};



exports.getListaRutaFotosLRBucket = function getListaRutaFotosLRBucket(idManiobra, lavado_reparacion) {
  var pathFotos = "";
  if (lavado_reparacion === 'L') {
    pathFotos = path.resolve(__dirname, `../uploads/maniobras/${idManiobra}/fotos_lavado/`);
    return pathFotos;
  } else {
    if (lavado_reparacion === 'R') {
      pathFotos = path.resolve(__dirname, `../uploads/maniobras/${idManiobra}/fotos_reparacion/`);
      return pathFotos;
    }
    return pathFotos;
  }
};

exports.SubirArchivoBucket = function SubirArchivoBucket(archivo, rutaDestino, nombreArchivo) {
  var params = {
    Bucket: 'bucketcontainerpark',
    Body: archivo.data,
    Key: rutaDestino + nombreArchivo,
    ContentType: archivo.mimetype
  };

  s3.upload(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    }
    if (data) {
      console.log("Uploaded in:", data.Location);
    }
  });
  return (true);
};

exports.MoverArchivoBucket = function MoverArchivoBucket(rutaTmp, nameTmp, rutaDestino) {
  var params = {
    Bucket: "bucketcontainerpark",
    CopySource: 'bucketcontainerpark/' + rutaTmp + nameTmp,
    Key: rutaDestino + nameTmp
  };
  s3.copyObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log('Archivo movido ' + rutaDestino + nameTmp);
      //Si se mueve, borro el original
      var paramsDelete = {
        Bucket: 'bucketcontainerpark',
        Key: rutaTmp + nameTmp
      };
      s3.deleteObject(paramsDelete, function(err, data) {
        if (err) {
          console.log("Error", err);
        }
        if (data) {
          console.log("Elemento eliminado:", rutaTmp + nameTmp);
        }
      });
    }
  });
  return (true);
};

exports.BorrarArchivoBucket = function BorrarArchivoBucket(ruta, name) {
  var paramsDelete = {
    Bucket: 'bucketcontainerpark',
    Key: ruta + name
  };
  s3.deleteObject(paramsDelete, function(err, data) {
    if (err) {
      console.log("Error", err);
    }
    if (data) {
      console.log("Elemento eliminado:", ruta + name);
    }
  });
};


// exports.ParamsToJSON = function ParamsToJSON(req) {
//   var json;
//   var filtro = '{';
//   if (req.params) {
//     for (var param in req.params) {
//       if (req.params.hasOwnProperty(param)) {
//         //console.log(param, req.params[param]);
//         if (req.params[param] != '' && req.params[param] != null && req.params[param] != 'undefined') {
//           filtro += '\"' + param + '\"' + ':' + '\"' + req.params[param] + '\"' + ',';
//         } else {
//           // console.log('No se agrego el param ' + param + ' al JSON');
//         }
//       } else {
//         // console.log('No se pudo el hasOwnProperty');
//         // return;
//       }
//     }

//     if (filtro != '{') {
//       filtro = filtro.slice(0, -1);
//       filtro = filtro + '}';
//     } else {
//       filtro = filtro + '}';
//       //return;
//     }
//     //console.log(filtro)
//     var json = JSON.parse(filtro);
//     //console.log(json)
//     //console.log(req.params);
//   } else {
//     // console.log('La URL no tiene parametros');
//     return;
//   }

//   return json;
// }