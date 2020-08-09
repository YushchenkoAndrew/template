const W = window.innerWidth;
const H = window.innerHeight;

let rain;

function setup() {
  let canvas = createCanvas(W, H);
  canvas.position(0, 0);

  rain = new CodeRain("I'm the creeper, catch me if you can!", 16);
  rain.startMatrix();
}

function draw() {
  background(0, 100);

  rain.show();
}
