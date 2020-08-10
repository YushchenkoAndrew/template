const W = 800;
const H = 700;

const R = 50;
const GRAPH_X = R * 5;
const N = 5;
const step = 2 * (R + 20);

let series = [];
let stack = [];

function setup() {
  let canvas = createCanvas(W, H);
  canvas.position((window.innerWidth - W) / 2, 50);
  colorMode(HSB, 20, 255, 255);

  for (let i = 0; i < N; i++) {
    series.push(new FourierSeries(createVector(R * 3, step * i + R * 1.5), i, i * 2));
    stack.push([]);
  }
}

function draw() {
  background(0);

  // Show Division
  stroke(0, 0, 50);
  line(GRAPH_X, 0, GRAPH_X, H);

  for (let i in series) {
    series[i].update();
    series[i].show();

    stroke(0, 0, 50);
    line(GRAPH_X, step * i, W, step * i);
  }

  stroke(0, 0, 255);
  line(W, 0, W, H);
}
