class CodeRain {
  constructor(text) {
    this.text = text;
    this.cycle = {
      index: 0,
      size: Math.round(Math.random() * 2) + 1,
      getFlag() {
        return this.index >= this.size;
      },
    };

    // NOTE: This useless var need only for check if cycle is finish
    this.index = Math.floor(Math.random() * (matrixCode.width / fontSize - 1));

    let length = Math.floor(matrixCode.width / (fontSize - 2));
    let offset = Math.floor((length - text.length) / 2);
    console.log(length);

    this.streams = [];
    for (let i = 0; i < length; i++) {
      this.streams.push(
        new Stream(
          i + 1,
          i >= offset && i - offset < text.length ? text[i - offset] : false
        )
      );
    }
  }

  resize() {
    let start = this.streams.length;
    let length = Math.floor(matrixCode.width / (fontSize - 2));
    if (this.text.length > length) {
      this.text = "Hello world!";
      length = Math.floor(matrixCode.width / (fontSize - 2));
    }

    let offset = Math.floor((length - this.text.length) / 2);
    this.index = Math.floor(Math.random() * (matrixCode.width / fontSize - 1));

    // NOTE: The code below won't work if (length - start) < 0
    for (let i = start; i < length; i++)
      this.streams.push(new Stream(i + 1, false));

    // NOTE: The code below won't work if (length - start) < 0
    while (this.streams.length > length) this.streams.splice(length, 1);

    for (let i in this.streams) {
      if (
        !this.streams[i].chars[0] &&
        i >= offset &&
        i - offset < this.text.length
      )
        this.streams[i].chars.push(
          new Char({ x: i * (fontSize - 2), y: matrixCode.height / 2 }, 10)
        );
      else if (!this.streams[i].chars[0]) continue;

      this.streams[i].chars[0].char.final = undefined;
      if (
        i >= offset &&
        i - offset < this.text.length &&
        // this.text.length <= length
        true
      )
        this.streams[i].chars[0].char.final = this.text[i - offset];
    }
  }

  clear() {
    // matrixCanvas.globalAlpha = 0.45;
    matrixCanvas.fillStyle = "#000000";
    matrixCanvas.fillRect(0, 0, matrixCode.width, matrixCode.height);
    // matrixCanvas.globalAlpha = 1;
  }

  draw() {
    this.clear();

    // NOTE: Whole idea is not the best one for keep streem element
    for (let i in this.streams) {
      this.streams[i].draw(this.cycle.getFlag());
      // if (this.streams[i].chars.length == 0) this.streams.splice(i, 1);
    }

    if (!this.cycle.getFlag()) {
      let y = this.streams[this.index].chars[0].pos.y;
      this.cycle.index +=
        y >= matrixCode.height / 2 && y < matrixCode.height / 2 + fontSize
          ? 1
          : 0;
    }
  }
}
