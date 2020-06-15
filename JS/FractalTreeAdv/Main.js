let angle;
let slider;

let tree = [];
let dx;

function setup() {
  createCanvas(800, 800);
  slider = createSlider(0, 100, 50, 0.01);

  angle = slider.value();
  dx = random(0, 5);
  // translate(350, 700);
  // branch(250);

  let a = createVector(400, 800);
  let b = createVector(400, 600);

  tree.push(new Branch(a, b));
}

function mousePressed() {
  for (let i = tree.length - 1; i >= 0; i--) {
    if (!tree[i].finished) {
      tree.push(...tree[i].branch());

      if (random(0, 1) > 0.5) {
        tree[i].leaf();
      }
    }
  }
}

function draw() {
  background(0);
  for (let i = tree.length - 1; i >= 0; i--) {
    if (!tree[i].finished) {
      tree[i].jitter(dx);
    }
    tree[i].show(dx);
  }
  dx += 0.01;
}
