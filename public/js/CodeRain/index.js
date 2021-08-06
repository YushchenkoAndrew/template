// TODO: Remake for curr project
var MatrixCanvas = document.getElementById("canvas");
MatrixCanvas.width = 1200;
MatrixCanvas.height = 800;

var rainCanvas = MatrixCanvas.getContext("2d");
const fontSize = Math.floor(MatrixCanvas.width / 60);
var codeRain = new CodeRain(
  "I'm the creeper, catch me if you can!",
  fontSize,
  "Arial"
);
codeRain.startMatrix();

var rain = setInterval(() => codeRain.show(), 20);
