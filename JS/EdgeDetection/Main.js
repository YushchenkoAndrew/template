let W = 700;
const H = 700;

const STRONG = 255;
const WEAK = 50;

let pxD;

let edge;
let algStep = 0;

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
}

function mouseClicked() {
  switch (algStep++) {
    case 0: {
      // Zero step just grayScale img
      edge.grayScaleImg();
      break;
    }

    case 1: {
      console.log("Apply Gause Filter...");
      edge.applyGaussFilter(2, 1);
      break;
    }

    case 2: {
      console.log("Find the intensity gradient of the image -- Sobel Operator");
      edge.findIntensityGradient();
      break;
    }

    case 3: {
      console.log("Apply non-maximum suppression");
      edge.applyNonMaximumSuppression();
      break;
    }

    case 4: {
      console.log("Apply double threshold");
      edge.applyDoubleThreshold(0.08, 0.05);
      break;
    }

    case 5: {
      console.log("Track edge by Hysteresis");
      edge.trackEdge();
      break;
    }
    default:
      algStep = 0;
      edge = new CannyAlg(); // Reset Changes
  }
  console.log("Yep");
}

function draw() {
  //   background(0);
}
