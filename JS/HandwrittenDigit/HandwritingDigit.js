class Handwriting {
  constructor() {
    this.grid = [];
    this.STEP = 20;
    this.SIZE = 28;
    this.OFFSET = { x: 160, y: 110 };
    this.BLUR = 2;
    // this.BLUR_MATRIX = this.getGaussianMatrix(5, 6);
    // console.log(this.BLUR_MATRIX);

    this.mousePressed = false;
    this.prevCoords = { x: -1, y: -1 };

    for (let i = 0; i < this.SIZE; i++) {
      this.grid.push([]);
      // for (let j = 0; j < this.SIZE; j++) this.grid[i][j] = Math.round(Math.random() * 255);
      for (let j = 0; j < this.SIZE; j++) this.grid[i][j] = 0;
    }
  }

  gaussianBlur({ x, y }) {
    let result = [];
    x -= Math.floor(this.BLUR_MATRIX.length / 2);
    y -= Math.floor(this.BLUR_MATRIX.length / 2);

    for (let i in this.BLUR_MATRIX) {
      result.push([]);

      for (let j in this.BLUR_MATRIX) {
        result[i][j] = 0;

        for (let k in this.BLUR_MATRIX) {
          result[i][j] += this.grid[y + Number(i)][x + Number(j)] * this.BLUR_MATRIX[i][j];
        }
      }
    }

    console.log(result);

    for (let i in result) {
      for (let j in result) {
        this.grid[Number(i) + y][Number(j) + x] = result[i][j];
      }
    }
  }

  setPixel({ x, y }) {
    if (!this.mousePressed) return;

    let rect = grid.getBoundingClientRect();

    x = Math.floor((x - this.OFFSET.x) / this.STEP);
    y = Math.floor((y - this.OFFSET.y - rect.y) / this.STEP);

    if (x == this.prevCoords.x && y == this.prevCoords.y) return;

    if (y >= 0 && x >= 0 && y - this.SIZE < 0 && x - this.SIZE < 0) {
      console.log(`Mouse Clicked!!! x = ${x}, y = ${y}`);

      this.grid[y][x] += 180;

      for (let i = -this.BLUR; i < this.BLUR + 1; i++) {
        for (let j = -this.BLUR; j < this.BLUR + 1; j++) {
          // if (!i && !j) continue;

          this.grid[y + i][x + j] += 5 / (i * i + j * j + 1);

          this.grid[y + i][x + j] = this.grid[y + i][x + j] > 200 ? 255 : this.grid[y + i][x + j];
        }
      }

      this.prevCoords = { x, y };
      // this.gaussianBlur({ x, y });
      return;
    }
  }

  getGaussianMatrix(size, phi) {
    let matrix = [];
    // let sqrPhi = 2 * phi * phi;
    // let rate = 1 / (Math.PI * sqrPhi);
    // let range = Math.floor(size / 2);

    for (let i = 0; i < size; i++) {
      // let sqrY = i * i;
      matrix.push([]);

      for (let j = 0; j < size; j++) {
        // let sqrX = j * j;

        // matrix[i + range].push(rate * Math.exp(-((sqrX + sqrY) / sqrPhi)));
        matrix[i].push(1 / phi);
      }
    }

    return matrix;
  }

  setMouseFlag(flag) {
    this.mousePressed = flag;
  }

  drawGrid({ x, y }) {
    canvas.strokeStyle = "#AAA";

    let len = this.STEP * this.SIZE;

    for (let i in this.grid) {
      const step = i * this.STEP;

      // Create grid
      this.drawLine(x, y + step, x + len, y + step);
      this.drawLine(x + step, y, x + step, y + len);

      for (let j in this.grid[i]) {
        canvas.fillStyle = "#" + Math.floor(this.grid[i][j]).toString(16).repeat(3);
        canvas.fillRect(x + j * this.STEP, y + step, this.STEP - lineWidth, this.STEP - lineWidth);
      }
    }

    // Draw two last lines
    this.drawLine(x, y + len, x + len, y + len);
    this.drawLine(x + len, y, x + len, y + len);
  }

  drawLine(...pos) {
    canvas.beginPath();
    canvas.moveTo(...pos.slice(0, 2));
    canvas.lineTo(...pos.slice(2));
    canvas.stroke();
  }

  draw() {
    // Reset Canvas
    canvas.fillStyle = "#000000";
    canvas.fillRect(0, 0, grid.width, grid.height);

    this.drawGrid(this.OFFSET);
  }
}
