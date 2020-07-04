const W = 700;
const H = 700;

const R = 500;
const CHANGE = 0.5;
const SPEED = 0.1;
const K = -2;
const DIR = -1;

let planet;
let path = [];

function setup() {
  createCanvas(W, H);

  planet = new Planet(W / 2, H / 2);

  planet.createSatellite(2);
}

function draw() {
  background(0);

  for (let i = 0; i < 100; i++) {
    if (planet.isNewYear()) path = [];

    path.push(planet.getPoints());

    stroke(255, 0, 150);
    for (let i = 0; i < path.length - 1; i++)
      line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);

    planet.rotate();
  }
  planet.show();
}
