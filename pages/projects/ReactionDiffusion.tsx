import React from "react";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultHeader from "../../components/default/DefaultHeader";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultEmscContainer from "../../components/default/DefaultEmscContainer";

export default function ReactionDiffusion() {
  return (
    <>
      <DefaultHead>
        <title>Reaction Diffusion</title>
        <script defer type="text/javascript" src="/js/index.js"></script>
        <script
          async
          type="text/javascript"
          src="/js/ReactionDiffusion/index.js"
        ></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer canvas="limit-md" />
      <DefaultFooter />
    </>
  );
}
