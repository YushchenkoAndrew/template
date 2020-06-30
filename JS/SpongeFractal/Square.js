class Square {
  constructor(x, y, z, len) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.len = len;

    this.divide = false;
    this.squares = [];
  }

  subDivide() {
    let len = this.len / 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          let x = -this.len / 2 + len / 2 + this.x + i * len;
          let y = -this.len / 2 + len / 2 + this.y + j * len;
          let z = -this.len / 2 + len / 2 + this.z + k * len;

          if (i * j === 1 || j * k === 1 || i * k === 1) continue;

          this.squares.push(new Square(x, y, z, len));
        }
      }
    }

    this.divide = true;
  }

  update() {
    if (!this.divide) {
      this.subDivide();
      return;
    }

    for (let s of this.squares) s.update();
  }

  show() {
    if (!this.divide) {
      push();
      translate(this.x, this.y, this.z);

      // noFill();
      normalMaterial();
      stroke(255);

      box(this.len);
      pop();

      return;
    }

    for (let s of this.squares) s.show();
  }
}
