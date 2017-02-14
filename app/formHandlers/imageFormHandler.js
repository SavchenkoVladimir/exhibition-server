var formidable = require('formidable');
var fs = require('fs');
var path = require("path");

//var cardsService = require('../businessCardsService/ABBYBusinessCardsService');
//var cardsService = require('../businessCardsService/FullContactService');
//var cardsService = require('../businessCardsService/GoogleCloudService');
var cardsService = require('../businessCardsService/MSService');

class ImageFormHandler{

    handlingRun(req, res){            
        var form = new formidable.IncomingForm();
        form.multiples = false;
        form.uploadDir = path.join(__dirname, '../public/uploads');

        form.parse(req, function (err, fields, files) { });
      
        form.on('file', function (field, file) {

            fs.rename(file.path, path.join(form.uploadDir, file.name));
 
            let businessCardsService = new cardsService.businessCardsService;
            businessCardsService.serviceRun(file.name, res);            
        });

        form.on('error', function (err) {
            console.log('An error has occured: \n' + err);
        });

//        form.on('end', function (err, fields, files) {
//console.log(fields);
//            // TODO: implement proper error handling 
//            err ? res.end('Image saving error.') : res.end('success');
////            err ? res.end('Image saving error.') : res.end('success');
//        });
    }
    
}

exports.imageFormHandler = ImageFormHandler;