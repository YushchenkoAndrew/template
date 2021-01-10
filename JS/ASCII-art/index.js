const pixel = require("get-pixels");
const { writeFileSync } = require("fs");
const { resolve } = require("path");

function getPixels(path) {
  return new Promise((resolve, reject) => pixel(path, (err, data) => (err ? reject(err) : resolve(data))));
}

function grayScaleImage(pixels) {
  if (!Array.isArray(pixels)) throw Error("Not an Array");

  let grayPixels = [];
  for (let i = 0; i < pixels.length; i += 4) {
    grayPixels.push(Math.floor(pixels.slice(i, i + 3).reduce((acc, curr) => acc + curr) / 3));
  }

  return grayPixels;
}

function get2D(pixels, [W, H], { scale = 1 }) {
  if (!Array.isArray(pixels)) throw Error("Not an Array");

  let data = [];
  let index = 0;
  for (let i = 0; i < H; i += scale) {
    data.push([]);

    for (let j = 0; j < W; j += scale) {
      data[index].push(pixels[j + i * W]);
    }

    index++;
  }

  return data;
}

function printAscii(pixels) {
  if (!Array.isArray(pixels)) throw Error("Not an Array");

  let ascii = ' `^",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
  let str = "";

  for (let i in pixels) {
    if (!Array.isArray(pixels[i])) return reject("Not an Array");

    for (let j in pixels) str += ascii.charAt(Math.floor((1 - pixels[i][j] / 255) * (ascii.length - 1))).repeat(2);
    str += "\n";
  }

  console.log(str);
  return str;
}

async function convertToAscii(path, options = {}) {
  let { shape, data } = await getPixels(path);
  let pixelsMap = get2D(grayScaleImage(Array.from(data)), shape, options);

  return new Promise((resolve, reject) => resolve(printAscii(pixelsMap)));
}

convertToAscii("./Shark.png", { scale: 5 }).then((data) => writeFileSync("ACII-art.txt", data));
