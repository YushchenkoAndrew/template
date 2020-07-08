class HigherDimension {
  constructor() {
    this.points = [];

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

  convertTo3D() {
    stroke(255);
    strokeWeight(32);

    for (let p of this.points) {
      let A = matrix.diagonalMatrix(4, 1 / (W / 2 - p.w));

      let vector = matrix.mult(A, p.getVector());

      point(vector[0][0] * R * 4, vector[1][0] * R * 4, vector[2][0] * R * 4);
    }

    strokeWeight(1);
  }

  showBorder() {
    fill(255, 10);
    stroke(255);

    for (let i = 0; i < 4; i++) {
      //   createSquare(this.points[i], this.points[(i + 1) % 4]);
      //   createSquare(this.points[i + 4], this.points[((i + 1) % 4) + 4]);
      //   createSquare(this.points[i], this.points[i + 4]);
      createSquare(this.points[i], this.points[i + 4]);
      createSquare(this.points[i], this.points[i + 4]);

      //   createSquare(this.points[(i % 2) + 4], this.points[(i % 4) + 4]);
      //   createSquare(this.points[i], this.points[i + 4]);
    }

    function createSquare(...points) {
      beginShape();

      for (let p of points) vertex(...p.coords());

      endShape();
    }
  }

  show() {
    stroke(255);
    strokeWeight(32);

    // for (let p of this.points) {
    //   point(p.x, p.y, p.z);
    // }

    strokeWeight(1);

    this.showBorder();
  }
}
