var matrixCode = document.getElementById("canvas");
matrixCode.width = 1200;
matrixCode.height = 800;

// Consts
var fontSize = 12;
let prevRatio = 0;

var matrixCanvas = matrixCode.getContext("2d");
matrixCanvas.font = `${fontSize}px Arial`;

let code = new CodeRain("I'm the creeper, catch me if you can!");
let codeRain = setInterval(() => code.draw(), 20);

function resizeCanvas() {
  let width =
    window.innerWidth < 1250
      ? document.getElementById("CanvasContainer0").offsetWidth / 1.2
      : 1200;
  let ratio = width / 1200;

  if (ratio == prevRatio) return;
  matrixCode.width = width;
  matrixCode.height = ratio * 700;

  prevRatio = ratio;
  code.resize(ratio);
  code.draw(ratio);
}

window.onload = () => resizeCanvas();
window.onbeforeunload = () => clearInterval(codeRain);
window.addEventListener("resize", () => resizeCanvas(), true);
