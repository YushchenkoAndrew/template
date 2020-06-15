let coords_Z = [];

const w = 60;
const h = 40;
const scale = 30;

const step = 0.05;
let pos = 0;

function setup() {
  createCanvas(700, 700, WEBGL);

  frameRate(20);
}

function draw() {
  background(0);
  translate(-800, 500, -900);
  rotateX(PI / 2.3);

  shiftNoise();

  for (let y = 0; y < h; y++) {
    beginShape(TRIANGLES);
    fill(0);
    stroke(255);

    for (let x = 0; x < w; x++) {
      vertex((x + 1) * scale, y * scale, coords_Z[x + 1][y]);
      vertex(x * scale, (y + 1) * scale, coords_Z[x][y + 1]);
      vertex(x * scale, y * scale, coords_Z[x][y]);

      vertex((x + 1) * scale, (y + 1) * scale, coords_Z[x + 1][y + 1]);
      vertex((x + 1) * scale, y * scale, coords_Z[x + 1][y]);
      vertex(x * scale, (y + 1) * scale, coords_Z[x][y + 1]);
    }
    endShape();
  }
}

function shiftNoise() {
  coords_Z = [];

  for (let i = 0; i < (w + 1) * step; i += step) {
    coords_Z.push([]);
    let index = coords_Z.length - 1;
    for (let j = pos; j < (h + 1) * step + pos; j += step)
      coords_Z[index].push(noise(i, j) * 700);
  }

  pos -= step;
}
