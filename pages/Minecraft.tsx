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
          src={`${basePath}/js/Minecraft/index.js`}
        ></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer canvas="limit-xl" />
      <DefaultFooter name="3D Engine">
        <DefaultProjectInfo
          href="https://github.com/YushchenkoAndrew/template/tree/master/CDump/Minecraft"
          description="Yet another Minecraft clone, without mining and block placing. At list it was planted to be one of it...
           I'll still need to polish it a bit, but maybe not for today. Press 'x' for Open Menu or Close Menu. Press 'z' to Confirm. 
           Press 'ASWD' to move around."
        />
      </DefaultFooter>
    </>
  );
}
