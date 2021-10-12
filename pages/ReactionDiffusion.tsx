import React from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultEmscContainer from "../components/default/DefaultEmscContainer";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { useRouter } from "next/dist/client/router";

export default function ReactionDiffusion() {
  const router = useRouter();
  const basePath = router.basePath;
  return (
    <>
      <DefaultHead>
        <title>Reaction Diffusion</title>
        <script
          defer
          type="text/javascript"
          src={`${basePath}/js/index.js`}
        ></script>
        <script
          async
          type="text/javascript"
          src={`${basePath}/js/ReactionDiffusion/index.js`}
        ></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer canvas="limit-md" />
      <DefaultFooter name="Reaction Diffusion">
        <DefaultProjectInfo
          href="https://github.com/YushchenkoAndrew/template/tree/master/CDump/ReactionDiffusion"
          description="A simulation of chemical reaction, which is based on Cellular automaton rules. It's using a Gray-Scott model.
          Just click on the canvas!!"
        />
      </DefaultFooter>
    </>
  );
}
