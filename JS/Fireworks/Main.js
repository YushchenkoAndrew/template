const W = 700;
const H = 700;

let fireworks = [];

let angle = 0;

let explosionSound;
let playFlag = true;

function preload() {
  soundFormats("mp3", "ogg");
  explosionSound = loadSound("Fireworks.mp3");
}

function setup() {
  // createCanvas(W, H);
  createCanvas(W, H, WEBGL);

  for (let i = 0; i < 10; i++) {
    let c = color(
      round(random(0, 255)),
      round(random(0, 2555)),
      round(random(0, 255))
    );
    fireworks.push(
      new Firework(
        random(-W / 2, W / 2),
        H / 2,
        random(-200, 200),
        random(-25, -40),
        c
      )
    );

    // if (random(0, 1) >= 0.6)
    fireworks[i].loadSound(playSound);
  }

  noStroke();
  // translate(-100, -100, -100);
}

function playSound() {
  explosionSound.play();
  playFlag = !playFlag;
}

function createRandomFirework() {
  let c = color(
    round(random(0, 255)),
    round(random(0, 2555)),
    round(random(0, 255))
  );

  let firework = new Firework(
    random(-W / 2, W / 2),
    H / 2,
    random(-200, 200),
    random(-25, -40),
    c
  );
  fireworks.push(firework);
  // if (random(0, 1) >= 0.6)
  firework.loadSound(playSound);
}

function draw() {
  background(0);

  translate(00, H / 2, -1000);
  // rotateX(PI / 4);
  // rotateY(PI / 4);
  // rotateZ(PI / 4);
  rotateY(angle);

  angle += 0.02;

  if (mouseIsPressed) createRandomFirework();

  if (frameCount % 20 == 0) createRandomFirework();

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].show();

    if (fireworks[i].end) fireworks.splice(i, 1);
  }
}
