import React from "react";
import { marked } from "marked";

export interface DefaultMarkdownProjectProps {
  project: string;
  template: string;
}

export default function DefaultMarkdownProject(
  props: DefaultMarkdownProjectProps
) {
  return (
    <>
      <main role="main">
        <div
          className="jumbotron container bg-white"
          id="CanvasContainer0"
          dangerouslySetInnerHTML={{
            __html: marked.parse(props.template),
          }}
        ></div>
      </main>
    </>
  );
}
