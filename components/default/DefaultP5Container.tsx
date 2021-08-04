import React from "react";

export interface DefaultP5ContainerProps {
  children?: React.ReactNode;
}

export default function DefaultP5Container(props: DefaultP5ContainerProps) {
  return (
    <main role="main">
      <div className="jumbotron bg-white" id="CanvasContainer0"></div>
      {props.children}
    </main>
  );
}
