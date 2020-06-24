const W = 700;
const H = 700;

let temp;

function setup() {
  createCanvas(W, H);

  temp = new Interaction(100);
}

function mouseClicked() {
  temp.circles.push(new Circle(mouseX, mouseY, temp.circles.length));
}

function draw() {
  background(0);

  temp.show();
}
