import React from "react";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultHeader from "../../components/default/DefaultHeader";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultEmscContainer from "../../components/default/DefaultEmscContainer";

// FIXME: Fix src code in C++ to change position of canvas has issue with small sizes !!!
export default function ShadowCasting() {
  return (
    <>
      <DefaultHead>
        <title>Shadow Casting</title>
        <script defer type="text/javascript" src="/js/index.js"></script>
        <script
          async
          type="text/javascript"
          src="/js/ShadowCasting/index.js"
        ></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer canvas="limit-xxl" />
      <DefaultFooter />
    </>
  );
}
