// Source:  http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/

class MarchingSquares {
  constructor() {
    this.grid = [];

    this.metaballs = [];

    for (let i = 0; i < 8; i++) this.metaballs.push(new Metaball());

    for (let i = 0; i < H / step + 1; i++) {
      this.grid.push([]);

      for (let j = 0; j < W / step + 1; j++) {
        this.grid[i][j] = this.func(createVector(j * step, i * step));
      }
    }
  }

  func(pos) {
    let f = 0;

    for (let i in this.metaballs) {
      let diff = p5.Vector.sub(pos, this.metaballs[i].pos);
      f += (this.metaballs[i].r * this.metaballs[i].r) / (diff.x * diff.x + diff.y * diff.y);
    }

    return f;
  }

  drawWall(index, i, j, x, y) {
    stroke(0, 255, 0);
    switch (index) {
      case 14:
      case 1: {
        // line(x, y + step / 2, x + step / 2, y + step);
        let { x_ } = this.getInterpolation({ x: x, y: y + step, f: this.grid[i + 1][j] }, { x: x + step, y: y + step, f: this.grid[i + 1][j + 1] });
        let { y_ } = this.getInterpolation({ x: x, y: y, f: this.grid[i][j] }, { x: x, y: y + step, f: this.grid[i + 1][j] });
        line(x, y_, x_, y + step);
        break;
      }

      case 13:
      case 2: {
        // line(x + step / 2, y + step, x + step, y + step / 2);
        let { x_ } = this.getInterpolation({ x: x, y: y + step, f: this.grid[i + 1][j] }, { x: x + step, y: y + step, f: this.grid[i + 1][j + 1] });
        let { y_ } = this.getInterpolation({ x: x + step, y: y, f: this.grid[i][j + 1] }, { x: x + step, y: y + step, f: this.grid[i + 1][j + 1] });
        line(x_, y + step, x + step, y_);
        break;
      }

      case 12:
      case 3: {
        // line(x, y + step / 2, x + step, y + step / 2);
        let { y_ } = this.getInterpolation({ x: x, y: y, f: this.grid[i][j] }, { x: x, y: y + step, f: this.grid[i + 1][j] });
        let point = this.getInterpolation({ x: x + step, y: y, f: this.grid[i][j + 1] }, { x: x + step, y: y + step, f: this.grid[i + 1][j + 1] });
        line(x, y_, x + step, point.y_);
        break;
      }

      case 11:
      case 4: {
        // line(x + step / 2, i * step, x + step, y + step / 2);
        let { x_ } = this.getInterpolation({ x: x, y: y, f: this.grid[i][j] }, { x: x + step, y: y, f: this.grid[i][j + 1] });
        let { y_ } = this.getInterpolation({ x: x + step, y: y, f: this.grid[i][j + 1] }, { x: x + step, y: y + step, f: this.grid[i + 1][j + 1] });
        line(x_, y, x + step, y_);
        break;
      }

      case 5: {
        // line(x + step / 2, y + step, x + step, y + step / 2);
        // line(x, y + step / 2, x + step / 2, i * step);
        this.drawWall(2, i, j, x, y);
        this.drawWall(7, i, j, x, y);
        break;
      }

      case 9:
      case 6: {
        // line(x + step / 2, i * step, x + step / 2, y + step);
        let { x_ } = this.getInterpolation({ x: x, y: y, f: this.grid[i][j] }, { x: x + step, y: y, f: this.grid[i][j + 1] });
        let point = this.getInterpolation({ x: x, y: y + step, f: this.grid[i + 1][j] }, { x: x + step, y: y + step, f: this.grid[i + 1][j + 1] });
        line(x_, y, point.x_, y + step);
        break;
      }

      case 8:
      case 7: {
        // line(x, y + step / 2, x + step / 2, i * step);
        let { x_ } = this.getInterpolation({ x: x, y: y, f: this.grid[i][j] }, { x: x + step, y: y, f: this.grid[i][j + 1] });
        let { y_ } = this.getInterpolation({ x: x, y: y, f: this.grid[i][j] }, { x: x, y: y + step, f: this.grid[i + 1][j] });
        line(x, y_, x_, y);
        break;
      }

      case 10: {
        // line(x, y + step / 2, x + step / 2, y + step);
        // line(x + step / 2, i * step, x + step, y + step / 2);
        this.drawWall(1, i, j, x, y);
        this.drawWall(4, i, j, x, y);
        break;
      }
    }
  }

  //   a and b it's an object that have {x: 0, y: 0, f: 0}
  getInterpolation(a, b) {
    let c = { x_: 0, y_: 0 };

    c.x_ = a.x + ((b.x - a.x) * (1 - a.f)) / (b.f - a.f);
    c.y_ = a.y + ((b.y - a.y) * (1 - a.f)) / (b.f - a.f);

    return c;
  }

  getIndex(i, j) {
    let index = this.grid[i + 1][j] > 1 ? 1 : 0;
    index |= (this.grid[i + 1][j + 1] > 1) << 1;
    index |= (this.grid[i][j + 1] > 1) << 2;
    index |= (this.grid[i][j] > 1) << 3;

    return index;
  }

  show() {
    fill(125);

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let x = j * step;
        let y = i * step;

        if (i < this.grid.length - 1 && j < this.grid[i].length - 1) {
          stroke(125);

          if (showGrid) {
            // Draw Grid
            line(x, y, x + step, y);
            line(x, y, x, y + step);
          }

          this.drawWall(this.getIndex(i, j), i, j, x, y);
        }

        fill(this.grid[i][j] < 1 ? 125 : color(0, 255, 0));
        noStroke();

        if (showGrid) circle(x, y, R);
        if (showValue) text(this.grid[i][j].toFixed(2), x + 5, y - 5);
        this.grid[i][j] = this.func(createVector(j * step, i * step));
      }
    }

    // Show Balls
    for (let i in this.metaballs) {
      this.metaballs[i].update();
      if (showBalls) this.metaballs[i].show();
    }
  }
}
