let W = 400;
let H = 400;

const path = ["GawrGura.jpg", "Shark.png", "6f7acfd72f044f6daf81147dfc8ab6b5.jpg"];
const local = "JS/ASCII-art/";

const fontSize = 5;
const scale = 4;
const repeat = 1;

let img = [];
let respond = [];

function preload() {
  for (let i in path) {
    img.push(loadImage(path[i]));

    // Get local file
    respond.push(
      fetch(`/projects/ASCII-art?path=${local + path[i]}&scale=${scale}&repeat=${repeat}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    );
  }
}

function setup() {
  W = img.reduce((acc, curr) => (acc < curr.width ? curr.width : acc), 0);
  H = img.reduce((acc, curr) => acc + curr.height, 0);

  createCanvas(W * 2, H);

  let y = 0;
  for (let i in img) {
    image(img[i], 0, y);

    // Wait until request is finished
    respond[i].then(
      ((deltaY, res) =>
        res.text().then((data) => {
          textSize(fontSize);
          let lines = data.split("\n");
          for (let i in lines) {
            for (let j in lines[i]) text(lines[i].charAt(j), j * scale + W, i * scale + deltaY);
          }
        })).bind(null, y)
    );

    y += img[i].height;
  }
}

function draw() {}
