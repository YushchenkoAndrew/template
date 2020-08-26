const H = 700;
const W = 700;

var step = 10;

var timeStep = 50;
var nextGeneration = setInterval(() => game.nextGeneration(), timeStep);

var setTime = (step) => {
  timeStep = step;

  clearInterval(nextGeneration);
  nextGeneration = setInterval(() => game.nextGeneration(), step);
};

var freeze = () => (game.pause ^= 1);

var showPattern = () => {};
var handOfGod = (name) => (showPattern = game.handOfGod.bind(game, name));
var greatFlood = () => game.greatFlood();

let prev = {
  x: -1,
  y: -1,
  update() {
    if (!mouseIsPressed) {
      this.x = -1;
      this.y = -1;
      return;
    }

    let x = Math.floor(mouseX / step);
    let y = Math.floor(mouseY / step);

    if ((this.x == x && this.y == y) || mouseX < 0 || mouseX > W || mouseY < 0 || mouseY > H) return;

    this.x = x;
    this.y = y;
    return true;
  },
};

// Additional Data location for Terminal
HelpLoc = "../Terminal/Help.json";
FileStructureLoc = "../Terminal/FileStructure.json";

let game;

function setup() {
  createCanvas(W, H);

  game = new GameOfLife();
}

// function mousePressed() {
//   showPattern(true);
//  }

function draw() {
  background(255);

  if (prev.update(mouseX, mouseY)) game.createLive(prev);

  // if (!mouseIsPressed) prev.x = -1;

  showPattern();

  game.show();

  // game.showPattern();

  // game.nextGeneration();
}
