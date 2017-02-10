const config = require('../config/config');
const BuisnessCardDataModel = require('../models/BuisnessCardData');

const Vision = require('@google-cloud/vision');
const Language = require('@google-cloud/language');
const vision = Vision();


class GoogleCloudService {

    serviceRun(imageName) {
        const imagesDir = `${__dirname}/../public/uploads`;
        const image = `${imagesDir}/${imageName}`;
//        const image = `${imagesDir}/article-2317363-198FF560000005DC-428_634x460.jpg`;
        const detectText = this.detectText();

        vision.detectText(image)
                .then((results) => {
                    detectText(results[0]);
                });
    }

    detectText() {
        const saveProcessedData = this.saveProcessedData();
        const languageClient = Language({
            projectId: config.googleProjectID
        });

        return function (text) {
            const cleanedText = text[0].replace(/\n/g, ' ');

            console.log(cleanedText);

            const document = languageClient.document({
                content: cleanedText
            });
            
            // Testing only ----------------------------------------
            saveProcessedData(cleanedText);
            //------------------------------------------------------
            
            document.detectEntities()
                    .then((results) => {
                        const entities = results[0];

                        console.log('Entities:');
                        for (let type in entities) {
                            console.log(`${type}:`, entities[type]);
                        }



                        saveProcessedData(entities);
                    });
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

                console.log('Cart processed data saved successfully.');
            });
        };
    }
}

exports.businessCardsService = GoogleCloudService;