import React from "react";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultHeader from "../../components/default/DefaultHeader";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultEmscContainer from "../../components/default/DefaultEmscContainer";

export default function ApproximatingPiValue() {
  return (
    <>
      <DefaultHead>
        <title>Block Waves</title>
        <script defer src="/js/HammingCode/HammingCode.js"></script>
        <script defer src="/js/HammingCode/index.js"></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer />
      <DefaultFooter />
    </>
  );
}
