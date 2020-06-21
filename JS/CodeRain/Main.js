const W = window.innerWidth;
const H = window.innerHeight;
const symbolSize = 16;

let streams = [];

function setup() {
  let canvas = createCanvas(W, H);
  canvas.position(0, 0);

  textSize(symbolSize);

  for (let i = 0; i < floor(W / symbolSize); i++)
    streams.push(new Stream(i * symbolSize, random(-600, -50)));
}

function draw() {
  background(0, 100);

  for (let stream of streams) stream.show();
}
