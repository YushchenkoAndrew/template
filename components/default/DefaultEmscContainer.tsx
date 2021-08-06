import React from "react";

export interface DefaultEmscContainerProps {
  canvas?: string;
  height?: number;
  width?: number;
  children?: React.ReactNode;
}

export default function DefaultEmscContainer(props: DefaultEmscContainerProps) {
  return (
    <main role="main">
      <div className="jumbotron  mx-auto bg-white" id="CanvasContainer0">
        <canvas
          className={"emscripten " + (props.canvas ?? "")}
          id="canvas"
          onContextMenu={(event) => event.preventDefault()}
          tabIndex={-1}
          height={props.height ?? 700}
          width={props.width ?? 700}
        ></canvas>
      </div>
      {props.children}
    </main>
  );
}
