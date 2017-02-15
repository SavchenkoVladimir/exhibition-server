var scanner = require('receipt-scanner');

class ReceiptScanner {

    serviceRun(imageName) {
        const extractBusinessCartData = this.extractBusinessCartData();
        extractBusinessCartData(imageName);
    }

    extractBusinessCartData() {
        const imgDir = `${__dirname}/../public/uploads`;

        return function (imageName) {
            scanner(`${imgDir}/${imageName}`)
                    .parse(function (err, results) {
                        if (err)
                            return console.error(err);
                        else
                            console.log(results);
                    });
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
            return extractedBusinessCartText;
        };
    }

    // Extracts from text its entities as Name, URL, Phone and so on
    normalizeCartText() {
        let saveBusinessCartData = this.saveBusinessCartData();

        return function (cartText, res) {
            var textApi = new AYLIENTextAPI({
                application_id: config.aylienAppId,
                application_key: config.aylienAPIKey
            });
            textApi.entities({'text': cartText}, function (error, response) {
                if (error === null) {
                    saveBusinessCartData(response, res);
                }
            });
        };
    }

    // TODO: implement the poleId
    saveBusinessCartData() {

        return function (businessCartData, res) {
            var buisnessCardDataModel = new BuisnessCardDataModel({
                cardData: businessCartData,
                poleId: 'Feature does not yet implemented.'
            });

            buisnessCardDataModel.save(function (err) {
                if (err) {
                    throw err;
                }

                res.end(JSON.stringify(businessCartData));
            });
        };
    }

}

exports.businessCardsService = ReceiptScanner;
