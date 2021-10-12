import { useRouter } from "next/dist/client/router";
import React from "react";
import Card from "../components/Card";
import CardColumns from "../components/CardColumns";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultNav from "../components/default/DefaultNav";

export default function Projects() {
  const router = useRouter();
  const basePath = router.basePath;
  return (
    <>
      <DefaultHead>
        <title>Mortis Projects</title>
        <link
          rel="preload"
          href={`${basePath}/fonts/ABSTRACT.ttf`}
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href={`${basePath}/fonts/Roboto-Thin.ttf`}
          as="font"
          crossOrigin=""
        />
      </DefaultHead>

      <DefaultHeader projects />
      <main role="main">
        <CardColumns>
          <Card
            img={`${basePath}/img/ApproximatingPiValue.webp`}
            title="Find Pi with RNG"
            href={`${basePath}/ApproximatingPiValue`}
            description="Plz RNG Gods, I need to gacha the Pi value"
          />
          <Card
            img={`${basePath}/img/CodeRain.webp`}
            title="Code Rain"
            size="title-lg"
            href={`${basePath}/CodeRain`}
            description="Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes"
          />
          <Card
            img={`${basePath}/img/HammingCode.webp`}
            title="Hamming Code"
            href={`${basePath}/HammingCode`}
            description="The first algorithm for Error correction"
          />
          <Card
            img={`${basePath}/img/Minecraft.webp`}
            title="3D Engine"
            size="title-lg"
            href={`${basePath}/Minecraft`}
            description="Yet another Minecraft clone"
          />
          <Card
            img={`${basePath}/img/ReactionDiffusion.webp`}
            title="Reaction Diffusion"
            href={`${basePath}/ReactionDiffusion`}
            description="Haha, chemical elements go brrrrr "
          />
          <Card
            img={`${basePath}/img/ShadowCasting.webp`}
            title="Shadow Casting"
            href={`${basePath}/ShadowCasting`}
            description="Caveman discover shadow. Ugh, Uugh pretty shade"
          />

          {/* WARNING: Temp file */}
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            size="title-lg"
            description="Some small text which is no so important, but still it's good to have"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            description="Some small text"
          />
        </CardColumns>
      </main>

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}
