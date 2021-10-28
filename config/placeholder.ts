import { basePath } from ".";
import { ProjectFile, ProjectForm } from "../types/projects";
import { TreeObj } from "../types/tree";

export const ProjectInfo = {
  name: "CodeRain",
  title: "Code Rain",
  flag: "js",
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
  flag: "js",
  title: "",
  desc: "",
  note: "",
  link: "",
} as ProjectForm;

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
    } as ProjectFile,
  },
} as TreeObj;

export const HtmlMarkers = {
  BODY: "BODY",
  FOOTER: "FOOTER",

  JS: "JS_FILES",
  CSS: "CSS_FILE",

  FILE_SERVER: "{{FILE_SERVER}}",
  PROJECT_NAME: "{{PROJECT_NAME}}",
};

export const codeTemplate = `<!DOCTYPE html>
<html>
  <body>
    <div id="${HtmlMarkers.CSS}">
    </div>

    <div id="${HtmlMarkers.JS}">
    </div>

    <div id="${HtmlMarkers.BODY}">
      <canvas class="emscripten" id="canvas"></canvas>
    </div>

    <div id="${HtmlMarkers.FOOTER}">
    </div>
  </body>
</html>`;
