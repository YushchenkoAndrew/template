class HigherDimension {
  constructor() {
    this.points = [];
    // this.projection = [];

    this.axis = [];
    // this.axisProjection = [];

    for (let i = 0; i < 16; i++) {
      let x = i & 1 ? -1 : 1;
      let y = i & 2 ? -1 : 1;
      let z = i & 4 ? -1 : 1;
      let w = i & 8 ? -1 : 1;
      this.points.push(new Vector4D(x, y, z, w));

      this.axis.push(new Vector4D(x * 50, y * 50, z * 50));
    }
  }

  rotate(rotationFunction, angle) {
    let rotationMatrix4D = rotationFunction.call(matrix, angle, 4);
    let rotationMatrix3D = rotationFunction.call(matrix, angle, 3);

    for (let i in this.points) {
      this.points[i].setVector(
        matrix.mult(rotationMatrix4D, this.points[i].getVector())
      );

      this.axis[i].setVector(
        matrix.mult(rotationMatrix3D, this.axis[i].getVector())
      );
    }
  }

  convertTo3D(points) {
    let projection = [];

    for (let i in points) {
      // Transformation Matrix
      let T = matrix.diagonalMatrix(4, (SIZE * R) / (R * 4 - points[i].w));
      T.splice(3, 1);

      if (!projection[i]) projection[i] = new Vector4D();

      projection[i].setVector(matrix.mult(T, points[i].getVector()));
    }

    return projection;
  }

  convertTo2D(points) {
    let projection = [];

    for (let i in points) {
      // Transformation matrix
      let T = matrix.diagonalMatrix(3, (SIZE * R) / (R * 4 - points[i].z));
      T.splice(2, 1);

      if (!projection[i]) projection[i] = new Vector4D();

      projection[i].setVector(matrix.mult(T, points[i].getVector()));
    }

    return projection;
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

  showAxis() {
    rect(-W / 2, -30, 200, 410, 20);

    // Divide area for 3D axis
    line(-W / 2, 190, -W / 2 + 200, 190);

    textSize(fontSize);
    fill(255);
    text("4D Coords", -W / 2 + 50, 0);
    text("3D Coords", -W / 2 + 50, 210);

    noStroke();

    let axis = this.convertTo2D(this.axis);

    let offset3D = { x: 100, y: 300 };
    let offset4D = { x: 100, y: 100 };

    drawLine(offset3D, axis[5], axis[1]);
    drawLine(offset3D, axis[5], axis[7]);
    drawLine(offset3D, axis[5], axis[4]);

    drawLine(offset4D, axis[5], axis[1]);
    drawLine(offset4D, axis[5], axis[7]);
    drawLine(offset4D, axis[5], axis[4]);

    drawPoint(
      axis[1],
      "z",
      color(255, 0, 0),
      offset3D,
      selectedAxis.z.isSelected
    );
    drawPoint(
      axis[7],
      "y",
      color(0, 255, 0),
      offset3D,
      selectedAxis.y.isSelected
    );
    drawPoint(
      axis[4],
      "x",
      color(0, 0, 255),
      offset3D,
      selectedAxis.x.isSelected
    );

    drawPoint(
      axis[1],
      "z",
      color(255, 0, 0),
      offset4D,
      selectedAxis.wz.isSelected
    );
    drawPoint(
      axis[7],
      "y",
      color(0, 255, 0),
      offset4D,
      selectedAxis.wy.isSelected
    );
    drawPoint(
      axis[4],
      "x",
      color(0, 0, 255),
      offset4D,
      selectedAxis.wx.isSelected
    );

    // line(...axis[5].coords2D(), ...axis[1].coords2D());

    function drawPoint(
      point,
      name,
      color = 255,
      offset = { x: 0, y: 0 },
      isSelected
    ) {
      let x = point.x - W / 2 + offset.x;
      let y = point.y + offset.y;

      fill(255);
      text(name, x + 10, y + 10);

      noStroke();
      fill(color);
      ellipse(x, y, isSelected ? 20 : 15);
    }

    function drawLine(offset, ...points) {
      strokeWeight(2);
      stroke(255);
      noFill();

      beginShape();

      for (let p of points) {
        let x = p.x - W / 2 + offset.x;
        let y = p.y + offset.y;

        vertex(x, y);
      }

      endShape();

      strokeWeight(1);
    }
  }

  show() {
    // this.projection = [];

    let resizedPoints = [];

    for (let i in this.points) {
      resizedPoints[i] = new Vector4D();

      resizedPoints[i].setVector(
        matrix.mult(matrix.diagonalMatrix(4, R), this.points[i].getVector())
      );
    }

    this.projection = this.convertTo2D(this.convertTo3D(resizedPoints));

    fill(255);

    for (let p of this.projection) {
      circle(...p.coords2D(), R / 10);
    }

    this.showBorder(this.projection);

    this.showAxis();
  }
}
