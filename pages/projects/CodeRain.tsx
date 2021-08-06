import React from "react";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultHeader from "../../components/default/DefaultHeader";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultEmscContainer from "../../components/default/DefaultEmscContainer";

export default function CodeRain() {
  return (
    <>
      <DefaultHead>
        <title>Code Rain</title>
        <script defer src="/js/CodeRain/Char.js"></script>
        <script defer src="/js/CodeRain/Stream.js"></script>
        <script defer src="/js/CodeRain/CodeRain.js"></script>
        <script defer src="/js/CodeRain/index.js"></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer width={1200} height={800} />
      <DefaultFooter />
    </>
  );
}
