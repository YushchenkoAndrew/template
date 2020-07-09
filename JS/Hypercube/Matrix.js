class Matrix {
  add(A, B) {
    if (A.length != B.length || A[0].length != B[0].length) return;

    let result = [];

    for (let i in A) {
      result.push([]);
      for (let j in B) result[i][j] = A[i][j] + B[i][j];
    }

    return result;
  }

  mult(A, B) {
    if (A[0].length != B.length) return;

    let result = [];

    for (let i in A) {
      result.push([]);

      for (let j in B[0]) {
        result[i][j] = 0;

        for (let k in B) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }

    return result;
  }

  diagonalMatrix(size = 3, value = 1) {
    let result = [];

    for (let i = 0; i < size; i++) {
      result.push([]);

      result[i][i] = value;

      for (let j = 0; j < i; j++) {
        result[i][j] = 0;
        result[j][i] = 0;
      }
    }

    return result;
  }

  rotationMatrixOX(angle = 0, dimension = 3) {
    let result = this.diagonalMatrix(dimension);

    result[1][1] = Math.cos(angle);
    result[2][2] = Math.cos(angle);

    result[1][2] = Math.sin(angle);
    result[2][1] = -Math.sin(angle);

    return result;
  }

  rotationMatrixOY(angle = 0, dimension = 3) {
    let result = this.diagonalMatrix(dimension);

    result[0][0] = Math.cos(angle);
    result[2][2] = Math.cos(angle);

    result[0][2] = -Math.sin(angle);
    result[2][0] = Math.sin(angle);

    return result;
  }

  rotationMatrixOZ(angle = 0, dimension = 3) {
    let result = this.diagonalMatrix(dimension);

    result[0][0] = Math.cos(angle);
    result[1][1] = Math.cos(angle);

    result[0][1] = Math.sin(angle);
    result[1][0] = -Math.sin(angle);

    return result;
  }

  rotationMatrixZW(angle, dimension = 4) {
    let result = matrix.diagonalMatrix(dimension);

    result[2][2] = Math.cos(angle);
    result[3][3] = Math.cos(angle);

    result[2][3] = Math.sin(angle);
    result[3][2] = -Math.sin(angle);

    return result;
  }

  rotationMatrixYW(angle, dimension = 4) {
    let result = matrix.diagonalMatrix(dimension);

    result[1][1] = Math.cos(angle);
    result[3][3] = Math.cos(angle);

    result[1][3] = Math.sin(angle);
    result[3][1] = -Math.sin(angle);

    return result;
  }

  rotationMatrixXW(angle, dimension = 4) {
    let result = matrix.diagonalMatrix(dimension);

    result[0][0] = Math.cos(angle);
    result[3][3] = Math.cos(angle);

    result[0][3] = Math.sin(angle);
    result[3][0] = -Math.sin(angle);

    return result;
  }
}
