class CodeRain {
  constructor(text) {
    this.cycle = {
      index: 0,
      size: Math.round(Math.random() * 2) + 1,
      // getFlag: () => this.index >= this.size,
      getFlag: () => true,
    };

    // WARNING: I guess you need to use it at some point, maybe
    this.index = Math.floor(Math.random() * (matrixCode.width / fontSize - 1));

    let length = Math.floor(matrixCode.width / fontSize);
    let start = Math.floor((length - text.length) / 2);
    console.log(length);

    this.streams = [];
    for (let i = 0; i < length; i++) {
      this.streams.push(
        new Stream(i, i - start >= 0 ? text[i - start] : false)
      );
    }
  }

  resize() {
    // TODO: Make some resize magic
  }

  clear() {
    matrixCanvas.globalAlpha = 0.45;
    matrixCanvas.fillStyle = "#000000";
    matrixCanvas.fillRect(0, 0, matrixCode.width, matrixCode.height);
    matrixCanvas.globalAlpha = 1;
  }

  draw() {
    this.clear();

    let flag = this.cycle.getFlag();
    for (let i in this.streams) {
      this.streams[i].draw(flag);

      if (this.streams[i].chars.length == 0) this.streams.splice(i, 1);
    }

    // WARNING: Can be an issue
    if (!flag) {
      let y = this.streams[this.index].chars[0].pos.y;
      this.cycle.index +=
        y >= matrixCode.height / 2 && y < matrixCode.height / 2 + 5 ? 1 : 0;
    }
  }
}
