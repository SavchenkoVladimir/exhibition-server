var Curl = require('node-libcurl').Curl;
var parseXML = require('xml-parser');
var config = require('../config/config');
var BuisnessCardDataModel = require('../models/BuisnessCardData');

class BusinessCardsService {

    serviceRun(imageName) {
        let imagesDir = `${__dirname}/../public/uploads`;
        var curl = new Curl();

        curl.setOpt(Curl.option.URL, 'http://cloud.ocrsdk.com/processBusinessCard?language=Russian&exportformat=xml');
        curl.setOpt(Curl.option.USERNAME, config.abbyyAppName);
        curl.setOpt(Curl.option.PASSWORD, config.abbyyPwd);
        curl.setOpt(Curl.option.HTTPPOST, [
//            {name: 'business-card', file: `${imagesDir + imageName}`, type: 'image/jpeg'},
            {name: 'my_file', file: `${imagesDir}/1486372547940.jpeg`, type: 'image/jpeg'}
        ]);

        var getImageProcessingStatus = this.getImageProcessingStatus();

        curl.on('end', function (statusCode, responceBody, headers) {
            if (responceBody) {
                getImageProcessingStatus(responceBody);
            }

            this.close();
        });

        curl.on('error', function (err) {
            this.close();
        });

        curl.perform();
    }

    getImageProcessingStatus() {
        var getProcessedImageLink = this.getProcessedImageLink();

        return function (responceBody) {
            let parsedResponseBody = parseXML(responceBody);
            let orderId = parsedResponseBody.root.children[0].attributes.id;
            let getResultLinkDelay = parsedResponseBody.root.children[0].attributes.estimatedProcessingTime * 1100;

            setTimeout(function (orderId) {
                getProcessedImageLink(orderId);
            }, getResultLinkDelay, orderId);
        };
    }

    getProcessedImageLink() {
        var deriveImageLink = this.deriveImageLink();
        var getProcessedData = this.getProcessedData();

        return function (orderId) {
            var curl = new Curl();

            curl.setOpt(Curl.option.URL, `http://cloud.ocrsdk.com/getTaskStatus?taskId=${orderId}`);
            curl.setOpt(Curl.option.USERNAME, config.abbyyAppName);
            curl.setOpt(Curl.option.PASSWORD, config.abbyyPwd);

            curl.on('end', function (statusCode, responceBody, headers) {

                // TODO: implement flow dependancy response 'status'
                if (responceBody) {
                    let imageLink = deriveImageLink(responceBody);

                    getProcessedData(imageLink);
                }

                this.close();
            });

            curl.on('error', function (err) {
                this.close();
            });

            curl.perform();
        };
    }

    deriveImageLink() {

        return function (responceBody) {
            let parsedResponseBody = parseXML(responceBody);
            let prosessImageStatus = parsedResponseBody.root.children[0].attributes.status;

            if (prosessImageStatus === 'Completed') {
                let url = parsedResponseBody.root.children[0].attributes.resultUrl;
                return url.replace(/&amp;/g, '&');
            }
            // TODO: implement flow dependancy response 'status'
            return false;
        };
    }

    getProcessedData() {
        var cleanProcessedData = this.cleanProcessedData();
        var saveProcessedData = this.saveProcessedData();

        return function (resultFileURL) {
            var curl = new Curl();

            curl.setOpt(Curl.option.URL, resultFileURL);

            curl.on('end', function (statusCode, responceBody, headers) {
                if (responceBody) {
                    const parsedResponce = parseXML(responceBody);
                    const processedImageData = parsedResponce.root.children[0].children;
                    const cleanedProcessedData = cleanProcessedData(processedImageData);

                    saveProcessedData(cleanedProcessedData);
                }

                this.close();
            });

            curl.on('error', function (err) {
                this.close();
            });

            curl.perform();
        };
    }

    cleanProcessedData() {

        return function (rawProcessedData) {
            let cleanedProcessedData = [];

            for (let row = 0; row < rawProcessedData.length; row++) {
                let field = {};

                if (typeof rawProcessedData[row].attributes !== undefined) {
                    field.fieldType = rawProcessedData[row].attributes.type;
                }

                if (typeof rawProcessedData[row].children !== undefined) {
                    field.fieldValue = rawProcessedData[row].children[0].content;
                }

                cleanedProcessedData.push(field);
            }

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

exports.businessCardsService = BusinessCardsService;