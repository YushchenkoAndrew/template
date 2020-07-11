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

  resize(delta) {
    if (R + delta > 50) R += delta;
  }
}
