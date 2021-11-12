import { HtmlMarkers } from "../config/placeholder";
import { ProjectFile } from "../types/projects";

const Parser = {
  "text/javascript": (file: ProjectFile) => {
    const script = document.createElement("script");
    script.defer = true;
    script.type = file.type;
    script.src = `${HtmlMarkers.FILE_SERVER}/${
      HtmlMarkers.PROJECT_NAME
    }/${file.role}/${file.dir ?? ""}${file.name}`;
    return { id: HtmlMarkers.JS, el: script };
  },

  "text/css": (file: ProjectFile) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = `${HtmlMarkers.FILE_SERVER}/${
      HtmlMarkers.PROJECT_NAME
    }/${file.role}/${file.dir ?? ""}${file.name}`;
    return { id: HtmlMarkers.CSS, el: link };
  },
} as { [name: string]: (file: ProjectFile) => { id: string; el: HTMLElement } };

export function parseHTML(html: string, files: ProjectFile[]) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, "text/html");

  for (let i in files) {
    const { id, el } = Parser[files[i].type]?.(files[i]) ?? {
      id: "",
      el: null,
    };
    if (!id) continue;
    doc.getElementById(id)?.appendChild(el);
  }

  // TODO: Add Beatify to html
  return "<!DOCTYPE html>" + doc.documentElement.outerHTML;
}
