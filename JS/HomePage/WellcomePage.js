const header = new p5(codeRain, "header");
const W = window.innerWidth - 17;
const H = window.innerHeight;

function codeRain(p) {
  let rain;

  p.setup = function () {
    let canvas = p.createCanvas(W, H);
    canvas.position(0, 0);

    rain = new CodeRain("Welcome to the warehouse for projects", 24);
    rain.startMatrix();
  };

  p.draw = function () {
    p.background(0, 100);

    rain.show();
  };
}
