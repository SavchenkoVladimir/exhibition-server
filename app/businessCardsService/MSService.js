var Curl = require('node-libcurl').Curl;
var config = require('../config/config');
var BuisnessCardDataModel = require('../models/BuisnessCardData');
var AYLIENTextAPI = require('aylien_textapi');

class MSService {

    serviceRun(imageName) {
        const extractBusinessCartData = this.extractBusinessCartData();
        extractBusinessCartData(imageName);
    }

    extractBusinessCartData() {
        var curl = new Curl();
        const imgDir = `${__dirname}/../public/uploads`;

        let extractResponseText = this.extractResponseText();
        let normalizeCartText = this.normalizeCartText();

        return function (imageName) {
            curl.setOpt(Curl.option.URL, 'https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr?language=de');
            curl.setOpt('HTTPHEADER', [`Ocp-Apim-Subscription-Key:${config.MSAPIKey}`]);
            curl.setOpt(Curl.option.HTTPPOST, [
                {name: 'image', file: `${imgDir}/${imageName}`}
            ]);

            curl.on('end', function (statusCode, responseText, headers) {
                if (responseText) {
                    const businessCartText = extractResponseText(responseText);
                    normalizeCartText(businessCartText);
                }

                this.close();
            });

            curl.on('error', function (err) {
                this.close();
            });

            curl.perform();
        };
    }

    extractResponseText() {

        return function (rawBusinessCartText) {
            let extractedBusinessCartText = '';
            const businessCartText = JSON.parse(rawBusinessCartText);

            for (let i = 0; i < businessCartText.regions.length; i++) {
                let boundingBox = businessCartText.regions[i].lines;

                for (let n = 0; n < boundingBox.length; n++) {
                    let words = boundingBox[n].words;

                    for (let k = 0; k < words.length; k++) {
                        const word = words[k];
                        extractedBusinessCartText += ` ${word.text}`;
                    }
                }
            }
            
            //Remove on prod
            console.log(extractedBusinessCartText);
            return extractedBusinessCartText;
        };
    }

    // Extracts from text its entities as Name, URL, Phone and so on
    normalizeCartText() {
        let saveBusinessCartData = this.saveBusinessCartData();

        return function (cartText) {

            var textApi = new AYLIENTextAPI({
                application_id: config.aylienAppId,
                application_key: config.aylienAPIKey
            });
            textApi.entities({'text': cartText}, function (error, response) {
                if (error === null) {
                    saveBusinessCartData(response);
                }
            });
        };
    }

    // TODO: implement the poleId
    saveBusinessCartData() {

        return function (businessCartData) {
            var buisnessCardDataModel = new BuisnessCardDataModel({
                cardData: businessCartData,
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