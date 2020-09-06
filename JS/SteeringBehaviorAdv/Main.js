const W = window.innerWidth;
const H = window.innerHeight;

const rectSize = 300;
const shift = { x: 500, y: 150 };

// Chose options
let showGrid = false;
let refresh = false;

const total = 25;
const len = 50;
const freeRange = 5;

let range;

let puzzle;

let f;
let inform;
let central;

let mouse;

function preload() {
  img = loadImage("Neko.jpg");
  f = loadFont("Fonts/BPdotsLight.otf");
}

function setup() {
  createCanvas(W, H);

  fill(255);

  let input = [];
  input.push(new Data("Press and hold mouse to change Text!", 150, H - 20, W - 600));
  input.push(new Data("When you press/release mouse You create a some special effect", 150, H - 20, W - 800));
  input.push(new Data("Press arrow left/right Key to chang effect", 150, H - 20, W - 700));
  input.push(new Data("Explosion", 150, H - 20, W - 300));
  input.push(new Data("Flee", 150, H - 20, W - 200));
  input.push(new Data("Magnet", 150, H - 20, W - 200));
  input.push(new Data("None.", 150, H - 20, W - 200));

  inform = new SteeringBehavior(input, 3);

  input = [];

  input.push(new Data("Welcome", 150));
  input.push(new Data("Tutorial", 150));
  input.push(new Data("Have Fun!!", 150));
  input.push(new Data("Made by ..", 150));
  input.push(new Data("Andrew Y.", 150));
  input.push(new Data("Have fun!!", 72, 100));
  input.push(new Data("Have fun!!", 72, 100));

  central = new SteeringBehavior(input);

  print(input);

  pixelDensity(1);
  img.loadPixels();

  puzzle = new Interaction(0);
  range = new Rectangle(0, 0, rectSize, rectSize);

  background(0);

  print("For showing grid type 'showGrid = true'");
  print("For refreshing canvas type 'refresh = true'");
}

function mouseReleased() {
  inform.changeData();
  central.changeData();
}

function keyPressed() {
  inform.changeEffect(3);
  central.changeEffect();
}

function draw() {
  if (showGrid) background(0, 20);

  if (refresh) {
    background(0);
    refresh = false;
  }

  background(0, 50);

  mouse = createVector(mouseX, mouseY);
  range.x = mouseX - rectSize / 2;
  range.y = mouseY - rectSize / 2;

  if (central.index == central.data.length - 1 && mouseIsPressed) {
    generateCircle();
    puzzle.show();
  }
  central.show();
  inform.show();
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

    if (attempts > 25) {
      // console.log("Stop");
      // noLoop();
      break;
    }
  }
}

function getPixelColor(x, y) {
  let index = (int(x - shift.x) + int(y - shift.y) * img.width) * 4;
  let r = img.pixels[index];
  let g = img.pixels[index + 1];
  let b = img.pixels[index + 2];
  return color(r, g, b);
}
