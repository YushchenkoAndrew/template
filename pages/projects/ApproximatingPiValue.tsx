import React from "react";
import DefaultNavBar from "../../components/default/DefaultNavBar";
import DefaultHead from "../../components/default/DefaultHead";

export default function ApproximatingPiValue() {
  return (
    <>
      <DefaultHead>
        <title>Block Waves</title>
        <script src="/js/lib/jquery.min.js"></script>
        <script src="/js/lib/p5.min.js"></script>
        <script src="/js/ApproximatingPiValue/index.js"></script>
      </DefaultHead>

      <header>
        <DefaultNavBar projects />
      </header>

      <main role="main" className="container">
        <div className="jumbotron" id="CanvasContainer0"></div>
      </main>

      <footer></footer>
    </>
  );
}
