class MouseControl {
  rotate(axis) {
    let offset3D = { x: 100, y: H / 2 + 300 };

    // 3D axis rotation

    if (check(axis[7], offset3D)) {
      if (!keyIsDown(CONTROL)) disableRotation();
      else if (selectedAxis.y.isSelected) {
        selectedAxis.y.isSelected = false;
        return;
      }

      selectedAxis.y.isSelected = true;

      return;
    }

    if (check(axis[1], offset3D)) {
      if (!keyIsDown(CONTROL)) disableRotation();
      else if (selectedAxis.z.isSelected) {
        selectedAxis.z.isSelected = false;
        return;
      }

      selectedAxis.z.isSelected = true;
      return;
    }

    if (check(axis[4], offset3D)) {
      if (!keyIsDown(CONTROL)) disableRotation();
      else if (selectedAxis.x.isSelected) {
        selectedAxis.x.isSelected = false;
        return;
      }

      selectedAxis.x.isSelected = true;
      return;
    }

    function disableRotation() {
      for (let k in selectedAxis) selectedAxis[k].isSelected = false;

      autoRotation = false;
    }

    function check(point, offset) {
      let x =
        mouseX - 20 < point.x + offset.x && mouseX + 20 > point.x + offset.x;
      let y =
        mouseY - 20 < point.y + offset.y && mouseY + 20 > point.y + offset.y;

      return x && y;
    }
  }

  newLine() {
    dimension.system.index++;
    dimension.system.rotation = matrix.diagonalMatrix(3);

    console.log(dimension.system.index);
  }

  rotateLine() {
    if (!keyIsPressed) return;

    if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
      let rot = matrix.rotationMatrixOZ(0.1);

      let mouse = createVector(mouseX - W / 2, mouseY - H / 2);
      // mouse.sub(dimension.system.mousePos);

      stroke(color(0, 255, 0));
      line(0, 0, mouse.x, mouse.y);

      // dimension.system.mousePos.x = mouseX - W / 2;
      // dimension.system.mousePos.y = mouseY - H / 2;

      // if (mouseX != mousePos.x) {
      let dx = dimension.system.dx;

      let T = matrix.diagonalMatrix(3);
      T[0][2] = (-(mouse.x - W / 2) / R) * 0.1;
      T[1][2] = (-(mouse.y - H / 2) / R) * 0.1;
      // }

      // console.log(T);

      T = matrix.mult(T, rot);
      dimension.system.T = matrix.mult(T, dimension.system.T);

      T = matrix.diagonalMatrix(3);
      T[0][2] = (mouse.x - W / 2) / R;
      T[1][2] = (mouse.y - H / 2) / R;
      dimension.system.T = matrix.mult(dimension.system.T, T);

      // let index = dimension.system.index;

      // let j = 0;

      // for (let j in dimension.system.points[index]) {
      // this.points[index].push(new Vector4D(temp.x, i, 0));

      // for (let i in this.points[this.index]) {
      //   dimension.system.points[index][j].setVector(
      //     matrix.mult(T2, dimension.system.points[index][j].getVector())
      //   );
      // }

      // console.log(dimension.system.T);
    }

    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
      let rot = matrix.rotationMatrixOY(-0.05);

      dimension.system.T = matrix.mult(rot, dimension.system.T);
    }
  }

  resize(delta) {
    if (R + delta > 50) R += delta;
  }
}
