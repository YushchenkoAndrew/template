// Source:  https://en.wikipedia.org/wiki/Canny_edge_detector#Process_of_Canny_edge_detection_algorithm
//          https://towardsdatascience.com/canny-edge-detection-step-by-step-in-python-computer-vision-b49c3a2d8123
//          https://en.wikipedia.org/wiki/Gaussian_blur#Sample_Gaussian_matrix
//          https://en.wikipedia.org/wiki/Sobel_operator

class CannyAlg {
  constructor() {
    this.pixels = [];

    this.reset();
  }

  reset() {
    image(img, 0, 0);

    loadPixels();
    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;
        this.pixels[index] = pixels[index];
        this.pixels[index + 1] = pixels[index + 1];
        this.pixels[index + 2] = pixels[index + 2];
        this.pixels[index + 3] = pixels[index + 3];
      }
  }

  grayScaleImg() {
    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;
        let gray = this.pixels.slice(index, index + 3).reduce((a, b) => a + b) / 3;

        // Save result in local variable
        this.pixels[index] = gray;
        this.pixels[index + 1] = gray;
        this.pixels[index + 2] = gray;

        for (let i = 0; i < 4; i++) pixels[index + i] = this.pixels[index + i];
      }
    updatePixels();
  }

  /**
   *
   * @param {*} k -- size = 2 * k + 1
   * @param {*} sigma
   */
  applyGaussFilter(k = 2, sigma = 1) {
    k = int(k);

    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let blur = 0;

        let p = 1 / (2 * Math.PI * sigma * sigma);

        for (let y = -k; y < k + 1; y++)
          for (let x = -k; x < k + 1; x++) {
            let GaussBlur = p * Math.exp((x * x + y * y) / (-2 * sigma * sigma));

            let index = ((i + y * pxD) * W + j + x) * 4;
            blur += (this.pixels[index] ? this.pixels[index] : 0) * GaussBlur;
          }

        let index = (i * W + j) * 4;

        this.pixels[index] = blur;
        this.pixels[index + 1] = blur;
        this.pixels[index + 2] = blur;

        for (let i = 0; i < 3; i++) pixels[index + i] = this.pixels[index + i];
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

    // loadPixels();

    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let Ix = 0;
        let Iy = 0;

        for (let y = 0; y < Kx.length; y++)
          for (let x = 0; x < Kx[y].length; x++) {
            let index = ((i + y * pxD) * W + j + x) * 4;

            Ix += Kx[y][x] * (this.pixels[index] ? this.pixels[index] : 0);
            Iy += Ky[y][x] * (this.pixels[index] ? this.pixels[index] : 0);
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

        this.pixels[index] = G[index];
        this.pixels[index + 1] = G[index];
        this.pixels[index + 2] = G[index];

        for (let i = 0; i < 3; i++) pixels[index + i] = this.invert(this.pixels[index + i]);
      }

    updatePixels();
  }

  applyNonMaximumSuppression() {
    this.Z = [];

    // loadPixels();
    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;

        let { last, next } = this.checkDirection(i, j);

        this.Z[index] = this.pixels[index] >= last && this.pixels[index] >= next ? this.pixels[index] : 0;
      }

    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;

        this.pixels[index] = this.Z[index];
        this.pixels[index + 1] = this.Z[index];
        this.pixels[index + 2] = this.Z[index];

        for (let i = 0; i < 3; i++) pixels[index + i] = this.invert(this.pixels[index + i]);
      }

    updatePixels();
  }

  checkDirection(i, j) {
    let index = (i * W + j) * 4;
    let angle = this.theta[index] < 0 ? this.theta[index] + Math.PI : this.theta[index];
    let result = { last: this.invert(255), next: this.invert(255) };

    if ((angle >= 0 && angle < Math.PI / 8) || (angle <= Math.PI && angle > (Math.PI * 7) / 8)) {
      result.last = this.pixels[(i * W + j - 1) * 4];
      result.next = this.pixels[(i * W + j + 1) * 4];
      return result;
    }

    if (angle >= Math.PI / 8 && angle < (Math.PI * 3) / 8) {
      result.last = this.pixels[((i - pxD) * W + j - 1) * 4];
      result.next = this.pixels[((i + pxD) * W + j + 1) * 4];
      return result;
    }

    if (angle >= (Math.PI * 3) / 8 && angle < (Math.PI * 5) / 8) {
      result.last = this.pixels[((i - pxD) * W + j) * 4];
      result.next = this.pixels[((i + pxD) * W + j) * 4];
      return result;
    }

    if (angle >= (Math.PI * 5) / 8 && angle < (Math.PI * 7) / 8) {
      result.last = this.pixels[((i - pxD) * W + j + 1) * 4];
      result.next = this.pixels[((i + pxD) * W + j - 1) * 4];
      return result;
    }

    return result;
  }

  getMax() {
    let max = -1;

    // loadPixels();
    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;

        max = this.pixels[index] > max ? this.pixels[index] : max;
      }
    return max;
  }

  applyDoubleThreshold(highThresholdRatio = 0.08, lowThresholdRatio = 0.05) {
    let highThreshold = this.getMax() * highThresholdRatio;
    let lowThreshold = highThreshold * lowThresholdRatio;

    // loadPixels();
    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;

        let newValue = this.pixels[index] >= highThreshold ? STRONG : this.pixels[index];
        newValue = newValue < highThreshold && newValue > lowThreshold ? WEAK : newValue;
        newValue = newValue <= lowThreshold ? 0 : newValue;

        this.pixels[index] = newValue;
        this.pixels[index + 1] = newValue;
        this.pixels[index + 2] = newValue;

        for (let i = 0; i < 3; i++) pixels[index + i] = this.invert(this.pixels[index + i]);
      }
    updatePixels();
  }

  trackEdge(step = 1) {
    // loadPixels();
    for (let i = 0; i < H * pxD; i++)
      for (let j = 0; j < W; j++) {
        let index = (i * W + j) * 4;

        if (this.pixels[index] != WEAK) continue;

        let change = false;
        for (let y = -step; y < step + 1; y++) {
          for (let x = -step; x < step + 1; x++) {
            let nIndex = ((i + pxD * y) * W + j + x) * 4;

            if (this.pixels[nIndex] == STRONG) {
              change = true;
            }
          }
          if (change) break;
        }

        let value = change ? STRONG : 0;

        this.pixels[index] = value;
        this.pixels[index + 1] = value;
        this.pixels[index + 2] = value;

        for (let i = 0; i < 3; i++) pixels[index + i] = this.invert(this.pixels[index + i]);
      }
    updatePixels();
  }
}
