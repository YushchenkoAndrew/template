import React from "react";
import { parse } from "node-html-parser";
import { HtmlMarkers } from "../../config/placeholder";
import { voidUrl } from "../../config";

export interface DefaultJsProjectProps {
  project: string;
  template: string;
}

export default function DefaultJsProject(props: DefaultJsProjectProps) {
  const doc = parse(
    props.template
      .replace(new RegExp(HtmlMarkers.FILE_SERVER, "g"), voidUrl)
      .replace(new RegExp(HtmlMarkers.PROJECT_NAME, "g"), props.project)
  );

  return (
    <>
      <div
        id={HtmlMarkers.HEADER}
        dangerouslySetInnerHTML={{
          __html:
            doc.querySelector("#" + HtmlMarkers.HEADER)?.childNodes?.join("") ??
            "",
        }}
      ></div>

      <main role="main">
        <div
          className="jumbotron mx-auto bg-white"
          id="CanvasContainer0"
          dangerouslySetInnerHTML={{
            __html:
              doc.querySelector("#" + HtmlMarkers.BODY)?.childNodes?.join("") ??
              "",
          }}
        ></div>
      </main>

      <div
        id={HtmlMarkers.FOOTER}
        dangerouslySetInnerHTML={{
          __html:
            doc.querySelector("#" + HtmlMarkers.FOOTER)?.childNodes?.join("") ??
            "",
        }}
      ></div>
    </>
  );
}
