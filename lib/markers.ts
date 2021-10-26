import { fileServer } from "../config";
import { htmlMarkers, MarkerIndex } from "../config/placeholder";
import { ProjectFile } from "../types/projects";

export function restoreHtmlMarkers(code: string) {
  for (let i in htmlMarkers) {
    if (code.includes(htmlMarkers[i])) continue;
    for (let j = 0; j < htmlMarkers[i].length; j++) {
      let changedMarker =
        htmlMarkers[i].slice(0, j) + htmlMarkers[i].slice(j + 1);

      if (code.includes(changedMarker)) {
        return code.replace(changedMarker, htmlMarkers[i]);
      }
    }
  }

  return code;
}

export function addJsHtml(code: string, name: string, file: ProjectFile) {
  const lines = code.split("\n");

  let i = 0;
  for (; i < lines.length; i++) {
    if (lines[i].includes(htmlMarkers[MarkerIndex.JS])) break;
  }

  return (
    lines.slice(0, i).join("\n") +
    `\n  <script defer src="http://${fileServer}/files/${name}/${file.role}/${
      file.dir ?? ""
    }${file.name}" />\n` +
    lines.slice(i).join("\n")
  );
}

export function addCssHtml(code: string, name: string, file: ProjectFile) {
  const lines = code.split("\n");

  let i = 0;
  for (; i < lines.length; i++) {
    if (lines[i].includes(htmlMarkers[MarkerIndex.CSS])) break;
  }

  return (
    lines.slice(0, i).join("\n") +
    `\n  <link rel="preload" as="style" href="http://${fileServer}/files/${name}/${
      file.role
    }/${file.dir ?? ""}${file.name}" />\n` +
    lines.slice(i).join("\n")
  );
}
