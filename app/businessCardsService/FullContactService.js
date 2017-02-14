var Curl = require('node-libcurl').Curl;
var config = require('../config/config');
var BuisnessCardDataModel = require('../models/BuisnessCardData');

class FullContactService {

    serviceRun(imageName) {
        let imagesDir = `${__dirname}/../public/uploads`;
        var curl = new Curl();

        curl.setOpt(Curl.option.URL, 'https://api.fullcontact.com/v2/cardReader?webhookUrl=http://efd1ceef.ngrok.io/fullContactPort&format=json');
        curl.setOpt('HTTPHEADER', [`X-FullContact-APIKey:${config.FullContactAPIKey}`]);
        curl.setOpt(Curl.option.HTTPPOST, [
            {name: 'front', file: `${imagesDir}/${imageName}`, type: 'image/jpeg'}
//            {name: 'front', file: `${imagesDir}/business-card-7.jpg`, type: 'image/jpg'}
        ]);

        // TODO: implement handling if responce status is not 200
        curl.on('end', function (statusCode, responceBody, headers) {
            console.log(statusCode);
            console.log(responceBody);

            this.close();
        });

        curl.on('error', function (err) {
            this.close();
        });

        curl.perform();
    }
    
    // TODO: implement the poleId
    saveProcessedData() {

        return function (processedData) {
            var buisnessCardDataModel = new BuisnessCardDataModel({
                cardData: processedData,
                poleId: 'Feature does not yet implemented.'
            });

            buisnessCardDataModel.save(function (err) {
                if (err)
                    throw err;

                console.log('Cart processed data saved successfully.');
            });
        };
    }    
}

exports.businessCardsService = FullContactService;