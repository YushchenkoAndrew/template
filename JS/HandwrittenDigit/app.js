const W = 900;
const H = 700;

const lineWidth = 2;

const modelDetails = {
  model: "model/model.json",
  metadata: "model/model_meta.json",
  weights: "model/model.weights.bin",
};

let handwriting;

function setup() {
  createCanvas(W, H);

  textSize(24);
  textFont("Comic Sans MS");

  handwriting = new Handwriting();
}

// function mouseDragged() {
//   handwriting.setPixel({ x: mouseX, y: mouseY });
// }

function mouseClicked() {
  handwriting.press({ mouseX, mouseY });
}

function draw() {
  background(0);

  if (mouseIsPressed) handwriting.setPixel({ x: mouseX, y: mouseY });

  handwriting.draw();
}
