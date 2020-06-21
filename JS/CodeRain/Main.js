const W = window.innerWidth;
const H = window.innerHeight;

let rain;

function setup() {
  let canvas = createCanvas(W, H);
  canvas.position(0, 0);

  rain = new CodeRain(
    "Testing... Hello world! Now I need to write some text for testing this thing : (",
    16
  );
  rain.startMatrix();
}

function draw() {
  background(0, 100);

  rain.show();
}
