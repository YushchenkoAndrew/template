import React from "react";
import Card from "../../components/Card";
import CardColumns from "../../components/CardColumns";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultHeader from "../../components/default/DefaultHeader";

export default function Projects() {
  const baseURL = process.env.BASE_URL ?? "";
  return (
    <>
      <DefaultHead>
        <title>Mortis Projects</title>
        <link
          rel="preload"
          href="/fonts/ABSTRACT.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Roboto-Thin.ttf"
          as="font"
          crossOrigin=""
        />
      </DefaultHead>

      <DefaultHeader projects />
      <main role="main">
        <CardColumns>
          <Card
            img="/img/ApproximatingPiValue.webp"
            title="Find Pi with RNG"
            href={`${baseURL}/ApproximatingPiValue`}
            description="Plz RNG Gods, I need to gacha the Pi value"
          />
          <Card
            img="/img/CodeRain.webp"
            title="Code Rain"
            size="title-lg"
            href={`${baseURL}/CodeRain`}
            description="Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes"
          />
          <Card
            img="/img/HammingCode.webp"
            title="Hamming Code"
            href={`${baseURL}/HammingCode`}
            description="The first algorithm for Error correction"
          />
          <Card
            img="/img/Minecraft.webp"
            title="3D Engine"
            size="title-lg"
            href={`${baseURL}/Minecraft`}
            description="Yet another Minecraft clone"
          />
          <Card
            img="/img/ReactionDiffusion.webp"
            title="Reaction Diffusion"
            href={`${baseURL}/ReactionDiffusion`}
            description="Haha, chemical elements go brrrrr "
          />
          <Card
            img="/img/ShadowCasting.webp"
            title="Shadow Casting"
            href={`${baseURL}/ShadowCasting`}
            description="Same as Ray Casting, but better"
          />

          {/* WARNING: Temp file */}
          <Card
            img="/img/Black.webp"
            title="Some text"
            href="#"
            size="title-lg"
            // color="text-dark"
            description="Some small text which is no so important, but still it's good to have"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            color="text-dark"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            color="text-dark"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            color="text-dark"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            color="text-dark"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            color="text-dark"
            description="Some small text"
          />
        </CardColumns>
      </main>
      <DefaultFooter />
    </>
  );
}
