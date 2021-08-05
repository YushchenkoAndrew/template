// Default values
const textSize = 24;
const textStyle = "Arial";
const lineWidth = 2;

// Code

var hammingCode = document.getElementById("canvas");
hammingCode.width = 900;
hammingCode.height = 700;

var hammingCanvas = hammingCode.getContext("2d");
hammingCanvas.font = `${textSize}px ${textStyle}`;
hammingCanvas.lineWidth = lineWidth;

let code = new HammingCode();
code.draw();

hammingCode.addEventListener(
  "mousedown",
  (event) => code.changeData(event),
  false
);

// code.draw();

window.addEventListener(
  "resize",
  (event) => {
    // TODO: Create resize canvas
  },
  true
);
