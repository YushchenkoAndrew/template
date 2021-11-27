import { basePath } from ".";
import { FileData, ProjectData } from "../types/api";
import { TreeObj } from "../types/tree";

export const ProjectInfo = {
  name: "CodeRain",
  title: "Code Rain",
  flag: "JS",
  img: {
    name: "CodeRain.webp",
    type: "webp",
    role: "thumbnail",
    url: `${basePath}/img/CodeRain.webp`,
  },
  desc: "Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes",
  note: "Creating a 'Code Rain' effect from Matrix. As funny joke you can put any text to display at the end.",
  link: "github.com/YushchenkoAndrew/template/tree/master/JS/CodeRain",
};

export const formPlaceholder = {
  name: "",
  flag: "JS",
  title: "",
  desc: "",
  note: "",
} as ProjectData;

export const treePlaceholder = {
  assets: {},
  src: {},
  thumbnail: {},
  styles: {},
  template: {
    "index.html": {
      name: "index.html",
      role: "template",
      type: "text/html",
    } as FileData,
  },
} as TreeObj;

export const HtmlMarkers = {
  HEADER: "HEADER",
  BODY: "BODY",
  FOOTER: "FOOTER",

  FILE_SERVER: "{{FILE_SERVER}}",
  PROJECT_NAME: "{{PROJECT_NAME}}",
};

export const codeTemplate = {
  JS: `<!DOCTYPE html>
<html>
  <body>
    <div id="${HtmlMarkers.HEADER}">
    </div>

    <div id="${HtmlMarkers.BODY}">
      <canvas class="emscripten" id="canvas"></canvas>
    </div>

    <div id="${HtmlMarkers.FOOTER}">
    </div>
  </body>
</html>`,

  Markdown: `# Project name

Article text...

## Used material
* [Main Page](https://mortis-grimreaper.ddns.net/projects)
`,
};
