const lineWidth = 2;
const textSize = 24;
const textStyle = "Comic Sans MS";

var grid = document.getElementById("Handwriting");
grid.width = 900;
grid.height = 700;

var canvas = grid.getContext("2d");
canvas.lineWidth = lineWidth;

let handwriting = new Handwriting();

grid.addEventListener("mousedown", (event) => handwriting.setMouseFlag(true) || handwriting.setPixel(event), false);
grid.addEventListener("mousemove", (event) => handwriting.setPixel(event), false);
grid.addEventListener("mouseup", (event) => handwriting.setMouseFlag(false), false);

setInterval(() => handwriting.draw(), 20);
