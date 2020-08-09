class FireEffect {
  constructor() {
    this.xoff = 0;
    this.y = 0;

    this.buff1 = [];
    this.buff2 = [];
    this.coolingMap = [];

    for (let i = 0; i < N; i++) {
      this.buff1.push([]);
      this.buff2.push([]);
      for (let j = 0; j < N; j++) {
        this.buff1[i].push(j >= N - 2 ? 255 : 0);
        this.buff2[i].push(j >= N - 2 ? 255 : 0);
      }

      this.xoff += step;
      this.cooling(i);
    }
  }

  cooling(i = -1) {
    if (i == -1) this.coolingMap.splice(0, 1);

    this.coolingMap.push([]);
    let yoff = this.y;

    for (let j = 0; j < N; j++) {
      this.coolingMap[i == -1 ? N - 1 : i].push(body.noise(this.xoff, yoff) * 50);
      yoff += step;
    }

    this.y += step;
  }

  createPointFire() {
    if (body.mouseIsPressed && body.mouseX / scale < N && body.mouseY / scale < N && body.mouseX > 0 && body.mouseY > 0) {
      this.buff1[Math.floor(body.mouseX / scale)][Math.floor(body.mouseY / scale)] = 255;
      this.buff1[Math.floor(body.mouseX / scale) + 1][Math.floor(FireEff.mouseY / scale)] = 255;
    }
  }

  update(i, j) {
    this.buff2[i][j - 1] = (this.buff1[i - 1][j] + this.buff1[i + 1][j] + this.buff1[i][j + 1] + this.buff1[i][j - 1]) / 4 - this.coolingMap[i][j];

    if (this.buff2[i][j - 1] < 0) {
      this.buff2[i][j - 1] = 0;
    }

    if (body.random(0, 10) > 5 && this.buff2[i][j] >= 80) {
      this.buff2[i][j - 1] = body.random(0, 255);
    }
  }

  show() {
    body.noStroke();

    for (let i = 1; i < N - 1; i++) {
      for (let j = 1; j < N - 1; j++) {
        this.update(i, j);

        let temp = Math.floor(this.buff2[i][j]);
        body.fill(body.color(temp != 0 ? 255 : 0, temp, temp / 2.8));
        body.rect(i * scale, j * scale, scale, scale);
      }

      body.fill(body.color(Math.floor(this.buff2[i][N - 1])));
      body.rect(i * scale, (N - 1) * scale, scale, scale);
    }
  }

  clone(arr) {
    let temp = [];

    for (let i = 0; i < arr.length; i++) {
      temp.push([]);
      temp[i].push(...arr[0]);
    }
    return arr;
  }
}
