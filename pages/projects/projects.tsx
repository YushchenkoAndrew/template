import React from "react";
import Card from "../../components/Card";
import CardColumns from "../../components/CardColumns";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultHeader from "../../components/default/DefaultHeader";

export default function Projects() {
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
      </DefaultHead>

      <DefaultHeader projects />
      <main role="main">
        <CardColumns>
          <Card
            img="/img/ApproximatingPiValue.webp"
            title="Find Pi with RNG"
            href={`${process.env.BASE_URL}/ApproximatingPiValue`}
          />
          <Card
            img="/img/"
            title="Code Rain"
            href={`${process.env.BASE_URL}/CodeRain`}
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
