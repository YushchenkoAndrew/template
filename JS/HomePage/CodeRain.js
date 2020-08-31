class CodeRain {
  constructor(text, textSize, textStyle) {
    this.text = {
      value: text,
      size: textSize,
      style: textStyle,
    };

    rainCanvas.font = `${textSize}px ${textStyle}`;

    this.streams = [];

    // this.cycleNum = 1;
    this.cycleNum = Math.round(Math.random() * 2) + 1;
    this.cycleIndex = 0;

    this.index = Math.floor(Math.random() * (window.innerWidth / textSize - 1));
    // this.index = 0;
  }

  startMatrix() {
    let numOfStream = Math.floor(window.innerWidth / this.text.size);
    let startPoint = Math.floor((numOfStream - this.text.value.length) / 2);

    for (let i = 0; i < numOfStream; i++) {
      this.streams.push(new Stream({ x: i * this.text.size, y: Math.random() * -900 - 50 }));

      this.streams[i].createLine(i >= startPoint ? this.text.value[i - startPoint] : undefined);
    }
  }

  clear() {
    rainCanvas.globalAlpha = 0.32;
    rainCanvas.fillStyle = "#000000";
    rainCanvas.fillRect(0, 0, MatrixCanvas.width, MatrixCanvas.height);
    rainCanvas.globalAlpha = 1;
  }

  show() {
    this.clear();

    let stopFlag = this.cycleIndex >= this.cycleNum;

    for (let i = 0; i < this.streams.length; i++) {
      this.streams[i].show(stopFlag);

      if (this.streams[i].chars.length == 0) this.streams.splice(i, 1);
    }

    if (!stopFlag) {
      let y = this.streams[this.index].getY();
      this.cycleIndex += y >= window.innerHeight / 2 && y < window.innerHeight / 2 + 5 ? 1 : 0;
    }
  }
}
