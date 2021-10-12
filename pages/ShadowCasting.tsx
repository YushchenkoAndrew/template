import React from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultEmscContainer from "../components/default/DefaultEmscContainer";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { useRouter } from "next/dist/client/router";

// FIXME: Fix src code in C++ to change position of canvas has issue with small sizes !!!
export default function ShadowCasting() {
  const router = useRouter();
  const basePath = router.basePath;
  return (
    <>
      <DefaultHead>
        <title>Shadow Casting</title>
        <script
          defer
          type="text/javascript"
          src={`${basePath}/js/index.js`}
        ></script>
        <script
          async
          type="text/javascript"
          src={`${basePath}/js/ShadowCasting/index.js`}
        ></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer canvas="limit-xxl" />
      <DefaultFooter name="Approximating Pi Value">
        <DefaultProjectInfo
          href="https://github.com/YushchenkoAndrew/template/tree/master/CDump/ShadowCasting"
          description="This project is improved version of Ray Casting 2D. Instead of emitting 
          lots of rays in each directions, this algorith detect edges and will draw a segment for it, thus
          a lot of performance is saved and we can use sprite for represent light source"
        />
      </DefaultFooter>
    </>
  );
}
