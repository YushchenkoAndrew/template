class HammingCode {
  constructor(textSize, size = 8) {
    this.size = size;
    this.step = 40;
    this.shift = { x: 40, y: 200 };

    this.textSize = { head: 35, desc: 24 };
    this.data = [];
    this.createRand();

    // Hamming Code can detect up to two-bit errors
    this.detectError = () =>
      Object.keys(this.data)
        .filter((i) => this.data[i])
        .reduce((acc, i) => acc ^ i, 0);
  }

  printText({
    text = "",
    size = textSize["desc"],
    pos = { x: 0, y: 0 },
    color = "#FFF",
  }) {
    hammingCanvas.fillStyle = "#FFF";
    hammingCanvas.font = `${size}px ${textStyle}`;
    hammingCanvas.fillStyle = color;
    hammingCanvas.fillText(text, pos.x, pos.y);
    // hammingCanvas.font = `${textSize}px ${textStyle}`;
  }

  createRand() {
    for (let i = 0; i < this.size * this.size; i++)
      this.data.push(Math.round(Math.random()));
  }

  changeData({ x, y }, ratio = 1) {
    // Save x and y value

    let rect = hammingCode.getBoundingClientRect();

    let pos = { x: x, y: y };

    x = Math.floor((x - ratio * this.shift.x - rect.x) / this.step);
    y = Math.floor((y - ratio * this.shift.y - rect.y) / this.step);

    if (y >= 0 && x >= 0 && y - this.size < 0 && x - this.size < 0) {
      // console.log(`Mouse Clicked!!! x = ${x}, y = ${y}`);

      this.data[y * this.size + x] ^= true;
      this.draw();
      return;
    }

    // FIXME: Fix bug with getting correct 'x' value
    // Second table
    //     x =
    //       Math.floor(
    //         (pos.x - (hammingCode.width - ratio * this.shift.x)) /
    //           // let x = hammingCode.width - ratio * this.shift.x - this.size * this.step;
    //           this.step
    //       ) + 1;
    //
    //     console.log(pos.x, hammingCode.width - this.shift.x);
    //     console.log({ x, y });
    //
    //     if (y >= 0 && x >= 0 && y - this.size < 0 && x - this.size < 0) {
    //       console.log(`Mouse Clicked2!!! x = ${x}, y = ${y}`);
    //
    //       // User click on correct data, then save corrected data + change by index
    //       // this.data[this.detectError()] ^= true;
    //       this.data[y * this.size + x] ^= true;
    //       this.draw();
    //       return;
    //     }
  }

  drawTable({ x, y }) {
    hammingCanvas.strokeStyle = "#AAA";

    let border = this.size * this.step;
    let error = this.detectError();
    console.log(`Index error = ${error}`);

    for (let i = 0; i < this.size; i++) {
      let pos = this.step * i;

      // Check if number is a power of 2  =>  if ((x & (x - 1)) == 0) then true
      if (i && !(i & (i - 1))) {
        drawRect(
          "rgba(0, 255, 255, 0.35)",
          x + 1,
          y + pos + 1,
          this.step - lineWidth,
          this.step - lineWidth
        );
        drawRect(
          "rgba(0, 255, 255, 0.35)",
          x + pos + 1,
          y + 1,
          this.step - lineWidth,
          this.step - lineWidth
        );
      }

      drawLine(x, pos + y, x + border, pos + y);
      drawLine(pos + x, y, pos + x, y + border);

      let x_ = x + this.step / 2 - this.textSize["desc"] / 4;
      let y_ = y + this.step / 2 + pos + this.textSize["desc"] / 4;

      for (let j = 0; j < this.size; j++) {
        let index = i * this.size + j;

        if (index == error && error)
          drawRect(
            "rgba(255, 0, 0, 0.35)",
            x + this.step * j + 1,
            y + pos + 1,
            this.step - lineWidth,
            this.step - lineWidth
          );
        hammingCanvas.fillStyle = this.data[index] ? "#FFF" : "#777";

        hammingCanvas.fillText(this.data[index], x_ + this.step * j, y_);
      }
    }

    drawLine(x, border + y, x + border, border + y);
    drawLine(border + x, y, x + border, border + y);

    // Additional Functions

    function drawLine(...pos) {
      hammingCanvas.beginPath();
      hammingCanvas.moveTo(...pos.slice(0, 2));
      hammingCanvas.lineTo(...pos.slice(-2));
      hammingCanvas.stroke();
    }

    function drawRect(color, ...pos) {
      hammingCanvas.fillStyle = color;
      hammingCanvas.fillRect(...pos);
    }
  }

  draw(ratio = 1) {
    // Reset Canvas
    hammingCanvas.fillStyle = "#000000";
    hammingCanvas.fillRect(0, 0, hammingCode.width, hammingCode.height);

    let text = "Hamming Code";
    this.printText({
      text: text,
      size: this.textSize["head"],
      pos: {
        x: hammingCode.width / 2 - (ratio * (text.length * 35)) / 4,
        y: ratio * 100,
      },
    });

    this.printText({
      text: "Data with Error",
      size: this.textSize["desc"],
      pos: { x: ratio * (this.shift.x + 70), y: ratio * (this.shift.y - 20) },
      color: "#74e384",
    });
    this.drawTable({ x: ratio * this.shift.x, y: ratio * this.shift.y });

    let errIndex = this.detectError();
    this.data[errIndex] ^= true;

    let x = hammingCode.width - ratio * this.shift.x - this.size * this.step;
    this.printText({
      text: "Correct Data",
      size: this.textSize["desc"],
      pos: {
        x: x + ratio * (this.shift.x + 50),
        y: ratio * (this.shift.y - 20),
      },
      color: "#74e384",
    });
    this.drawTable({ x: x, y: ratio * this.shift.y });

    // Return to the previous data state
    this.data[errIndex] ^= true;
  }
}
