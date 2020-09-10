const W = 700;
const H = 700;

let fractal;
let index = 0;

let details = 0;

function setup() {
  createCanvas(W, H);

  fractal = new L_System();

  fractal.setSystem("F", { F: "FF+[+F-F-F]-[-F+F+F]" });
  // fractal.setSystem("X", { X: "F+[[X]-X]-F[-FX]+X", F: "FF" });
  // fractal.setSystem("F", { F: "FF[++F][-FF]" });
  // fractal.setSystem("A", { F: "FF", A: "F[+AF-[A]--A][---A]" });
  // fractal.setSystem("X", { X: "F[+X]F[-X]+X", F: "FF" });
  // fractal.setSystem("X", { X: "F[+X][-X]FX", F: "FF" });
  // fractal.setSystem("VZFFF", { V: "[+++W][---W]YV", W: "+X[-W]Z", X: "-W[+X]Z", Y: "YZ", Z: "[-FFF][+FFF]F" });
  // fractal.setSystem("F", { X: "+FY", Y: "-FX", F: "FF-[XY]+[XY]" });

  // fractal.setSystem("F-F-F-F", { F: "FF-F-F-F-F-F+F" });
  // fractal.setSystem("F-F-F-F", { F: "F-FF--F-F" });
  // fractal.setSystem("F-F-F-F", { F: "FF-F--F-F" });
  // fractal.setSystem("YF", { X: "YF+XF+Y", Y: "XF-YF-X" });
  // fractal.setSystem("FX", { X: "X+YF+", Y: "-FX-Y" });
  // fractal.setSystem("XF", { X: "X+YF++YF-FX--FXFX-YF+", Y: "-FX+YFYF++YF+FX--FX-Y" });

  let start = createVector(W / 2, H);
  let step = createVector(0, -200);
  let angle = { r: PI / 8, l: -PI / 8 };
  // let angle = { r: PI / 3, l: -PI / 3 };
  // let angle = { r: PI / 2, l: -PI / 2 };

  fractal.setTurtleEngine(start, step, angle);
}

function mouseClicked() {
  if (++details < 5) fractal.update();
}

function doubleClicked() {
  let start = createVector(W / 2, H);
  let step = createVector(0, -200);
  let angle = { r: PI / 8, l: -PI / 8 };

  console.log(index + 1);
  details = 0;

  switch (++index) {
    case 0: {
      fractal.setSystem("F", { F: "FF+[+F-F-F]-[-F+F+F]" });
      fractal.setTurtleEngine(start, step, angle);
      return;
    }
    case 1: {
      fractal.setSystem("X", { X: "F+[[X]-X]-F[-FX]+X", F: "FF" });
      fractal.setTurtleEngine(start, step, angle);
      return;
    }
    case 2: {
      fractal.setSystem("F", { F: "FF[++F][-FF]" });
      fractal.setTurtleEngine(start, step, angle);
      return;
    }
    case 3: {
      step = createVector(0, -300);
      fractal.setSystem("A", { F: "FF", A: "F[+AF-[A]--A][---A]" });
      fractal.setTurtleEngine(start, step, angle);
      return;
    }
    case 4: {
      step = createVector(0, -300);
      fractal.setSystem("X", { X: "F[+X]F[-X]+X", F: "FF" });
      fractal.setTurtleEngine(start, step, angle);
      return;
    }
    case 5: {
      step = createVector(0, -300);
      fractal.setSystem("X", { X: "F[+X][-X]FX", F: "FF" });
      fractal.setTurtleEngine(start, step, angle);
      return;
    }
    case 6: {
      step = createVector(0, -20);
      fractal.setSystem("VZFFF", { V: "[+++W][---W]YV", W: "+X[-W]Z", X: "-W[+X]Z", Y: "YZ", Z: "[-FFF][+FFF]F" });
      fractal.setTurtleEngine(start, step, angle, 1);
      return;
    }
    default: {
      step = createVector(0, -300);
      fractal.setSystem("F", { X: "+FY", Y: "-FX", F: "FF-[XY]+[XY]" });
      fractal.setTurtleEngine(start, step, angle);

      index = -1;
    }
  }
}

function draw() {
  background(0);

  fractal.show();
}
