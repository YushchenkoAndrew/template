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

    // Define Neural Network
    let options = {
      inputs: [this.SIZE, this.SIZE, 4],
      task: "imageClassification",
      debug: true,
    };

    this.numberClassifier = ml5.neuralNetwork(options);
    this.numberClassifier.load(modelDetails, () => console.log("Model Loaded"));
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
    x = Math.floor((x - this.OFFSET.grid.x) / this.STEP);
    y = Math.floor((y - this.OFFSET.grid.y) / this.STEP);

    if ((x == this.prevCoords.x && y == this.prevCoords.y) || y < 0 || x < 0 || y >= this.SIZE || x >= this.SIZE) return;

    this.grid[y][x] = this.grid[y][x] + 180 > 255 ? 255 : this.grid[y][x] + 180;
    this.makeBlur({ x, y }, this.prevCoords.x == -1 ? { x, y } : this.prevCoords);
    this.prevCoords = { x, y };

    let img = createImage(this.SIZE, this.SIZE);
    img.loadPixels();

    for (let i in this.grid) {
      for (let j in this.grid[i]) {
        img.set(j, i, this.grid[i][j]);
      }
    }
    img.updatePixels();

    this.numberClassifier.classify({ image: img }, this.setBox.bind(null, this));
  }

  setBox(ptr, err, result) {
    if (err) {
      console.log(err);
      return;
    }

    for (let { label, confidence } of result) {
      ptr.box[label] = confidence;
    }
  }

  press({ mouseX, mouseY }) {
    let step = (this.SIZE * this.STEP) / 7 - 30;
    let offset = this.OFFSET.box.x - step / 2 + 5;
    let x = 10 * (step + 20) + offset;
    let y = this.OFFSET.box.y + 10;

    // Reset grid
    if (mouseX > x && mouseY > y && mouseX < x + step + 25 && mouseY < y + step) {
      for (let i in this.grid) {
        for (let j in this.grid[i]) this.grid[i][j] = 0;
      }
    }
  }

  drawBox({ x, y }) {
    fill(220);
    // canvas.font = `${textSize}px ${textStyle}`;

    let step = (this.SIZE * this.STEP) / 7 - 30;
    let offset = x - step / 2 + 5;

    for (let i = 0; i < 10; i++) {
      fill(220);
      text(i, x + i * (step + 20), y);
      rect(i * (step + 20) + offset, y + 10, step, step, 7);

      fill(0);
      let h = (step - 4) * this.box[i];
      rect(i * (step + 20) + offset + 2, step - h + y + 8, step - 4, h, 7);
    }

    // Set Clear Button
    fill(220);
    text("Clear", x + 10 * (step + 20) - 10, y + step / 2 + 15);

    noFill();
    rect(10 * (step + 20) + offset, y + 10, step + 25, step, 7);
  }

  drawGrid({ x, y }) {
    // canvas.strokeStyle = "#AAA";
    stroke(170);

    let len = this.STEP * this.SIZE;

    for (let i in this.grid) {
      const step = i * this.STEP;

      // Create grid
      line(x, y + step, x + len, y + step);
      line(x + step, y, x + step, y + len);

      for (let j in this.grid[i]) {
        fill(this.grid[i][j]);
        rect(x + j * this.STEP + 1, y + step + 1, this.STEP - lineWidth, this.STEP - lineWidth);
      }
    }

    // Draw two last lines
    line(x, y + len, x + len, y + len);
    line(x + len, y, x + len, y + len);
  }

  draw() {
    this.drawGrid(this.OFFSET.grid);
    this.drawBox(this.OFFSET.box);
  }
}
