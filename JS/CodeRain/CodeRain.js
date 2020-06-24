class CodeRain {
  constructor(text, size) {
    this.text = text;
    textSize(size);

    this.streams = [];

    this.cycleNum = Math.floor(random(2, 5));
    this.cycleIndex = 0;

    this.index = Math.floor(random(0, W / textSize() - 1));
    // this.index = 0;

    print(this.cycleNum);
  }

  startMatrix() {
    let num = floor(W / textSize());
    let startPoint = Math.floor((num - this.text.length) / 2);

    for (let i = 0; i < num; i++) {
      let p = new Point(i * textSize(), random(-1000, -50));
      this.streams.push(new Stream(p));

      this.streams[i].createLine(
        i >= startPoint ? this.text[i - startPoint] : undefined
      );
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
