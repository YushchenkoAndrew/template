import React from "react";
import DefaultNavBar from "../../components/default/DefaultHeader";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultHeader from "../../components/default/DefaultHeader";

export default function BlockWaves() {
  return (
    <>
      <DefaultHead>
        <title>Block Waves</title>
        <script src="/js/lib/p5.min.js"></script>
        <script src="/js/BlockWaves/index.js"></script>
      </DefaultHead>

      <DefaultHeader projects />

      <main>
        {/* FIXME: */}
        <canvas
          id="defaultCanvas0"
          className="p5Canvas"
          width="700"
          // height="700"
          // style="width: 700px; height: 700px;"
        ></canvas>
        {/* <canvas
          className="emscripten"
          id="canvas"
          onContextMenu={() => eval("event.preventDefault()")}
          tabIndex={-1}
        ></canvas> */}
        HELLO
      </main>

      <footer></footer>
    </>
  );
}
