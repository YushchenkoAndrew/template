import React from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultEmscContainer from "../components/default/DefaultEmscContainer";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";

// FIXME: Fix src code in C++ to change position of canvas has issue with small sizes !!!
export default function ShadowCasting() {
  return (
    <>
      <DefaultHead>
        <title>Shadow Casting</title>
        <script
          defer
          type="text/javascript"
          src="/projects/js/index.js"
        ></script>
        <script
          async
          type="text/javascript"
          src="/projects/js/ShadowCasting/index.js"
        ></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer canvas="limit-xxl" />
      <DefaultFooter name="Approximating Pi Value">
        <DefaultProjectInfo
          //  TODO: Finish description part!!!
          href="https://github.com/YushchenkoAndrew/template/tree/master/CDump/ShadowCasting"
          description=""
        />
      </DefaultFooter>
    </>
  );
}
