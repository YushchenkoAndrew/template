const W = 700;
const H = 700;

let fireworks = [];

let explosionSound;

function preload() {
  soundFormats("mp3", "ogg");
  explosionSound = loadSound("Fireworks.mp3");
}

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

    // if (random(0, 1) >= 0.6)
    fireworks[i].loadSound(playSound);
  }

  noStroke();
  // translate(-100, -100, -100);
}

function playSound() {
  explosionSound.play();
}

function createRandomFirework() {
  let c = color(
    round(random(0, 255)),
    round(random(0, 2555)),
    round(random(0, 255))
  );

  let firework = new Firework(random(10, W - 10), H, random(-17, -25), c);
  fireworks.push(firework);
  // if (random(0, 1) >= 0.6)
  firework.loadSound(playSound);
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
