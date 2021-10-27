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
      // file: new Blob([""], { type: "text/html" }),
    } as ProjectFile,
  },
} as TreeObj;

export const htmlMarkers = [
  "<!--{{JS_FILE}}-->",
  "<!--{{CSS_FILE}}-->",
  "<!--{{FLAG}}-->",
  "<!--{{FILE_SERVER}}-->",
  "<!--{{PROJECT_NAME}}-->",
];

export enum MarkerIndex {
  JS,
  CSS,
  FLAG,
  FILE_SERVER,
  PROJECT_NAME,
}

export const codeTemplate = `<!DOCTYPE html>
<html>
  <head>

  ${htmlMarkers[MarkerIndex.CSS]}

  ${htmlMarkers[MarkerIndex.JS]}

  </head>

  <body>

  ${htmlMarkers[MarkerIndex.FLAG]}

  </body>
</html>`;

export const projectFlags = ["js", "c++", "link"];
export enum FlagIndex {
  JS,
  C,
  LINK,
}

export const flagTemplate = [``, ``, ``];
