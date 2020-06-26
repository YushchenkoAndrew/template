const W = window.innerWidth;
const H = window.innerHeight;

let f;
let behavior;

let mouse;

function preload() {
  f = loadFont("Fonts/BPdotsLight.otf");
}

function setup() {
  createCanvas(W, H);

  fill(255);

  let input = [];
  input.push(new Data("Press mouse to change Text!", 150, H - 20, W - 400));
  input.push(
    new Data(
      "When you release mouse You create an explosion",
      150,
      H - 20,
      W - 600
    )
  );
  input.push(new Data("So have FUN!!!", 150, H - 20, W - 400));
  input.push(new Data("Made by ..", 150));
  input.push(new Data("Andrew Y.", 150));
  input.push(new Data("This dude", 72, 100));

  print(input);

  behavior = new SteeringBehavior(input);
}

function mouseReleased() {
  behavior.setExplosion();
}

function draw() {
  background(0, 50);

  // if (mouseIsPressed) ellipse(mouseX, mouseY, 50);

  mouse = createVector(mouseX, mouseY);

  behavior.show();
}
