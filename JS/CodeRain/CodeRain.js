class CodeRain {
  constructor(text, size) {
    this.text = text;
    textSize(size);

    this.streams = [];

    this.cycleNum = Math.floor(random(2, 5));
    this.cycleIndex = 0;

    this.index = Math.floor(random(0, W / textSize()));
    // this.index = 0;

    print(this.cycleNum);
  }

  startMatrix() {
    for (let i = 0; i < floor(W / textSize()); i++) {
      let p = new Point(i * textSize(), random(-600, -50));
      this.streams.push(new Stream(p));
      this.streams[i].createLine(this.text[i]);
    }
  }

  show() {
    let stopFlag = this.cycleIndex > this.cycleNum;

    for (let stream of this.streams) {
      stream.show(
        stopFlag && stream.getY() > H / 2 && stream.getY() < H / 2 + 5
      );
    }

    let y = this.streams[this.index].getY();
    this.cycleIndex += y >= H / 2 && y < H / 2 + 5 ? 1 : 0;
  }
}
