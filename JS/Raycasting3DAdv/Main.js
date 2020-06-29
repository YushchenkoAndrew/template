// Explain Recasting: https://lodev.org/cgtutor/raycasting.html#Wolfenstein_3D_Textures_

const W = 800;
const H = 350;

const step = 50;

let scene;
let point;

let textures = [];
let img;

let map;

function preload() {
  img = loadImage("textures.png");
}

function setup() {
  createCanvas(W, H * 2);

  loadTexture();

  map = new Generator();

  // Create Map
  while (map.move());

  scene = new Scene(false);

  // scene.createRandomSurface(4);
  scene.loadMap(map.grid);

  console.log(
    "Double click set a point for wall\n 2 double click create a wall\n You can shift light source with pressing the mouse button"
  );
}

function loadTexture() {
  const w = img.width / 8;

  for (let i = 0; i < 10; i++) {
    textures.push(img.get(i * w, 0, w, img.height));
  }
}

function doubleClicked() {
  if (!point) {
    point = new Point(mouseX, mouseY);
  } else {
    scene.bounds.push(
      new Bound(point, new Point(mouseX, mouseY), textures[4], color(0, 0, 255))
    );
    point = undefined;
  }
}

function draw() {
  background(0);

  scene.move();

  // scene.debug();

  scene.show();

  // map.show();

  for (let bound of scene.bounds) bound.show();

  scene.head.show();
}
