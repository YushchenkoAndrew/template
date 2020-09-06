const W = window.innerWidth;
const H = window.innerHeight;

let f;
let inform;
let central;

let mouse;

function preload() {
  f = loadFont("Fonts/BPdotsLight.otf");
}

function setup() {
  createCanvas(W, H);

  fill(255);

  let input = [];
  input.push(new Data("Press and hold mouse to change Text!", 150, H - 20, W - 600));
  input.push(new Data("When you press/release mouse You create a some special effect", 150, H - 20, W - 800));
  input.push(new Data("Press arrow left/right Key to chang effect", 150, H - 20, W - 700));
  input.push(new Data("Explosion", 150, H - 20, W - 300));
  input.push(new Data("Flee", 150, H - 20, W - 200));
  input.push(new Data("Magnet", 150, H - 20, W - 200));
  input.push(new Data("None.", 150, H - 20, W - 200));

  inform = new SteeringBehavior(input, 3);

  input = [];

  input.push(new Data("Welcome", 150));
  input.push(new Data("Tutorial", 150));
  input.push(new Data("Have Fun!!", 150));
  input.push(new Data("Made by ..", 150));
  input.push(new Data("Andrew Y.", 150));
  input.push(new Data("This effect based on Steering Force", 72, 100));
  input.push(new Data("Here can be your Advertisement (^_~)", 65, 250));

  central = new SteeringBehavior(input);

  print(input);
}

function mouseReleased() {
  inform.changeData();
  central.changeData();
}

function keyPressed() {
  inform.changeEffect(3);
  central.changeEffect();
}

function draw() {
  background(0, 50);

  // if (mouseIsPressed) ellipse(mouseX, mouseY, 50);

  mouse = createVector(mouseX, mouseY);

  central.show();
  inform.show();
}
