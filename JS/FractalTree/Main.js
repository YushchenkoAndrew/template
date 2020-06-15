let angle;
let slider;

function setup() {
  createCanvas(700, 700);
  slider = createSlider(0, PI, PI / 4, 0.01);
}

function draw() {
  background(0);
  angle = slider.value();
  stroke(255);
  translate(350, 700);
  branch(250);
}

function branch(len) {
  line(0, 0, 0, -len);
  translate(0, -len);
  if (len > 1) {
    push();
    rotate(angle);
    branch(len * 0.6);
    pop();

    push();
    rotate(-angle);
    branch(len * 0.6);
    pop();
  }
}
