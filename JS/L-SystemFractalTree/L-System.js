// Source:  https://en.wikipedia.org/wiki/L-system

// Interesting Source:
//          https://nb.paulbutler.org/l-systems/
//          http://algorithmicbotany.org/papers/#abop
//          http://algorithmicbotany.org/papers/abop/abop-ch1.pdf
//          http://paulbourke.net/fractals/lsys/

class L_System {
  constructor(axiom, rules) {
    // Default axiom and rules
    this.axiom = axiom || "A";
    this.rules = rules || { A: "AB", B: "A" };

    this.sentence = this.axiom;

    // Save and restore position
    this.stack = [];

    this.pos = createVector(0, 0);
    this.step = createVector(0, 50);
    this.shrink;

    this.angle;
  }

  setSystem(axiom, rules) {
    this.axiom = axiom;
    this.rules = rules;

    this.sentence = axiom;
  }

  /**
   *    Set up Turtle Engine
   *
   * @param {*} pos     --  Vector of start pos
   * @param {*} step    --  Vector of movement
   * @param {*} angle   --  It's object which have {r: 'angle', l: 'angle'}. Angle in radian
   * @param {*} shrink  --  A variable for shrinking step with each iteration range(0, 1). Default value 0.5
   * @memberof L_System
   */
  setTurtleEngine(pos, step, angle, shrink) {
    this.pos = pos.copy();
    this.step = step.copy();
    this.shrink = shrink || 0.5;

    this.angle = {};
    Object.setPrototypeOf(this.angle, angle);
  }

  update() {
    if (this.shrink) this.step.mult(this.shrink);

    let newSentence = "";

    for (let i in this.sentence) {
      newSentence += this.rules[this.sentence[i]] || this.sentence[i];
    }

    this.sentence = newSentence;
    // console.log(this.sentence);
  }

  //  Show Turtle Engine
  show() {
    let pos = this.pos.copy();
    let step = this.step.copy();

    stroke(255);
    noFill();

    for (let i in this.sentence) {
      switch (this.sentence[i]) {
        case "[": {
          this.stack.push({ pos: pos.copy(), step: step.copy() });
          continue;
        }
        case "]": {
          let restore = this.stack.pop();

          pos = restore.pos;
          step = restore.step;
          continue;
        }
        case "+": {
          step.rotate(this.angle.r);
          continue;
        }
        case "-": {
          step.rotate(this.angle.l);
          continue;
        }
        case "F": {
          let prev = pos.copy();

          pos.add(step);

          line(prev.x, prev.y, pos.x, pos.y);
        }
      }
    }
  }
}
