class CodeRain {
  constructor(text, size) {
    this.text = text;
    header.textSize(size);

    this.streams = [];

    this.cycleNum = Math.floor(header.random(1, 3));
    this.cycleIndex = 0;

    this.index = Math.floor(header.random(0, W / header.textSize() - 1));
    this.index = 0;
  }

  startMatrix() {
    let num = Math.floor(W / header.textSize());
    let startPoint = Math.floor((num - this.text.length) / 2);

    for (let i = 0; i < num; i++) {
      let p = new Point(i * header.textSize(), header.random(-1000, -50));
      this.streams.push(new Stream(p));

      this.streams[i].createLine(i >= startPoint ? this.text[i - startPoint] : undefined);
    }
  }

  show() {
    let stopFlag = this.cycleIndex > this.cycleNum;

    for (let i = 0; i < this.streams.length; i++) {
      this.streams[i].show(stopFlag && this.streams[i].getY() >= H / 2);

      if (this.streams[i].chars.length == 0) this.streams.splice(i, 1);
    }

    if (!stopFlag) {
      let y = this.streams[this.index].getY();
      this.cycleIndex += y >= H / 2 && y < H / 2 + 5 ? 1 : 0;
    }
  }
}
