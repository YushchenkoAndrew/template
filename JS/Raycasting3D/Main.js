// Explain Recasting: https://lodev.org/cgtutor/raycasting.html#Wolfenstein_3D_Textures_

const W = 800;
const H = 350;

let step;

let bounds = [];
let head;

let point;

let textures = [];
let img;

let w;

function preload() {
  img = loadImage("textures.png");
}
function setup() {
  createCanvas(W, H * 2);

  for (let i = 0; i < 5; i++)
    bounds.push(
      new Bound(
        new Point(random(0, W), random(0, H)),
        new Point(random(0, W), random(0, H))
      )
    );

  bounds.push(new Bound(new Point(0, 0), new Point(W, 0), color(155, 5, 5)));
  bounds.push(new Bound(new Point(0, H), new Point(W, H), color(155, 5, 5)));
  bounds.push(new Bound(new Point(0, 0), new Point(0, H), color(155, 5, 5)));
  bounds.push(new Bound(new Point(W, 0), new Point(W, H), color(155, 5, 5)));

  const w = img.width / 8;

  for (let i = 0; i < 10; i++) {
    textures.push(img.get(i * w, 0, w, img.height));
  }

  head = new Head(new Point(100, 200));
  step = createVector(0, 3);
  step.rotate(PI / 2);

  console.log(
    "Double click set a point for wall\n 2 double click create a wall\n You can shift light source with pressing the mouse button"
  );
}

function doubleClicked() {
  if (!point) {
    point = new Point(mouseX, mouseY);
  } else {
    bounds.push(new Bound(point, new Point(mouseX, mouseY), color(0, 0, 255)));
    point = undefined;
  }
}

function draw() {
  background(0);

  if (keyIsPressed) {
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
      head.setPos(p5.Vector.sub(head.pos, step));
    }
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
      head.setPos(p5.Vector.add(head.pos, step));
    }
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      head.rotate(-0.03);
      step.rotate(-0.03);
    }
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      head.rotate(0.03);
      step.rotate(0.03);
    }
  }

  // head.setPos(createVector(mouseX, mouseY));

  let scene = head.intersect(bounds);
  w = W / scene.length;
  // print(scene);

  // let index = 0;

  for (let i = 0; i < scene.length; i++) {
    noStroke();
    const ratio = scene[i].dist / Math.sqrt(W * W + H * H);
    const invRatio = 1 - ratio;

    // for (let j = 0; j < 15; j++) {
    //   const h = (H / 15) * invRatio;

    let c = scene[i].bound.color;
    // fill(200 * invRatio);
    fill(invRatio * red(c), invRatio * green(c), invRatio * blue(c));
    rect(i * w, H * (1 + ratio / 2), w + 1, H * invRatio);

    // image(img, i * w, H * (1 + ratio / 2), w + 1, H * invRatio);
    // }
  }

  // image(texture, 0, 0);

  // c.resize(3.0);
  for (let i = 0; i < textures.length; i++)
    image(textures[i], 200 + i * 70, 500);

  // print(frameRate());

  for (let bound of bounds) bound.show();
  head.show();
}
