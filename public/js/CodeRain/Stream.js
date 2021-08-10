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

    const shadowLength = Math.random() * 5 + 5;
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

  draw(stopFlag) {
    let index = this.chars?.[0]?.char?.final ? 1 : 0;
    for (let i = 0; i < this.chars.length; i++) this.chars[i].draw(stopFlag);
    while (stopFlag && this.chars?.[index]?.isEnd())
      this.chars.splice(index, 1);
  }
}
