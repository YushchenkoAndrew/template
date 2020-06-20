const W = 700;
const H = 700;

let fireworks = [];

function setup() {
  createCanvas(W, H);
  // createCanvas(W, H, WEBGL);

  for (let i = 0; i < 10; i++) {
    let c = color(
      round(random(0, 255)),
      round(random(0, 2555)),
      round(random(0, 255))
    );
    fireworks.push(new Firework(random(10, W - 10), H, random(-17, -25), c));
  }

  noStroke();
}

function createRandomFirework() {
  let c = color(
    round(random(0, 255)),
    round(random(0, 2555)),
    round(random(0, 255))
  );
  fireworks.push(new Firework(random(10, W - 10), H, random(-17, -25), c));
}

function draw() {
  background(0, 50);

  if (mouseIsPressed) createRandomFirework();

  if (frameCount % 20 == 0) createRandomFirework();

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].show();

    if (fireworks[i].end) fireworks.splice(i, 1);
  }
}
