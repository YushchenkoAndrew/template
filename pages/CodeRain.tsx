import React from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultEmscContainer from "../components/default/DefaultEmscContainer";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { useRouter } from "next/dist/client/router";

export default function CodeRain() {
  const router = useRouter();
  const basePath = router.basePath;
  return (
    <>
      <DefaultHead>
        <title>Code Rain</title>
        <script defer src={`${basePath}/js/CodeRain/Char.js`}></script>
        <script defer src={`${basePath}/js/CodeRain/Stream.js`}></script>
        <script defer src={`${basePath}/js/CodeRain/CodeRain.js`}></script>
        <script defer src={`${basePath}/js/CodeRain/index.js`}></script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer width={1200} height={800} />
      <DefaultFooter name="Code Rain">
        <DefaultProjectInfo
          href="https://github.com/YushchenkoAndrew/template/tree/master/JS/CodeRain"
          links={[
            {
              link: "https://github.com/YushchenkoAndrew/template/tree/master/CDump/CodeRain",
              name: "C++",
            },
          ]}
          description="Creating a 'Code Rain' effect from Matrix. As funny joke you can put any text to
          display at the end."
        />
      </DefaultFooter>
    </>
  );
}
