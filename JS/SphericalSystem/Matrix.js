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
  sub(A, B) {
    if (A.length != B.length || A[0].length != B[0].length) return;

    let result = [];

    for (let i in A) {
      result.push([]);
      for (let j in B) result[i][j] = A[i][j] - B[i][j];
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

  multByNum(A, num) {
    let C = [];

    for (let i in A) {
      C.push([]);

      for (let j in A[0]) C[i][j] = A[i][j] * num;
    }
    return C;
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

  determinant(A, index = 0) {
    if (A.length >= index) return 1;

    let B = decrementRow(A, index);
    return A[index][index] * this.determinant(B, index + 1);

    function decrementRow(A, index) {
      if (A[index][index] == 0) return;

      for (let i = index + 1; i < A.length; i++) {
        let store = A[i][index] / A[index][index];
        //  A[i][index] = 0;      //it's not so important to use so, we can miss it
        for (let j = index + 1; j < A.length; j++)
          A[i][j] = A[i][j] - A[index][j] * store;
      }

      return A;
    }
  }

  copy(A) {
    let copy = [];

    for (let i in A) {
      copy.push([]);
      for (let j in A[i]) {
        copy[i][j] = A[i][j];
      }
    }

    return copy;
  }

  getReversedMatrix(A) {
    let B = [];

    let determinant = this.determinant(this.copy(A), 0);

    if (!determinant) return;

    for (let i in A) B.push([]);

    for (let i in A) {
      for (let j in A[i])
        B[j][i] =
          this.determinant(cutRowAndColumn(this.copy(A), i, j)) *
          ((i + j) % 2 == 1 ? -1 : 1);
    }

    return this.multByNum(B, 1 / determinant);

    function cutRowAndColumn(A, row, col) {
      let B = [];

      for (let i = 0; i < A.length - 1; i++) {
        B.push([]);
        for (let j = 0; j < A.length - 1; j++)
          B[i][j] = A[i + (i < row ? 0 : 1)][j + (j < col ? 0 : 1)];
      }
      return B;
    }
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

    if (dimension < 4) return result;

    result[2][2] = Math.cos(angle);
    result[3][3] = Math.cos(angle);

    result[2][3] = Math.sin(angle);
    result[3][2] = -Math.sin(angle);

    return result;
  }

  rotationMatrixYW(angle, dimension = 4) {
    let result = matrix.diagonalMatrix(dimension);

    if (dimension < 4) return result;

    result[1][1] = Math.cos(angle);
    result[3][3] = Math.cos(angle);

    result[1][3] = Math.sin(angle);
    result[3][1] = -Math.sin(angle);

    return result;
  }

  rotationMatrixXW(angle, dimension = 4) {
    let result = matrix.diagonalMatrix(dimension);

    if (dimension < 4) return result;

    result[0][0] = Math.cos(angle);
    result[3][3] = Math.cos(angle);

    result[0][3] = Math.sin(angle);
    result[3][0] = -Math.sin(angle);

    return result;
  }
}
