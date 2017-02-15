var BuisnessCardDataModel = require('../models/BuisnessCardData');
var cv = require('opencv');

class OpenCV {

    serviceRun(imageName) {
        const extractBusinessCartData = this.extractBusinessCartData();
        extractBusinessCartData(imageName);
    }

    extractBusinessCartData() {
        const imgDir = `${__dirname}/../public/uploads`;

        return function (imageName) {
            cv.readImage(`${imgDir}/${imageName}`, function (err, im) {
                im.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
                    for (var i = 0; i < faces.length; i++) {
                        var x = faces[i]
                        im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);
                    }
//                    console.log(cv);
                    im.save(`${imgDir}/out.jpg`);
                });
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

exports.businessCardsService = OpenCV;

/**
 * --   Python 3:
 --     Interpreter:                 /home/daf/.virtualenvs/cv/bin/python3.4 (ver 3.4.3)
 --     Libraries:                   /usr/lib/x86_64-linux-gnu/libpython3.4m.so (ver 3.4.3)
 --     numpy:                       /home/daf/.virtualenvs/cv/lib/python3.4/site-packages/numpy/core/include (ver 1.12.0)
 --     packages path:               lib/python3.4/site-packages
 -- 
 --   Python (for build):            /usr/bin/python2.7
 -- 
 --   Java:
 --     ant:                         NO
 --     JNI:                         /usr/lib/jvm/default-java/include /usr/lib/jvm/default-java/include /usr/lib/jvm/default-java/include
 --     Java wrappers:               NO
 --     Java tests:                  NO
 -- 
 --   Matlab:                        Matlab not found or implicitly disabled
 -- 
 --   Documentation:
 --     Doxygen:                     NO
 -- 
 --   Tests and samples:
 --     Tests:                       YES
 --     Performance tests:           YES
 --     C/C++ Examples:              YES
 -- 
 --   Install path:                  /usr/local
 -- 
 --   cvconfig.h is in:              /home/daf/opencv/build
 -- -----------------------------------------------------------------
 -- 
 -- Configuring done
 -- Generating done
 -- Build files have been written to: /home/daf/opencv/build
 cv2.cpython-34m.so


git clone git@staging.aprimind.com:angular_test.git 
origin git@staging.aprimind.com:ys.git
ysadmin@admin.com

 */