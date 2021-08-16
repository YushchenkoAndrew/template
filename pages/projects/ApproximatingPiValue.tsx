import React from "react";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultHeader from "../../components/default/DefaultHeader";
import DefaultP5Container from "../../components/default/DefaultP5Container";
import DefaultFooter from "../../components/default/DefaultFooter";

export default function ApproximatingPiValue() {
  return (
    <>
      <DefaultHead>
        <title>Approximating Pi Value</title>
        <script defer src="/js/lib/p5.min.js"></script>
        <script defer src="/js/ApproximatingPiValue/index.js"></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultP5Container />
      <DefaultFooter name="Approximating Pi Value">
        {/* TODO:  */}
        <p>Description:</p>
      </DefaultFooter>
    </>
  );
}
