const body = new p5(Maze, "description");
const N = 700;
const step = 35;

console.log("Yesss");

function Maze(p) {
  let maze;
  var update = setInterval(() => maze.move(), 300);

  p.setup = function () {
    let canvas = p.createCanvas(700, 705);
    canvas.position(-700, 60);

    maze = new Generator();
  };

  p.draw = function () {
    p.background(0);

    // if (p.frameCount % 4 == 0) maze.move();
    maze.show();
  };
}
