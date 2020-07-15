class EuclideanSystem {
  constructor() {
    this.plane = [];

    this.dx = 20 / 200;

    // Transformation Matrix
    this.T;

    this.points = [];
    this.index = 0;
  }

  createPlane() {
    const step = 20;

    let dx = step / 200;
    let dy = step / 200;

    this.width = 2 / dx;
    this.height = 2 / dy;

    for (let i = -1; i < 1; i += dy) {
      for (let j = -1; j < 1; j += dx) {
        this.plane.push(new Vector4D(j * 10, i * 10, 0));
      }
    }

    if (Math.round(height / 10 / step)) {
      this.height++;

      for (let j = -1; j < 1; j += dx)
        this.plane.push(new Vector4D(j * 10, 10, 0));
    }

    console.log(this.plane);

    return { w: this.width, h: this.height };
  }

  rotate(rotationFunction, angle) {
    let rotationMatrix = rotationFunction.call(matrix, angle, 3);

    this.plane = update(this.plane);
    for (let i in this.points) this.points[i] = update(this.points[i]);

    // Save all Transformations
    if (!this.T) this.T = rotationFunction.call(matrix, angle);
    else this.T = matrix.mult(rotationFunction.call(matrix, angle), this.T);

    function update(points) {
      for (let i in points) {
        points[i].setVector(matrix.mult(rotationMatrix, points[i].getVector()));
      }
      return points;
    }
  }

  drawLine(coords) {
    const step = 20 / 200;

    let x = ((coords.x - W / 2) / R) * 12.5;
    let y = ((coords.y - H / 2) / R) * 12.5;

    let temp = new Vector4D();

    temp.setVector(matrix.mult(this.T, [[x], [y], [1]]));

    // console.log(temp);

    this.points[this.index] = [];

    let j = 0;

    for (let i = -1; i < 1; i += this.dx) {
      this.points[this.index].push(new Vector4D(temp.x, i * 10, 0));

      // for (let i in this.points[this.0
      this.points[this.index][j].setVector(
        matrix.mult(this.T, this.points[this.index][j++].getVector())
      );
    }

    return this.points;
  }

  resize(points) {
    let resized = [];

    for (let i in points) {
      resized[i] = new Vector4D();

      resized[i].setVector(
        matrix.mult(matrix.diagonalMatrix(3, R / 10), points[i].getVector())
      );
    }

    return resized;
  }
}
