const W = 700;
const H = 700;
const MENU_SIZE = 24;

const step = 50;
const R = 5;

// Customs values
let showGrid = true;
let showValue = true;
let showBalls = true;
let mouseControl = false;

let metaballs = [];
let marchingSquares;

let menu;

function setup() {
  createCanvas(W, H);

  // for (let i = 0; i < 8; i++) metaballs.push(new Metaball());

  marchingSquares = new MarchingSquares();

  menu = new Menu("Show Grid", "Show Value", "Show Balls", "Mouse Control");
  menu.completeAll();
  menu.setOptions(
    () => {
      showGrid = menu.items[0].enable;
    },
    () => {
      showValue = menu.items[1].enable;
    },
    () => {
      showBalls = menu.items[2].enable;
    },
    () => {
      mouseControl = menu.items[3].enable;
    },
  );

  menu.items[3].enable = false;

  // console.log("Custom parameters:");
  // console.log(`\tshowGrid = ${!showGrid}`);
  // console.log(`\tshowValue = ${!showValue}`);
  // console.log(`\tshowBalls = ${!showBalls}`);
  // console.log(`\tmouseControl = ${!mouseControl}`);
}

function mouseClicked() {
  if (menu.IsEnable()) menu.enableOption(mouseX, mouseY, true);
}

function draw() {
  background(0);

  marchingSquares.show();

  if (mouseControl) marchingSquares.metaballs[0].pos = createVector(mouseX, mouseY);

  menu.show(true);
  // for (let i in metaballs) {
  // metaballs[i].show();
  // metaballs[i].update();
  // }
}
