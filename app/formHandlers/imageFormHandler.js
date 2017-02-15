var formidable = require('formidable');
var fs = require('fs');
var path = require("path");

var cardsService = require('../businessCardsService/ReceiptScanner');
//var cardsService = require('../businessCardsService/OpenCV');

class ImageFormHandler {

    handlingRun(req, res) {
        var form = new formidable.IncomingForm();
        form.multiples = false;
        form.uploadDir = path.join(__dirname, '../public/uploads');

        form.parse(req, function (err, fields, files) { });

        form.on('file', function (field, file) {

            fs.rename(file.path, path.join(form.uploadDir, file.name));

            let businessCardsService = new cardsService.businessCardsService;
            businessCardsService.serviceRun(file.name);
        });

        form.on('error', function (err) {
            console.log('An error has occured: \n' + err);
        });

        form.on('end', function (err, fields, files) {
            // TODO: implement proper error handling 
            err ? res.end('Image saving error.') : res.end('success');
        });
    }

}

exports.imageFormHandler = ImageFormHandler;