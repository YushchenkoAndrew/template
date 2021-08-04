import React from "react";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultHeader from "../../components/default/DefaultHeader";
import DefaultP5Container from "../../components/default/DefaultP5Container";
import DefaultFooter from "../../components/default/DefaultFooter";

export default function ApproximatingPiValue() {
  return (
    <>
      <DefaultHead>
        <title>Block Waves</title>
        <script src="/js/lib/p5.min.js"></script>
        <script src="/js/ApproximatingPiValue/index.js"></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultP5Container />
      <DefaultFooter />
    </>
  );
}
