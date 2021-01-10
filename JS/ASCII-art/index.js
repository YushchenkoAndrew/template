const pixel = require("get-pixels");
const { writeFileSync } = require("fs");

function getPixels(path) {
  return new Promise((resolve, reject) => pixel(path, (err, data) => (err ? reject(err) : resolve(data))));
}

function convertToAscii(path, { scale = 1, repeat = 2 } = {}) {
  return new Promise(async (resolve, reject) => {
    let {
      shape: [W, H, pxD],
      data,
    } = await getPixels(path);

    let str = "";
    let ascii = ' `^",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

    for (let i = 0; i < H; i += scale) {
      for (let j = 0; j < W; j += scale) {
        let index = (j + i * W) * pxD;
        let gray = Math.floor(data.slice(index, index + 3).reduce((acc, curr) => acc + curr) / 3);
        str += ascii.charAt(Math.floor((1 - gray / 255) * (ascii.length - 1))).repeat(repeat);
      }
      str += "\n";
    }

    resolve(str);
  });
}

convertToAscii("./Shark.png", { scale: 7, repeat: 2 }).then((data) => {
  console.log(data);
  writeFileSync("ASCII-art.txt", data);
});
