// This algorithm: https://web.archive.org/web/20160418004150/http://freespace.virgin.net/hugo.elias/models/m_fire.htm

const N = 50;
const scale = 10;
const step = 0.08;

let xoff = 0;
let yStart = 0;

let rand = false;
let buff1 = [];
let buff2 = [];
let coolingMap = [];

function setup() {
  createCanvas(N * scale, N * scale);

  for (let i = 0; i < N; i++) {
    buff1.push([]);
    buff2.push([]);
    for (let j = 0; j < N; j++) {
      buff1[i].push(j >= N - 2 ? 255 : 0);
      buff2[i].push(j >= N - 2 ? 255 : 0);
    }
  }

  for (let i = 0; i < N; i++) {
    xoff += step;
    cooling(i);
  }
  yStart += step;

  print("Set value rand to True for creating random ripple");
}

function cooling(i = -1) {
  if (i == -1) coolingMap.splice(0, 1);

  coolingMap.push([]);
  let yoff = yStart;

  for (let j = 0; j < N; j++) {
    coolingMap[i == -1 ? N - 1 : i].push(noise(xoff, yoff) * 50);
    yoff += step;
  }

  yStart += step;
}

function createPointFire() {
  if (
    mouseIsPressed &&
    mouseX / scale < N &&
    mouseY / scale < N &&
    mouseX > 0 &&
    mouseY > 0
  ) {
    buff1[Math.floor(mouseX / scale)][Math.floor(mouseY / scale)] = 255;
    buff1[Math.floor(mouseX / scale) + 1][Math.floor(mouseY / scale)] = 255;
  }
}

function draw() {
  background(0);
  //   loadPixels();
  noStroke();

  createPointFire();

  //   if (rand) buff1[Math.floor(random(0, N))][Math.floor(random(0, N))] = 255;

  for (let i = 1; i < N - 1; i++) {
    for (let j = 1; j < N - 1; j++) {
      buff2[i][j - 1] =
        (buff1[i - 1][j] +
          buff1[i + 1][j] +
          buff1[i][j + 1] +
          buff1[i][j - 1]) /
          4 -
        coolingMap[i][j];

      if (buff2[i][j - 1] < 0) {
        buff2[i][j - 1] = 0;
      }

      if (random(0, 10) > 5 && buff2[i][j] >= 80) {
        buff2[i][j - 1] = random(0, 255);
      }

      let temp = Math.floor(buff2[i][j]);

      fill(color(temp != 0 ? 255 : 0, temp, temp / 2.8));
      // fill(color(Math.floor(coolingMap[i][j])));
      rect(i * scale, j * scale, scale, scale);
    }

    fill(color(Math.floor(buff2[i][N - 1])));
    rect(i * scale, (N - 1) * scale, scale, scale);
  }

  let temp = clone(buff1);
  buff1 = clone(buff2);
  buff2 = temp;

  cooling();
  //   updatePixels();
}

function clone(arr) {
  let temp = [];

  for (let i = 0; i < arr.length; i++) {
    temp.push([]);
    temp[i].push(...arr[0]);
  }
  return arr;
}
