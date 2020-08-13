let W = 700;
const H = 700;

const STRONG = 255;
const WEAK = 50;

const MENU_SIZE = 24;

let pxD;

let edge;
let menu;

let algStep = -1;

let invertFlag = true;
let showMenu = true;

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
}

function mouseClicked() {
  if (!menu.choseOption(mouseX, mouseY)) return;

  switch (++algStep) {
    case 0: {
      if (!menu.items[algStep].enable) break;
      // Zero step just grayScale img
      edge.grayScaleImg();
      menu.items[algStep].complete = true;
      break;
    }
    case 1: {
      if (!menu.items[algStep].enable) break;

      console.log("Apply Gauss Filter...");
      edge.applyGaussFilter(2, 1);

      menu.items[algStep].complete = true;
      break;
    }
    case 2: {
      if (!menu.items[algStep].enable) break;

      console.log("Find the intensity gradient of the image -- Sobel Operator");
      edge.findIntensityGradient();

      menu.items[algStep].complete = true;
      break;
    }
    case 3: {
      if (!menu.items[algStep].enable) break;

      console.log("Apply non-maximum suppression");
      edge.applyNonMaximumSuppression();

      menu.items[algStep].complete = true;
      break;
    }
    case 4: {
      if (!menu.items[algStep].enable) break;

      console.log("Apply double threshold");
      edge.applyDoubleThreshold(0.08, 0.05);

      menu.items[algStep].complete = true;
      break;
    }
    case 5: {
      if (!menu.items[algStep].enable) break;

      console.log("Track edge by Hysteresis");
      edge.trackEdge();

      menu.items[algStep].complete = true;
      break;
    }
    default:
      algStep = -1;
      edge = new CannyAlg(); // Reset Changes

      menu.reset();
  }
  console.log("Yep");
}

function draw() {
  // background(0);

  fill(155);
  stroke(155);
  rect(10, 10, 30, 30);
  if (mouseX > 10 && mouseX < 40 && mouseY > 10 && mouseY < 40) {
    menu.showData(mouseX, mouseY);
    menu.show();
    return;
  }

  let { x, y, w } = menu.items[0];
  updatePixels(0, 0, 400, H);
  // edge.refresh(x, y - MENU_SIZE, w, MENU_SIZE);
  // rect(x, y - MENU_SIZE, w, MENU_SIZE);
}
