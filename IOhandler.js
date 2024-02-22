/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

// const unzipper = require("unzipper"),
//   fs = require("fs"),
//   PNG = require("pngjs").PNG,
//   path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const yauzl = require('yauzl-promise');
const fs = require("fs");
const { pipeline } = require("stream/promises");

const unzip = async (pathIn, pathOut) => {
  const zip = await yauzl.open(pathIn);
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith('/')) {
        await fs.promises.mkdir(`${pathOut}/${entry.filename}`);
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(
          `${pathOut}/${entry.filename}`
        );
        await pipeline(readStream, writeStream);
        console.log(`Extraction operation complete`);
      }
    }
  } finally {
    await zip.close();
  }
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const jpgFilePaths = [];
        files.forEach((file) => {
          if (file.endsWith(".png")) {
            jpgFilePaths.push(`${file}`);
          }
          resolve(jpgFilePaths);
        });
        console.log(jpgFilePaths);
      }
    });
  })

};


/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
*/

const PNG = require("pngjs").PNG;
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {

    fs.createReadStream(pathIn)
      .pipe(
        new PNG({
          filterType: 4,
        })
      )
      .on("error", function (err) {
        console.log(err);
      })
      .on("parsed", function () {
        for (var i = 0; i < this.data.length; i += 4) {
          let r = this.data[i];
          let g = this.data[i + 1];
          let b = this.data[i + 2];
          let a = this.data[i + 3];
          let gray = (r + g + b) / 3;
          this.data[i] = gray;
          this.data[i + 1] = gray;
          this.data[i + 2] = gray;
        }
        this.pack().pipe(fs.createWriteStream(pathOut))
          .on("error", function (err) {
            reject(err);
          })
          .on("finish", function () {
            resolve();

          });
      });
  });
};


/**
 * Description: Read in png file by given pathIn,
 * convert to sepia and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
*/


const sepia = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {

    fs.createReadStream(pathIn)
      .pipe(
        new PNG({
          filterType: 4,
        })
      )
      .on("error", function (err) {
        console.log(err);
      })
      .on("parsed", function () {
        for (var i = 0; i < this.data.length; i += 4) {
          let r = this.data[i];
          let g = this.data[i + 1];
          let b = this.data[i + 2];
          let a = this.data[i + 3];
          let tr = 0.393 * r + 0.769 * g + 0.189 * b;
          let tg = 0.349 * r + 0.686 * g + 0.168 * b;
          let tb = 0.272 * r + 0.534 * g + 0.131 * b;
          tr = Math.min(tr, 255);
          tg = Math.min(tg, 255);
          tb = Math.min(tb, 255);
          this.data[i] = tr;
          this.data[i + 1] = tg;
          this.data[i + 2] = tb;
        }
        this.pack().pipe(fs.createWriteStream(pathOut))
          .on("error", function (err) {
            reject(err);
          })
          .on("finish", function () {
            resolve();

          });
      });
  });
};

// unzip("./myfile.zip", "./unzipped");
grayScale("./unzipped/in2.png", "./grayscaled/in2.png");
sepia("./unzipped/in2.png", "./sepia/in2.png");


module.exports = {
  unzip,
  readDir,
  grayScale,
  sepia
};
