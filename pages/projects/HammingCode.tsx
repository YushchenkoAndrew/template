import React from "react";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultHeader from "../../components/default/DefaultHeader";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultEmscContainer from "../../components/default/DefaultEmscContainer";
import DefaultProjectInfo from "../../components/default/DefaultProjectInfo";

export default function HammingCode() {
  return (
    <>
      <DefaultHead>
        <title>Hamming Code</title>
        <script defer src="/js/HammingCode/HammingCode.js"></script>
        <script defer src="/js/HammingCode/index.js"></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer width={900} />
      <DefaultFooter name="Hamming Code">
        <DefaultProjectInfo
          href="https://github.com/YushchenkoAndrew/template/tree/master/JS/ApproximatingPiValue"
          description="Create a implementation of alg 'Hamming Code', which is detecting a flipped bit
          in data stream. For changing bit value just mouse click on a square and it
          will invert the value. Left table represent data with an error bit and the right
          corrected one"
        />
      </DefaultFooter>
    </>
  );
}
