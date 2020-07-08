class Vector4D {
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  getVector() {
    return [[this.x], [this.y], [this.z], [this.w]];
  }

  coords() {
    return [this.x, this.y, this.z];
  }

  setVector(vector) {
    if (!vector) return;

    this.x = vector[0][0];
    this.y = vector[1][0];
    this.z = vector[2][0];
    this.w = vector[3][0];
  }
}
