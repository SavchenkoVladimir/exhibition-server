var Curl = require('node-libcurl').Curl;
var config = require('../config/config');
var BuisnessCardDataModel = require('../models/BuisnessCardData');

class MSService {

    serviceRun(imageName) {
        var curl = new Curl();
        const imagesDir = `${__dirname}/../public/uploads`;

        var cleanProcessedData = this.cleanProcessedData();
        var saveProcessedData = this.saveProcessedData();

        curl.setOpt(Curl.option.URL, 'https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr?language=de');
        curl.setOpt('HTTPHEADER', [`Ocp-Apim-Subscription-Key:${config.MSAPIKey}`]);
        curl.setOpt(Curl.option.HTTPPOST, [
            {name: 'image', file: `${imagesDir}/${imageName}`}
        ]);

        curl.on('end', function (statusCode, responceBody, headers) {
            console.log(statusCode);

            if (responceBody) {
                const cleanedProcessedData = cleanProcessedData(responceBody);
//                saveProcessedData(cleanedProcessedData);                
            }

            this.close();
        });

        curl.on('error', function (err) {
            this.close();
        });

        curl.perform();
    }

    cleanProcessedData() {

        return function (rawProcessedData) {
            let cleanedProcessedData = '';
            const responseData = JSON.parse(rawProcessedData);

            for (let i = 0; i < responseData.regions.length; i++) {
                let boundingBox = responseData.regions[i].lines;

                for (let n = 0; n < boundingBox.length; n++) {
                    let words = boundingBox[n].words;

                    for (let k = 0; k < words.length; k++) {
                        const word = words[k];
                        cleanedProcessedData += ` ${word.text}`;
                    }
                }
            }

            console.log(cleanedProcessedData);
            return cleanedProcessedData;
        };
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

                console.log('Cart data saved successfully.');
            });
        };
    }

}

exports.businessCardsService = MSService;