class SphericalSystem {
  constructor() {
    this.plane = [];

    // Transformation Matrix
    this.T = matrix.diagonalMatrix(3);

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
    for (let i in this.points) this.points[i] = update(this.points[i]);

    // Save all Transformations
    this.T = matrix.mult(rotationFunction.call(matrix, angle), this.T);
    // this.T2 = rotationFunction.call(matrix, angle);

    function update(points) {
      for (let i in points) {
        points[i].setVector(matrix.mult(rotationMatrix, points[i].getVector()));
      }
      return points;
    }
  }

  drawLine(coords) {
    this.points[0] = [];

    const p = 10;
    let dx = 10 / 200;

    let x = -(coords.x - W / 2) * Math.sign(this.T[0][0]);
    let y = -(coords.y - H / 2) * Math.sign(this.T[1][1]);

    let temp = matrix.mult(this.T, [[x], [y], [1]]);

    x = temp[0][0];
    y = temp[1][0];

    // let teta = Math.atan((temp[2][0] / x) * 0.5) * 2;

    stroke(color(0, 0, 255));
    strokeWeight(5);
    line(0, 0, x, y);

    // let phi = 0;

    let phi = Math.atan(y / x);

    // for (let i = 0; i < 1 + dx; i += dx) {
    for (let j = 0; j < 1; j += dx) {
      x = p * Math.sin(j * 2 * PI) * Math.cos(phi);
      y = p * Math.sin(j * 2 * PI) * Math.sin(phi);
      let z = p * Math.cos(j * 2 * PI);

      this.points[0].push(new Vector4D(x, y, z));
    }

    for (let i in this.points[0]) {
      this.points[0][i].setVector(
        matrix.mult(this.T, this.points[0][i].getVector())
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
