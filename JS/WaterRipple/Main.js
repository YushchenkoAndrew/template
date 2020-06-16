// This algorithm: https://web.archive.org/web/20160418004149/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm

const N = 50;
const scale = 10;

const damping = 0.95;

let rand = false;
let buff1 = [];
let buff2 = [];

function setup() {
  createCanvas(N * scale, N * scale);

  for (let i = 0; i < N; i++) {
    buff1.push([]);
    buff2.push([]);
    for (let j = 0; j < N; j++) {
      buff1[i].push(0);
      buff2[i].push(0);
    }
  }

  print("Set value rand to True for creating random ripple");
}

function mouseDragged() {
  if (mouseX / scale < N && mouseY / scale < N && mouseX > 0 && mouseY > 0)
    buff1[Math.floor(mouseX / scale)][Math.floor(mouseY / scale)] = 255;
}

function mouseClicked() {
  if (mouseX / scale < N && mouseY / scale < N && mouseX > 0 && mouseY > 0)
    buff1[Math.floor(mouseX / scale)][Math.floor(mouseY / scale)] = 255;
}

function draw() {
  background(0);
  //   loadPixels();
  noStroke();

  if (rand)
    buff1[Math.floor(random(10, N - 10))][Math.floor(random(10, N - 10))] = 255;

  for (let i = 1; i < N - 1; i++) {
    for (let j = 1; j < N - 1; j++) {
      buff2[i][j] =
        (buff1[i - 1][j] +
          buff1[i + 1][j] +
          buff1[i][j + 1] +
          buff1[i][j - 1]) /
          2 -
        buff2[i][j];

      buff2[i][j] *= damping;

      fill(color(Math.floor(buff2[i][j])));
      rect(i * scale, j * scale, scale, scale);
      //   fill(0);
      //   set(i * 2, j * 2 + 1, color());
      //   set(i * 2 + 1, j * 2, color(Math.floor(buff2[i][j])));
      //   set(i * 2 + 1, j * 2 + 1, color(Math.floor(buff2[i][j])));
    }
  }

  let temp = clone(buff1);
  buff1 = clone(buff2);
  buff2 = temp;

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
