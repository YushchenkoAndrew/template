class HilbertCurve {
  constructor(order = 1) {
    this.path = [];
    this.order = order;
    this.N = this.pow2(order);
    let size = this.N * this.N;

    console.log(size);

    this.step = W / this.N;
    this.offset = this.step / 2;

    // Initialize as a const Hilbert Curve First order
    this.FirstOrder = [createVector(0, 0), createVector(0, 1), createVector(1, 1), createVector(1, 0)];

    for (let i = 0; i < size; i++) this.path.push(this.hilbertFunc(i));
  }

  hilbertFunc(i) {
    let pos = this.FirstOrder[i & 3].copy();

    let offset = 1;

    for (let n = 1; n < this.order; n++) {
      i = i >>> 2;
      let x = pos.x;
      let y = pos.y;

      offset *= 2;

      switch (i & 3) {
        case 0: {
          pos = createVector(y, x);
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
          pos = createVector(offset - 1 - y, offset - 1 - x);
          pos = p5.Vector.add(pos, createVector(offset, 0));
          break;
        }
      }

      //   i = i >>> 2;
    }

    return pos;
  }

  pow2(i) {
    return 2 * (!(i - 1) ? 1 : this.pow2(i - 1));
  }

  show() {
    stroke(255);
    // strokeWeight(5);
    noFill();

    beginShape();

    for (let i in this.path) {
      let x = this.path[i].x * this.step + this.offset;
      let y = this.path[i].y * this.step + this.offset;
      vertex(x, y);

      //   text(i, x + 5, y - 5);
    }

    endShape();
  }
}
