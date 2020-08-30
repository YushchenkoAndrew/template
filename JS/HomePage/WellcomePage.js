var matrixCanvas = document.getElementById("MatrixCanvas");
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

var mCanvas = matrixCanvas.getContext("2d");

var fontSize = Math.floor(matrixCanvas.width / 60);
var codeRain = new CodeRain("Welcome to the warehouse for projects", fontSize, "Arial");
codeRain.startMatrix();

var rain = setInterval(() => codeRain.show(), 20);
