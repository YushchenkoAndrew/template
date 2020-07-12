class SphericalSystem {
  constructor() {
    this.plane = [];

    this.points = [];
  }

  createPlane() {
    const p = 10;
    let dx = 10 / 200;

    this.width = 1 / dx;
    this.height = 1 / dx;

    for (let i = 0; i < 1 + dx; i += dx) {
      for (let j = 0; j < 1; j += dx) {
        let x = p * Math.sin(i * PI) * Math.cos(j * 2 * PI);
        let y = p * Math.sin(i * PI) * Math.sin(j * 2 * PI);
        let z = p * Math.cos(i * PI);

        this.plane.push(new Vector4D(x, y, z));
      }
    }

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

  drawLine() {
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
