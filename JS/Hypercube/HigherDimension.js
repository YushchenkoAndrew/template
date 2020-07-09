class HigherDimension {
  constructor() {
    this.points = [];
    this.projection = [];

    for (let i = 0; i < 16; i++) {
      let x = R * (i & 1 ? -1 : 1);
      let y = R * (i & 2 ? -1 : 1);
      let z = R * (i & 4 ? -1 : 1);
      let w = R * (i & 8 ? -1 : 1);
      this.points.push(new Vector4D(x, y, z, w));
    }
  }

  rotate(rotationMatrix) {
    for (let i in this.points) {
      this.points[i].setVector(
        matrix.mult(rotationMatrix, this.points[i].getVector())
      );
    }
  }

  convertTo3D(points) {
    for (let i in points) {
      // Transformation Matrix
      let T = matrix.diagonalMatrix(4, (SIZE * R) / (R * 4 - points[i].w));
      T.splice(3, 1);

      if (!this.projection[i]) this.projection[i] = new Vector4D();

      this.projection[i].setVector(matrix.mult(T, points[i].getVector()));
    }
  }

  convertTo2D(points) {
    for (let i in points) {
      // Transformation matrix
      let T = matrix.diagonalMatrix(3, (SIZE * R) / (R * 4 - points[i].z));
      T.splice(2, 1);

      if (!this.projection[i]) this.projection[i] = new Vector4D();

      this.projection[i].setVector(matrix.mult(T, points[i].getVector()));
    }
  }

  showBorder(points) {
    drawCube(points.slice(0, 8));
    drawCube(points.slice(8));

    drawCube([...points.slice(0, 4), ...points.slice(8, 12)]);
    drawCube([...points.slice(4, 8), ...points.slice(12)]);

    drawCube([...getEven(0, 16)]);
    drawCube([...getEven(0, 16, 1)]);

    drawCube([...getEven(0, 16, 0, 4), ...getEven(0, 16, 1, 4)]);
    drawCube([...getEven(0, 16, 2, 4), ...getEven(0, 16, 3, 4)]);

    function getEven(start, end, offset = 0, step = 2) {
      let result = [];

      for (let i = start; i < end; i += step) result.push(points[i + offset]);

      return result;
    }

    function drawCube(points) {
      drawSquare(points[0], points[1], points[3], points[2]);
      drawSquare(points[0], points[1], points[5], points[4]);

      drawSquare(points[4], points[5], points[7], points[6]);
      drawSquare(points[2], points[3], points[7], points[6]);

      drawSquare(points[1], points[3], points[7], points[5]);
      drawSquare(points[0], points[2], points[6], points[4]);
    }

    function drawSquare(...point) {
      stroke(255);
      fill(255, 15);
      beginShape();

      for (let p of point) vertex(...p.coords2D());

      endShape(CLOSE);
    }
  }

  show() {
    this.projection = [];
    this.convertTo3D(this.points);
    this.convertTo2D(this.projection);

    fill(255);

    for (let p of this.projection) {
      circle(...p.coords2D(), 10);
    }

    this.showBorder(this.projection);
  }
}
