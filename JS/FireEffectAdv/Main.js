// This algorithm: https://web.archive.org/web/20160418004150/http://freespace.virgin.net/hugo.elias/models/m_fire.htm

const N = 500;
let scale = 2;
const step = 0.08;
const rangeAmount = 5;

let qTree;
let new_qTree;
let range = [];

let points = [];

let yStart = 0;
let xoff = 0;

let coolingMap = [];

let showGrid = true;
function setup() {
  createCanvas(N, N);

  qTree = new QuadTree(new Rectangle(0, 0, N, N));

  for (let i = 0; i < rangeAmount; i++) range.push(new Rectangle(100 * i, 200, 100, 100));

  for (let i = 0; i < N; i++) {
    xoff += step;

    cooling(i);
  }
  yStart += step;

  print("For disable grid print 'showGrid = false");
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

function changeRange() {
  if (mouseIsPressed) {
    for (let i = 0; i < rangeAmount; i++)
      if (range[i].contain(new Point(mouseX, mouseY))) {
        range[i].x = mouseX - 50 > 0 && mouseX - 50 < N ? mouseX - 50 : range[i].x;
        range[i].y = mouseY - 50 > 0 && mouseY - 50 < N ? mouseY - 50 : range[i].x;
        // print(range[i]);
      }
  }
}

function draw() {
  background(0);

  noFill();
  stroke(0, 255, 0);

  if (showGrid) for (let r of range) rect(r.x, r.y, r.w, r.h);

  //   loadPixels();
  noStroke();

  changeRange();

  new_qTree = new QuadTree(new Rectangle(0, 0, N, N), 5);
  points = [];

  for (let r of range) {
    fireEffect(r, qTree.getPoints(r), new_qTree);
    points.push(...qTree.getPoints(r));
  }

  qTree = new_qTree;

  for (let r of range)
    for (let i = r.x; i < r.x + r.w; i += scale) {
      let p = new Point(i, r.y + r.h - 2, 255);
      qTree.add(p);
      points.push(p);
    }

  if (showGrid) qTree.show(false);

  for (let p of points) {
    // stroke(255, 0, 0);

    noStroke();
    let temp = Math.floor(p.data);
    fill(color(temp > 28 ? 255 : temp * 3, temp, temp / 2.8, showGrid ? 180 : 255));
    rect(p.x, p.y, scale, scale);
  }
  cooling();
}

function fireEffect(range, points, qTree) {
  let buff1 = new Array(Math.floor(range.h / scale));

  for (let p of points) {
    if (buff1[Math.floor((p.x - range.x) / scale)] === undefined) buff1[Math.floor((p.x - range.x) / scale)] = new Array(Math.floor(range.w / scale));

    buff1[Math.floor((p.x - range.x) / scale)][Math.floor((p.y - range.y) / scale)] = p.data;
  }

  // print(buff1);
  // points = [];

  for (let i = 1; i < range.w / scale; i++) {
    for (let j = 1; j < range.h / scale; j++) {
      // Set neighbors
      let nb1 = 0;
      let nb2 = 0;
      let nb3 = 0;
      let nb4 = 0;

      if (buff1[i] !== undefined) {
        nb3 = buff1[i][j + 1] === undefined ? 0 : buff1[i][j + 1];
        nb4 = buff1[i][j - 1] === undefined ? 0 : buff1[i][j - 1];
      }

      if (buff1[i + 1] !== undefined) nb1 = buff1[i + 1][j] === undefined ? 0 : buff1[i + 1][j];

      if (buff1[i - 1] !== undefined) nb2 = buff1[i - 1][j] === undefined ? 0 : buff1[i - 1][j];

      let data = (nb1 + nb2 + nb3 + nb4) / 4 - coolingMap[j + range.y][i + range.x];
      // print(data);

      if (data > 0) {
        let p = new Point(range.x + i * scale, range.y + (j - 1) * scale, data);

        if (random(0, 1) > 0.88) p.data = random(0, 255);
        qTree.add(p);
        // points.push(p);
      }
    }
  }
}
