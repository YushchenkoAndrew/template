import React from "react";
import Card from "./Card";

export interface CardStackProps {
  id: number;
}

export default function CardStack(props: CardStackProps) {
  // TODO:
  return (
    <>
      {[
        props.id + 1,
        props.id + 2,
        props.id + 3,
        props.id + 4,
        props.id + 5,
      ].map((i) => {
        return (
          <Card
            key={i}
            id={1}
            title="3D Engine"
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            flag="js"
            desc="Yet another Minecraft clone"
          />
        );
      })}
    </>
  );
}
