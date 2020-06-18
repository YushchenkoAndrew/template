// This algorithm: https://web.archive.org/web/20160418004150/http://freespace.virgin.net/hugo.elias/models/m_fire.htm

const N = 500;
// const scale = 10;
const step = 0.08;

let qTree;
let range;
let range2;
let range3;
let range4;
let range5;

let points = [];

let yStart = 0;
let xoff = 0;

let coolingMap = [];

function setup() {
  createCanvas(N, N);

  // for (let i = 0; i < N; i++) {
  //   buff1.push([]);
  //   buff2.push([]);
  //   for (let j = 0; j < N; j++) {
  //     buff1[i].push(0);
  //     buff2[i].push(0);
  //   }
  // }

  // cooling();

  qTree = new QuadTree(new Rectangle(0, 0, N, N));

  range = new Rectangle(200, 200, 100, 100);
  range2 = new Rectangle(300, 200, 100, 100);
  range3 = new Rectangle(100, 200, 100, 100);
  range4 = new Rectangle(400, 200, 100, 100);
  range5 = new Rectangle(0, 200, 100, 100);
  points.push(...qTree.getPoints(range));

  for (let i = 0; i < N; i++) {
    xoff += step;

    cooling(i);
  }
  yStart += step;
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

function firePoint() {
  if (mouseIsPressed && mouseX < N && mouseY < N && mouseX > 0 && mouseY > 0) {
    // buff1[Math.floor(mouseX / scale)][Math.floor(mouseY / scale)] = 255;
    // buff1[Math.floor(mouseX / scale) + 1][Math.floor(mouseY / scale)] = 255;

    qTree.add(new Point(Math.floor(mouseX), Math.floor(mouseY), 255));
    qTree.add(new Point(Math.floor(mouseX - 1), Math.floor(mouseY), 255));

    points = [];
    // range = new Rectangle(mouseX - 50, mouseY - 50, 100, 100);
    points.push(...qTree.getPoints(range));
    // points.push(...qTree.getPoints(range2));
    // points.push(...qTree.getPoints(range3));
    // points.push(...qTree.getPoints(range4));
    // points.push(...qTree.getPoints(range5));
  }
}

function draw() {
  background(0);

  noFill();
  stroke(0, 255, 0);
  rect(range.x, range.y, range.w, range.h);
  // rect(range2.x, range2.y, range2.w, range2.h);
  // rect(range3.x, range3.y, range3.w, range3.h);
  // rect(range4.x, range4.y, range4.w, range4.h);
  // rect(range5.x, range5.y, range5.w, range5.h);

  //   loadPixels();
  noStroke();

  firePoint();

  //   if (rand) buff1[Math.floor(random(0, N))][Math.floor(random(0, N))] = 255;

  // for (let i = 1; i < N - 1; i++) {
  //   for (let j = 1; j < N - 1; j++) {
  //     buff2[i][j - 1] =
  //       (buff1[i - 1][j] +
  //         buff1[i + 1][j] +
  //         buff1[i][j + 1] +
  //         buff1[i][j - 1]) /
  //         4 -
  //       coolingMap[i][j];

  //     if (buff2[i][j - 1] < 0) {
  //       buff2[i][j - 1] = 0;
  //     }

  //     if (random(0, 10) > 5 && buff2[i][j] >= 80) {
  //       buff2[i][j - 1] = random(0, 255);
  //     }

  //     let temp = Math.floor(buff2[i][j]);

  //     fill(color(temp != 0 ? 255 : 0, temp, temp / 2.8));
  // fill(color(Math.floor(coolingMap[j][i])));
  // rect(i, j, 1, 1);
  // }

  //   fill(color(Math.floor(buff2[i][N - 1])));
  //   rect(i * scale, (N - 1) * scale, scale, scale);
  // }

  // let temp = clone(buff1);
  // buff1 = clone(buff2);
  // buff2 = temp;

  let points1 = [];
  points1.push(...qTree.getPoints(range));

  // let points2 = [];
  // points2.push(...qTree.getPoints(range2));

  // let points3 = [];
  // points3.push(...qTree.getPoints(range3));

  // let points4 = [];
  // points4.push(...qTree.getPoints(range4));

  // let points5 = [];
  // points5.push(...qTree.getPoints(range5));

  fireEffect(range, points1);
  // fireEffect(range2, points2);
  // fireEffect(range3, points3);
  // fireEffect(range4, points4);
  // fireEffect(range5, points5);
  points = [];
  qTree.getPoints(range);
  // qTree.getPoints(range2);
  // qTree.getPoints(range3);
  // qTree.getPoints(range4);
  // qTree.getPoints(range5);

  for (let i = 0; i < range.x + 5 * range.w; i++) {
    let p = new Point(i, range.y + range.h - 3, 255);
    let p1 = new Point(i, range.y + range.h - 2, 255);
    qTree.add(p);
    qTree.add(p1);
    // points.push(p);
  }

  points = [];
  points.push(...qTree.getPoints(range));

  qTree.show(false);

  for (let p of points) {
    // stroke(255, 0, 0);
    // fill(255, 0, 0);

    noStroke();

    let temp = Math.floor(p.data);
    fill(color(temp > 28 ? 255 : temp * 3, temp, temp / 2.8, 180));
    rect(p.x, p.y, 1, 1);
    // set(p.x, p.y, color(temp != 0 ? 255 : 0, temp, temp / 2.8));
    // ellipse(p.x, p.y, 1, 1);
  }

  cooling();
  //   updatePixels();
}

function fireEffect(range, points) {
  // print(points);

  if (points.length == 0) return;

  let newTree = new QuadTree(new Rectangle(0, 0, N, N));

  for (let p of points) {
    let buff1 = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    let temp = [];
    temp.push(...qTree.getPoints(new Rectangle(p.x - 1, p.y - 1, 3, 3)));

    for (let t of temp) {
      buff1[t.x - p.x + 1][t.y - p.y + 1] = t.data;
    }

    // print(temp);
    // print(buff1);
    // points = [];
    // Set neighbors

    let nb1 = buff1[2][1];
    let nb2 = buff1[0][1];
    let nb3 = buff1[1][0];
    let nb4 = buff1[1][2];

    let data = (nb1 + nb2 + nb3 + nb4) / 4 - coolingMap[p.y][p.x];
    // print(data);

    if (data > 0) {
      let t = new Point(p.x, p.y - 1, data);

      if (random(0, 1) > 0.85) t.data = random(0, 255);
      newTree.add(t);
      // points.push(p);
    }
  }

  qTree = newTree;

  // print(newTree);
  // noLoop();
  // print(qTree);

  // print(buff1);
}
