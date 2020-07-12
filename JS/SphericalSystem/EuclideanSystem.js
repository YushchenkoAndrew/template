class EuclideanSystem {
  constructor() {
    this.plane = [];

    this.points = [];
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
    this.points = update(this.points);

    function update(points) {
      for (let i in points) {
        points[i].setVector(matrix.mult(rotationMatrix, points[i].getVector()));
      }
      return points;
    }
  }

  drawLine(coords) {
    // this.points = [];

    const step = 20 / 200;

    for (let i = -1; i < 1; i += step)
      this.points.push(new Vector4D(0, i * 10, 0));

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
