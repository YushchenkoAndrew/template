const W = 700;
const H = 700;

const offset = 20;

let gift;

function setup() {
  createCanvas(W, H);

  gift = new GiftWrapping(100);

  // while (!gift.update());
}

function mouseClicked() {
  gift.add(createVector(mouseX, mouseY));
}

function draw() {
  background(0);

  gift.show();
}
