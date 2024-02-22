const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:2024-02-15
 * Author:Yue(Lara) Li
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const sepiaPath = path.join(__dirname, "sepia");

IOhandler.unzip(zipFilePath, pathUnzipped)

    .then(() => { return IOhandler.readDir(pathUnzipped) })
    .then((pngFilePaths) => {
        console.log("Reading directory completed");
        const promises = pngFilePaths.map((filePath) =>
            IOhandler.grayScale(filePath, path.join(pathProcessed, path.basename(filePath)))
        );
        return Promise.all(promises);
    })
    .catch((err) => {
        console.error(err);
    })


