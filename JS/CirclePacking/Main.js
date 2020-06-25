let W = 600;
let H = 600;

const rectSize = 200;

// Chose options
let showGrid = false;
let refresh = false;

const total = 25;
const len = 50;
const freeRange = 2;

let range;

let puzzle;

function preload() {
  img = loadImage("Neko.jpg");
}

function setup() {
  W = img.width;
  H = img.height;
  createCanvas(W, H);

  pixelDensity(1);
  img.loadPixels();

  puzzle = new Interaction(0);
  range = new Rectangle(0, 0, rectSize, rectSize);

  background(0);

  print("For showing grid type 'showGrid = true'");
  print("For refreshing canvas type 'refresh = true'");
}

function draw() {
  if (showGrid) background(0, 20);

  if (refresh) {
    background(0);
    refresh = false;
  }

  range.x = mouseX - rectSize / 2;
  range.y = mouseY - rectSize / 2;

  generateCircle();

  puzzle.show();
}

function generateCircle() {
  let count = 0;
  let attempts = 0;

  while (count < total) {
    let x = floor(random(0, rectSize) + range.x);
    let y = floor(random(0, rectSize) + range.y);
    attempts++;

    if (puzzle.placeIsFree(x, y)) {
      let circle = new Circle(x, y, puzzle.circles.length, getPixelColor(x, y));
      puzzle.circles.push(circle);
      count++;
    }

    if (attempts > 1000) {
      // console.log("Stop");
      // noLoop();
      break;
    }
  }
}

function getPixelColor(x, y) {
  let index = (int(x) + int(y) * img.width) * 4;
  let r = img.pixels[index];
  let g = img.pixels[index + 1];
  let b = img.pixels[index + 2];
  return color(r, g, b);
}
