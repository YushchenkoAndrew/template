var Module = {
  preRun: [],
  postRun: [],
  canvas: (function () {
    var canvas = document.getElementById("canvas");

    // As a default initial behavior, pop up an alert when webgl context is lost. To make your
    // application robust, you may want to override this behavior before shipping!
    // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
    canvas.addEventListener(
      "webglcontextlost",
      function (e) {
        alert("WebGL context lost. You will need to reload the page.");
        e.preventDefault();
      },
      false
    );

    return canvas;
  })(),
};

Module.canvas.addEventListener("resize", (e) => {
  let viewWidth = e.detail.width;
  let viewHeight = e.detail.width / Module._olc_WindowAspectRatio;

  // var viewHeight = e.detail.width;
  // var viewWidth = e.detail.width / Module._olc_WindowAspectRatio;

  if (viewHeight > e.detail.height) {
    viewHeight = e.detail.height - 75;
    viewWidth = e.detail.height * Module._olc_WindowAspectRatio;
  }

  // update dom attributes
  Module.canvas.setAttribute("width", viewWidth);
  Module.canvas.setAttribute("height", viewHeight);

  // var top = (e.detail.height - viewHeight) / 2;
  // var left = (e.detail.width - viewWidth) / 2;

  // update styles
  // Module.canvas.style.position = "fixed";
  // Module.canvas.style.top = (top + 30).toString() + "px";
  // Module.canvas.style.left = left.toString() + "px";
  Module.canvas.style.width = "";
  Module.canvas.style.height = "";

  // trigger PGE update
  Module._olc_PGE_UpdateWindowSize(viewWidth, viewHeight);

  // ensure canvas has focus
  Module.canvas.focus();
  e.preventDefault();
});
