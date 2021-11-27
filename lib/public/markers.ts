import { HtmlMarkers } from "../../config/placeholder";
import { FileData } from "../../types/api";

const Parser = {
  "text/javascript": (file: FileData) => {
    const script = document.createElement("script");
    script.defer = true;
    script.type = file.type;
    script.src = `${HtmlMarkers.FILE_SERVER}/${HtmlMarkers.PROJECT_NAME}/${
      file.role
    }/${file.path ?? ""}${file.name}`;
    return { id: HtmlMarkers.HEADER, el: script };
  },

  "text/css": (file: FileData) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = `${HtmlMarkers.FILE_SERVER}/${HtmlMarkers.PROJECT_NAME}/${
      file.role
    }/${file.path ?? ""}${file.name}`;
    return { id: HtmlMarkers.HEADER, el: link };
  },
} as { [name: string]: (file: FileData) => { id: string; el: HTMLElement } };

export function parseHTML(html: string, files: FileData[]) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, "text/html");
  let element: { id: string; el: HTMLElement } | null = null;

  for (let i in files) {
    if (!(files[i].type in Parser)) continue;
    element = Parser[files[i].type](files[i]);
    doc.getElementById(element.id)?.appendChild(element.el);
  }

  if (!element) return "";

  // TODO: Add Beatify to html
  return "<!DOCTYPE html>" + doc.documentElement.outerHTML;
}
