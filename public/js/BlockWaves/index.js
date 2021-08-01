const height = 100;
const width = 100;

const w = 10;
let h;

let angle = 0;

function setup() {
  createCanvas(700, 700, WEBGL);

  frameRate(20);
}

function draw() {
  background(200);
  ortho(-width - 100, width + 100, -height - 100, height + 100, 0, 1000);
  directionalLight(250, 250, 250, 40, 50, -50);

  rotateX(-PI / 6);
  rotateY(-PI / 4);
  //   rotateY((frameCount * PI) / 2.3);
  //   stroke(0);

  for (let x = -height / w; x < height / w; x++) {
    for (let y = -width / w; y < width / w; y++) {
      push();
      let d = dist(0, 0, x * w, y * w);
      let a = (0.5 - d / dist(0, 0, height, width)) * PI * 2;

      translate(x * w, 0, y * w);
      //   normalMaterial();
      h = Math.sin(angle + a) * 50 + 100;
      box(w, h, w);
      pop();
    }
  }

  angle += 0.2;
}
