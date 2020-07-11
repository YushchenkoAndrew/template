class Vector4D {
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  getVector() {
    let vector = [];

    if (this.x !== undefined) vector.push([this.x]);
    if (this.y !== undefined) vector.push([this.y]);
    if (this.z !== undefined) vector.push([this.z]);
    if (this.w !== undefined) vector.push([this.w]);

    return vector;
  }

  coords2D() {
    return [this.x, this.y];
  }

  coords3D() {
    return [...this.coords2D(), this.z];
  }

  setVector(vector) {
    if (!vector) return;

    if (vector[0] !== undefined) this.x = vector[0][0];
    if (vector[1] !== undefined) this.y = vector[1][0];
    if (vector[2] !== undefined) this.z = vector[2][0];
    if (vector[3] !== undefined) this.w = vector[3][0];
  }
}
