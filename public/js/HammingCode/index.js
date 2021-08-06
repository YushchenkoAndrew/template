// Default values
const textSize = { head: 35, desc: 24 };
const textStyle = "Arial";
const lineWidth = 2;
const step = 40;

let prevRatio = 1.0;

// Code

var hammingCode = document.getElementById("canvas");
hammingCode.width = 900;
hammingCode.height = 700;

var hammingCanvas = hammingCode.getContext("2d");
hammingCanvas.font = `${textSize["desc"]}px ${textStyle}`;
hammingCanvas.lineWidth = lineWidth;

let code = new HammingCode();
code.draw();

hammingCode.addEventListener(
  "mousedown",
  (event) => code.changeData(event) || resizeCanvas(),
  false
);

// code.draw();

function resizeCanvas() {
  let width =
    window.innerWidth < 950
      ? document.getElementById("CanvasContainer0").offsetWidth / 1.2
      : 900;
  let ratio = width / 900;

  if (ratio == prevRatio) return;
  hammingCode.width = width;
  hammingCode.height = ratio * 700;

  code.step = ratio * step;
  hammingCanvas.font = `${ratio * textSize}px ${textStyle}`;
  for (let key in code.textSize) code.textSize[key] = ratio * textSize[key];

  code.draw(ratio);
}

window.onload = () => resizeCanvas();
window.addEventListener("resize", () => resizeCanvas(), true);
