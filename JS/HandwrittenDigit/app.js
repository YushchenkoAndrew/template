const lineWidth = 2;

var grid = document.getElementById("Handwriting");
grid.width = 900;
grid.height = 700;

var canvas = grid.getContext("2d");
// hammingCanvas.font = `${textSize}px ${textStyle}`;
canvas.lineWidth = lineWidth;

let handwriting = new Handwriting();

grid.addEventListener("mousedown", (event) => handwriting.setMouseFlag(true), false);
grid.addEventListener("mousemove", (event) => handwriting.setPixel(event), false);
grid.addEventListener("mouseup", (event) => handwriting.setMouseFlag(false), false);

setInterval(() => handwriting.draw(), 100);

console.log("Hello world");
