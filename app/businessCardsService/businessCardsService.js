var Curl = require('node-libcurl').Curl;
var parseXML = require('xml-parser');
var config = require('../config/config'); // get our config file

class BusinessCardsService {

    serviceRun(imageName) {
        let imagesDir = `${__dirname}/../public/uploads`;
        var curl = new Curl();

        curl.setOpt(Curl.option.URL, 'http://cloud.ocrsdk.com/processBusinessCard?language=Russian&exportformat=xml');//vCard
        curl.setOpt(Curl.option.USERNAME, config.abbyAppName);
        curl.setOpt(Curl.option.PASSWORD, config.abbyPwd);
        curl.setOpt(Curl.option.HTTPPOST, [
//            {name: 'business-card', file: `${imagesDir + imageName}`, type: 'image/jpeg'},
            {name: 'my_file', file: `${imagesDir}/1486372547940.jpeg`, type: 'image/jpeg'}
        ]);

        var getImageProcessingStatus = this.getImageProcessingStatus();

        curl.on('end', function (statusCode, responceBody, headers) {
            console.log(statusCode);
            console.log(responceBody);
//            console.info(headers);
            console.log(this.getInfo('TOTAL_TIME'));

            if (responceBody) {
                getImageProcessingStatus(responceBody);
            }

            this.close();
        });

        curl.on('error', function (err) {
            console.log(err);
            this.close();
        });

        curl.perform();
    }

    getImageProcessingStatus() {

        // Body responce example
        /*
         <?xml version="1.0" encoding="utf-8"?>
         <response>
         <task id="b12b87c1-bc6d-4264-9710-98ecec404d44" registrationTime="2017-02-06T17:05:23Z" statusChangeTime="2017-02-06T17:05:23Z" status="Queued" filesCount="1" credits="10" estimatedProcessingTime="5" />
         </response>                  
         */

        var getProcessedImageLink = this.getProcessedImageLink();

        return function (responceBody) {
            let parsedResponseBody = parseXML(responceBody);
            let orderId = parsedResponseBody.root.children[0].attributes.id;
            let getResultLinkDelay = parsedResponseBody.root.children[0].attributes.estimatedProcessingTime * 1100;

            setTimeout(function (orderId, estimatedProcessingTime) {
                console.log(orderId);
                console.log(estimatedProcessingTime);

                getProcessedImageLink(orderId);
            }, getResultLinkDelay, orderId, getResultLinkDelay);
        };
    }

    getProcessedImageLink() {

        // Body responce example
        /*
         <?xml version="1.0" encoding="utf-8"?>
         <response>
         <task id="b12b87c1-bc6d-4264-9710-98ecec404d44" registrationTime="2017-02-06T17:05:23Z" statusChangeTime="2017-02-06T17:05:25Z" status="Completed" filesCount="1" credits="10" resultUrl="https://ocrsdk.blob.core.windows.net/files/b12b87c1-bc6d-4264-9710-98ecec404d44.result?sv=2012-02-12&se=2017-02-07T03%3A00%3A00Z&sr=b&si=downloadResults&sig=ycfc57PiaUsNB0KG4E%2BVXJcrOjqb5kyne%2BaX02Xzm0k%3D"/>
         </response>
         */

        var deriveImageLink = this.deriveImageLink();

        return function (orderId) {
            var curl = new Curl();

            curl.setOpt(Curl.option.URL, `http://cloud.ocrsdk.com/getTaskStatus?taskId=${orderId}`);
            curl.setOpt(Curl.option.USERNAME, config.abbyAppName);
            curl.setOpt(Curl.option.PASSWORD, config.abbyPwd);

            curl.on('end', function (statusCode, responceBody, headers) {

                console.log(statusCode);
                console.log(responceBody);
//            console.info(headers);
                console.log(this.getInfo('TOTAL_TIME'));

                // TODO: implement flow dependancy response 'status'
                if (responceBody) {
                    let imageLink = deriveImageLink(responceBody);
                    console.log(imageLink);
                }

                this.close();
            });

            curl.on('error', function (err) {
                console.log(err);
                this.close();
            });

            curl.perform();
        };
    }

    deriveImageLink() {

        return function (responceBody) {
            let parsedResponseBody = parseXML(responceBody);
            let prosessImageStatus = parsedResponseBody.root.children[0].attributes.status;

            console.log(prosessImageStatus);

            if (prosessImageStatus === 'Completed') {
                return parsedResponseBody.root.children[0].attributes.resultUrl;
            }
            // TODO: implement flow dependancy response 'status'
            return false;
        };
    }

    getProcessedData() {

    }

    saveProcessedData() {

    }
}

exports.businessCardsService = BusinessCardsService;