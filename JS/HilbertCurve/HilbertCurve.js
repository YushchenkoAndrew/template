// Source:  https://en.wikipedia.org/wiki/Hilbert_curve
// Source:  https://marcin-chwedczuk.github.io/iterative-algorithm-for-drawing-hilbert-curve

class HilbertCurve {
  constructor(order = 1) {
    this.path = [];
    this.setOrder(order);

    // Initialize as a const Hilbert Curve First order
    this.FirstOrder = [createVector(0, 0), createVector(0, 1), createVector(1, 1), createVector(1, 0)];

    this.index = 0;

    // for (let i = 0; i < this.size; i++) this.path.push(this.hilbertFunc(i));
  }

  setOrder(order) {
    this.order = order;
    this.N = pow2(order);
    this.size = this.N * this.N;

    this.step = W / this.N;
    this.offset = this.step / 2;

    this.path = [...flipPath(this.path)];

    function pow2(i) {
      return 2 * (!(i - 1) ? 1 : pow2(i - 1));
    }

    function flipPath(path) {
      let newPath = [];

      for (let i in path) newPath.push(createVector(path[i].y, path[i].x));

      return newPath;
    }
  }

  hilbertFunc(i) {
    let pos = this.FirstOrder[i & 3].copy();

    let offset = 1;

    for (let n = 1; n < this.order; n++) {
      i = i >> 2;

      offset *= 2;

      switch (i & 3) {
        case 0: {
          pos = createVector(pos.y, pos.x);
          break;
        }

        case 1: {
          pos = p5.Vector.add(pos, createVector(0, offset));
          break;
        }

        case 2: {
          pos = p5.Vector.add(pos, createVector(offset, offset));
          break;
        }

        case 3: {
          pos = createVector(offset - 1 - pos.y, offset - 1 - pos.x);
          pos = p5.Vector.add(pos, createVector(offset, 0));
          break;
        }
      }
    }

    return pos;
  }

  update() {
    if (this.path.length == this.size) return true;

    this.path.push(this.hilbertFunc(this.index++));
  }

  show(showNum = 0) {
    let coords = getCoords.bind(this);

    noFill();

    for (let i = 1; i < this.path.length; i++) {
      let color = ((i / this.size) * PI) / 2;
      stroke(color, 255, 255);

      line(...coords(i - 1), ...coords(i));

      if (showNum) {
        let pos = coords(i - 1);
        text(i, pos[0] + 5, pos[1] - 10);
      }
    }

    function getCoords(i) {
      let x = this.path[i].x * this.step + this.offset;
      let y = this.path[i].y * this.step + this.offset;

      return [x, y];
    }
  }
}
