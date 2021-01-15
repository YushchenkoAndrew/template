class Handwriting {
  constructor() {
    this.STEP = 20;
    this.SIZE = 28;
    this.OFFSET = { grid: { x: 160, y: 110 }, box: { x: 120, y: 35 } };
    this.BLUR = 2;
    this.BRIGHTNESS = { value: 50, k: 0.3 };

    this.mousePressed = false;
    this.prevCoords = { x: -1, y: -1 };
    this.grid = [];
    this.box = [];

    for (let i = 0; i < this.SIZE; i++) {
      this.grid.push([]);
      // for (let j = 0; j < this.SIZE; j++) this.grid[i][j] = Math.round(Math.random() * 255);
      for (let j = 0; j < this.SIZE; j++) this.grid[i][j] = 0;
    }

    for (let i = 0; i < 10; i++) {
      this.box[i] = Math.random();
    }
  }

  makeBlur(curr, prev) {
    const { value, k } = this.BRIGHTNESS;
    let dir = { x: (curr.x - prev.x) * k, y: (curr.y - prev.y) * k };

    for (let i = -this.BLUR; i < this.BLUR + 1; i++) {
      let y = curr.y + i;
      if (y < 0 || y >= this.grid.length) continue;

      for (let j = -this.BLUR; j < this.BLUR + 1; j++) {
        let x = curr.x + j;
        if ((!i && !j) || x + j < 0 || x + j >= this.grid[y].length) continue;

        this.grid[y][x] += Math.floor(value / ((i - dir.y) * (i - dir.y) + (j - dir.x) * (j - dir.x)));
        this.grid[y][x] = this.grid[y][x] > 255 ? 255 : this.grid[y][x];
      }
    }
  }

  setPixel({ x, y }) {
    if (!this.mousePressed) return;
    let rect = grid.getBoundingClientRect();

    x = Math.floor((x - this.OFFSET.grid.x) / this.STEP);
    y = Math.floor((y - this.OFFSET.grid.y - rect.y) / this.STEP);

    if ((x == this.prevCoords.x && y == this.prevCoords.y) || y < 0 || x < 0 || y >= this.SIZE || x >= this.SIZE) return;

    this.grid[y][x] = this.grid[y][x] + 150 > 255 ? 255 : this.grid[y][x] + 150;
    this.makeBlur({ x, y }, this.prevCoords.x == -1 ? { x, y } : this.prevCoords);
    this.prevCoords = { x, y };
  }

  setMouseFlag(flag) {
    this.mousePressed = flag;
    this.prevCoords = { x: -1, y: -1 };
  }

  drawBox({ x, y }) {
    canvas.fillStyle = "#DDD";
    canvas.font = `${textSize}px ${textStyle}`;

    let step = (this.SIZE * this.STEP) / 7 - 30;
    let offset = x - step / 2 + 5;

    for (let i = 0; i < 10; i++) {
      canvas.fillStyle = "#DDD";
      canvas.fillText(i, x + i * (step + 20), y);
      this.drawRoundRect(i * (step + 20) + offset, y + 10, step, step, 7);

      canvas.fillStyle = "#000";
      let h = (step - 4) * this.box[i];
      this.drawRoundRect(i * (step + 20) + offset + 2, step - h + y + 8, step - 4, h, h < 5 ? 2 : 7);
    }
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
        canvas.fillStyle = `rgb(${this.grid[i][j]}, ${this.grid[i][j]}, ${this.grid[i][j]})`;
        canvas.fillRect(x + j * this.STEP + 1, y + step + 1, this.STEP - lineWidth, this.STEP - lineWidth);
      }
    }

    // Draw two last lines
    this.drawLine(x, y + len, x + len, y + len);
    this.drawLine(x + len, y, x + len, y + len);
  }

  drawRoundRect(x, y, width, height, radius) {
    canvas.beginPath();
    canvas.moveTo(x + radius, y);
    canvas.lineTo(x + width - radius, y);
    canvas.quadraticCurveTo(x + width, y, x + width, y + radius);
    canvas.lineTo(x + width, y + height - radius);
    canvas.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    canvas.lineTo(x + radius, y + height);
    canvas.quadraticCurveTo(x, y + height, x, y + height - radius);
    canvas.lineTo(x, y + radius);
    canvas.quadraticCurveTo(x, y, x + radius, y);
    canvas.closePath();
    canvas.fill();
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

    this.drawGrid(this.OFFSET.grid);
    this.drawBox(this.OFFSET.box);
  }
}
