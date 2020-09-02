// Code Rain

var MatrixCanvas = document.getElementById("MatrixCanvas");
MatrixCanvas.width = window.innerWidth;
MatrixCanvas.height = window.innerHeight;

var rainCanvas = MatrixCanvas.getContext("2d");

var fontSize = Math.floor(MatrixCanvas.width / 60);
var codeRain = new CodeRain("Welcome to the warehouse for projects", fontSize, "Arial");
codeRain.startMatrix();

var rain = setInterval(() => codeRain.show(), 20);

// MazeGenerator

var MazeCanvas = document.getElementById("MazeGenerator");
var mazeCanvas = MazeCanvas.getContext("2d");

const step = 35;
MazeCanvas.width = window.innerWidth >= 700 ? 700 : Math.floor(window.innerWidth / step + 1) * step;

var generator = new Generator();

var move = setInterval(() => generator.move(), 100);
var show = setInterval(() => generator.show(), 20);

// Terminal

window.onload = () => $.terminal.active().exec("show HomePage/Text.txt");
