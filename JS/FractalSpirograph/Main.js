const W = 700;
const H = 700;

let R = 500;

const SPEED = 0.1;

let K = -2;
let CHANGE = 0.5;
let DIR = -1;

let planet;
let path = [];

function setup() {
  createCanvas(W, H);

  planet = new Planet(W / 2, H / 2);

  planet.createSatellite(2);

  console.log("Menu for controlling Fractal Spirograph");
  console.log("Figure will change on each 50 frame");
  console.log("Mouse X - change amount of circles");
  console.log("Mouse Y - change size of this circles");
  console.log("On mouse Click - change equation on (-1)^n");
  console.log("On double Click - change circles location");
}

function mousePressed() {
  K *= -1;

  createFigure();
}

function doubleClicked() {
  DIR *= -1;
  R = DIR == -1 ? 500 : 200;

  createFigure();
}

function createFigure() {
  CHANGE = mouseY / H;

  planet = new Planet(W / 2, H / 2);
  planet.createSatellite(Math.floor((mouseX / W) * 5) + 2);
}

function draw() {
  background(0);

  stroke(255, 200);
  line(mouseX, 0, mouseX, H);
  line(0, mouseY, W, mouseY);
  fill(255, 100);
  ellipse(mouseX, mouseY, 20);

  if (!(frameCount % 50)) {
    createFigure();
  }

  for (let i = 0; i < 100; i++) {
    if (planet.isNewYear()) path = [];

    path.push(planet.getPoints());

    stroke(255, 0, 150);
    for (let i = 0; i < path.length - 1; i++) line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);

    planet.rotate();
  }
  planet.show();
}
