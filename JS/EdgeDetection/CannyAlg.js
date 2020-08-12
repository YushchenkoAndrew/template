class CannyAlg {
  constructor() {
    image(img, 0, 0);
  }

  grayScaleImg() {
    loadPixels();
    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;
        let gray = pixels.slice(index, index + 3).reduce((a, b) => a + b) / 3;

        pixels[index] = gray;
        pixels[index + 1] = gray;
        pixels[index + 2] = gray;
      }
    updatePixels();
  }

  /**
   *
   * @param {*} k -- size = 2 * k + 1
   * @param {*} sigma
   */
  applyGaussFilter(k, sigma = 1) {
    loadPixels();

    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let blur = 0;

        let p = 1 / (2 * Math.PI * sigma * sigma);

        for (let y = -k; y < k + 1; y++)
          for (let x = -k; x < k + 1; x++) {
            let GaussBlur = p * Math.exp((x * x + y * y) / (-2 * sigma * sigma));

            let index = ((i + y * pxD) * W + j + x) * 4;
            blur += pixels[index] * GaussBlur;
          }

        let index = (i * W + j) * 4;

        pixels[index] = blur;
        pixels[index + 1] = blur;
        pixels[index + 2] = blur;
      }
    updatePixels();
  }

  invert(value) {
    return invertFlag ? 255 - value : value;
  }

  findIntensityGradient() {
    // Sobel Edge detection operator
    let Kx = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];
    let Ky = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1],
    ];

    let G = [];
    this.theta = [];
    let max = -1;

    loadPixels();

    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let Ix = 0;
        let Iy = 0;

        for (let y = 0; y < Kx.length; y++)
          for (let x = 0; x < Kx[y].length; x++) {
            let index = ((i + y * pxD) * W + j + x) * 4;

            Ix += Kx[y][x] * pixels[index];
            Iy += Ky[y][x] * pixels[index];
          }

        let index = (i * W + j) * 4;

        G[index] = Math.sqrt(Ix * Ix + Iy * Iy);
        this.theta[index] = Math.atan(Iy / Ix);
        max = G[index] > max ? G[index] : max;
      }

    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;

        G[index] *= 255 / max;

        pixels[index] = this.invert(G[index]);
        pixels[index + 1] = this.invert(G[index]);
        pixels[index + 2] = this.invert(G[index]);
      }

    updatePixels();
  }

  applyNonMaximumSuppression() {
    this.Z = [];

    loadPixels();
    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;

        let { last, next } = this.checkDirection(i, j);

        this.Z[index] = this.invert(pixels[index]) >= last && this.invert(pixels[index]) >= next ? this.invert(pixels[index]) : 0;
      }

    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;

        pixels[index] = this.invert(this.Z[index]);
        pixels[index + 1] = this.invert(this.Z[index]);
        pixels[index + 2] = this.invert(this.Z[index]);
      }

    updatePixels();
  }

  checkDirection(i, j) {
    let index = (i * W + j) * 4;
    let angle = this.theta[index] < 0 ? this.theta[index] + Math.PI : this.theta[index];
    let result = { last: this.invert(255), next: this.invert(255) };

    if ((angle >= 0 && angle < Math.PI / 8) || (angle <= Math.PI && angle > (Math.PI * 7) / 8)) {
      result.last = this.invert(pixels[(i * W + j - 1) * 4]);
      result.next = this.invert(pixels[(i * W + j + 1) * 4]);
      return result;
    }

    if (angle >= Math.PI / 8 && angle < (Math.PI * 3) / 8) {
      result.last = this.invert(pixels[((i - pxD) * W + j - 1) * 4]);
      result.next = this.invert(pixels[((i + pxD) * W + j + 1) * 4]);
      return result;
    }

    if (angle >= (Math.PI * 3) / 8 && angle < (Math.PI * 5) / 8) {
      result.last = this.invert(pixels[((i - pxD) * W + j) * 4]);
      result.next = this.invert(pixels[((i + pxD) * W + j) * 4]);
      return result;
    }

    if (angle >= (Math.PI * 5) / 8 && angle < (Math.PI * 7) / 8) {
      result.last = this.invert(pixels[((i - pxD) * W + j + 1) * 4]);
      result.next = this.invert(pixels[((i + pxD) * W + j - 1) * 4]);
      return result;
    }

    return result;
  }

  getMax() {
    let max = -1;

    loadPixels();
    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;

        max = this.invert(pixels[index]) > max ? this.invert(pixels[index]) : max;
      }
    return max;
  }

  applyDoubleThreshold(highThresholdRatio, lowThresholdRatio) {
    let highThreshold = this.getMax() * highThresholdRatio;
    let lowThreshold = highThreshold * lowThresholdRatio;

    loadPixels();
    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;

        let newValue = this.invert(pixels[index]) >= highThreshold ? STRONG : this.invert(pixels[index]);
        newValue = newValue < highThreshold && newValue > lowThreshold ? WEAK : newValue;
        newValue = newValue <= lowThreshold ? 0 : newValue;

        pixels[index] = this.invert(newValue);
        pixels[index + 1] = this.invert(newValue);
        pixels[index + 2] = this.invert(newValue);
      }
    updatePixels();
  }

  trackEdge(step = 1) {
    loadPixels();
    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;

        if (this.invert(pixels[index]) != WEAK) continue;

        let change = false;
        for (let y = -step; y < step + 1; y++) {
          for (let x = -step; x < step + 1; x++) {
            let nIndex = ((i + pxD * y) * W + j + x) * 4;

            if (this.invert(pixels[nIndex]) == STRONG) {
              change = true;
            }
          }
          if (change) break;
        }

        let value = change ? STRONG : 0;

        pixels[index] = this.invert(value);
        pixels[index + 1] = this.invert(value);
        pixels[index + 2] = this.invert(value);
      }
    updatePixels();
  }
}
