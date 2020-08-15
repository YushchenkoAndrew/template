let W = 700;
const H = 700;

const STRONG = 255;
const WEAK = 50;

const MENU_SIZE = 24;

let pxD;

let edge;
let menu;

let invertFlag = true;

let img;

function preload() {
  img = loadImage("test3.jpg");
}

function setup() {
  W = Math.floor((H / img.height) * img.width);

  createCanvas(W, H);
  img.resize(W, H);
  pxD = pixelDensity() * pixelDensity();

  edge = new CannyAlg();
  menu = new Menu("Gray Scale", "Gauss Filter", "Intensity Gradient", "Non-Maximum Suppression", "Double Threshold", "Track Edge");
  menu.setOptions(
    edge.grayScaleImg.bind(edge),
    edge.applyGaussFilter.bind(edge),
    edge.findIntensityGradient.bind(edge),
    edge.applyNonMaximumSuppression.bind(edge),
    edge.applyDoubleThreshold.bind(edge),
    edge.trackEdge.bind(edge),
    edge.reset.bind(edge),
  );

  menu.setAdditionalData(1, { value: [2, 1], step: 0.1 });
  menu.setAdditionalData(4, { value: [0.08, 0.05], step: 0.01 });
}

function mouseClicked() {
  if (menu.IsEnable() && (!menu.enableOption(mouseX, mouseY) || !menu.changeItemData(mouseX, mouseY))) return;
  menu.runNextOption();
}

function doubleClicked() {
  // invertFlag ^= true;
}

function draw() {
  // background(0);

  menu.show();
}
