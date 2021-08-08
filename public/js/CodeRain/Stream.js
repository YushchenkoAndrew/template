class Stream {
  constructor(index, value) {
    this.chars = [];

    const length = Math.round(Math.random() * 5 + 5);
    const pos = { x: index * (fontSize - 2), y: -900 * Math.random() - 50 };
    const vel =
      (Math.random() * matrixCode.height) / 300 + matrixCode.height / 400;
    for (let i = 0; i < length; i++) {
      this.chars.push(new Char({ x: pos.x, y: pos.y - fontSize * i }, vel));
    }

    const shadowLength = Math.random() * 7 + 5;
    for (let i = 0; i < shadowLength; i++) {
      this.chars.push(
        new Char(
          { x: pos.x, y: pos.y - length * fontSize - fontSize * i - 1 },
          vel,
          `rgba(100, 255, 20, ${1 - (1 / shadowLength) * i})`
        )
      );
    }

    this.chars[0].char.final = value;
    if (Math.random() > 0.7) this.chars[0].char.color = "#FAFFDC";
  }

  // FIXME: a bug with stopFlag
  draw(stopFlag) {
    // stopFlag = stopFlag && this.chars[0].isEnd();

    let index = 1;
    if (this.chars[0].char.final) {
      // stopFlag =
      //   stopFlag && this.chars[0].pos.y <= matrixCode.height / 2 + fontSize;
      // if (stopFlag) index = 1;
    }

    for (let i = 0; i < this.chars.length; i++) this.chars[i].draw(stopFlag);
    while (this.chars?.[index]?.isEnd()) this.chars.splice(index, 1);
  }
}
