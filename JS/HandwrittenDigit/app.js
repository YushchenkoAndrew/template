const W = 900;
const H = 700;

const lineWidth = 2;
const delay = 100;

const modelDetails = {
  model: "model/model.json",
  metadata: "model/model_meta.json",
  weights: "model/model.weights.bin",
};

const handwriting = new Handwriting();

function setup() {
  createCanvas(W, H);

  textSize(24);
  textFont("Comic Sans MS");
}

function mouseClicked() {
  handwriting.press({ mouseX, mouseY });
}

function draw() {
  background(0);

  if (mouseIsPressed) handwriting.setPixel({ x: mouseX, y: mouseY });
  else handwriting.prevCoords = { x: -1, y: -1 };

  handwriting.draw();
}
