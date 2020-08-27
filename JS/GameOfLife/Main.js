const H = 700;
const W = 700;

var step = 10;

// mode == 0 ? => Normal Mode : GOD MODE
var mode = 0;

var timeStep = 50;
var nextGeneration = setInterval(() => game.nextGeneration(), timeStep);

var timeFlow = (step) => {
  timeStep = step;

  clearInterval(nextGeneration);
  nextGeneration = setInterval(() => game.nextGeneration(), step);
};

var freeze = () => (game.pause ^= 1);

var showPattern = () => {};
var handOfGod = (name) => {
  mode = 1;

  if (name == "exit") {
    $.terminal.active().echo(`${outputSign} You exit form [[;#f4d03f;]GOD MODE]`);
    $.terminal.active().echo(`${outputSign} You are into [[;#aed581;]Normal MODE]`);

    mode = 0;
    return;
  }
  $.terminal.active().echo(`${outputSign} You enter into [[;#f4d03f;]GOD MODE]`);
  showPattern = game.handOfGod.bind(game, name);
};
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

  $.terminal.active().echo(`${outputSign} You are into [[;#aed581;]Normal MODE]`);
  $.terminal.active().exec("show GameOfLife/Guid.txt 100");
}

function mousePressed() {
  if (mode) showPattern(true);
}

function draw() {
  background(255);

  if (!mode && prev.update(mouseX, mouseY)) game.createLive(prev);

  // if (!mouseIsPressed) prev.x = -1;

  if (mode) showPattern();

  game.show();

  // game.showPattern();

  // game.nextGeneration();
}
