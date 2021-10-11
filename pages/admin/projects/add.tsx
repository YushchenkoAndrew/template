import React, { useState } from "react";
import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import InputValue from "../../../components/Inputs/InputValue";
import DefaultFooter from "../../../components/default/DefaultFooter";
import DefaultHead from "../../../components/default/DefaultHead";
import DefaultNav from "../../../components/default/DefaultNav";
import defaultServerSideHandler from "../../../lib/session";
import {
  ProjectElement,
  ProjectFile,
  ProjectForm,
} from "../../../types/projects";

import { TreeObj } from "../../../types/tree";
import InputTemplate from "../../../components/Inputs/InputTemplate";
import InputName from "../../../components/Inputs/InputName";
import InputText from "../../../components/Inputs/InputText";
import Card from "../../../components/Card";
import InputFile from "../../../components/Inputs/InputFile";
import TreeView from "../../../components/TreeView/TreeView";
import InputRadio from "../../../components/Inputs/InputRadio";

const placeholder = {
  name: "CodeRain",
  title: "Code Rain",
  flag: "js",
  img: {
    name: "CodeRain.webp",
    type: "webp",
    role: "thumbnail",
    url: "/projects/img/CodeRain.webp",
  },
  desc: "Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes",
} as ProjectForm;

const treePlaceholder = {
  assets: {},
  src: {},
  thumbnail: {},
  styles: {},
  templates: {},
} as TreeObj;

export type Event =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | ProjectElement;

function formTree(
  tree: TreeObj,
  info: ProjectFile,
  files?: ProjectFile[]
): TreeObj {
  const dirs = [
    info.role,
    ...(info.dir ?? "").split("/").filter((item) => item),
  ];
  return {
    ...tree,
    ...(function combine(
      prev: TreeObj | ProjectFile | null,
      index: number = 0
    ): TreeObj {
      if (index === dirs.length) {
        if (!files) return {};
        return files.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.name]: curr,
          }),
          {} as TreeObj
        );
      }

      return {
        [dirs[index]]: {
          ...(prev && !prev.name ? (prev as TreeObj)[dirs[index]] : prev ?? {}),
          ...combine(
            prev && !prev.name ? (prev as TreeObj)[dirs[index]] : prev,
            index + 1
          ),
        },
      };
    })(tree),
  };
}

export default function AdminHome() {
  const [err, onError] = useState({} as { [name: string]: boolean });
  const [formData, onFormChange] = useState({ flag: "js" } as ProjectForm);
  const [treeStructure, onFileAdd] = useState(treePlaceholder);
  const [fileInfo, onFileInfoAdd] = useState({ role: "assets" } as ProjectFile);

  function onThumbnailChange(event: Event) {
    const { name, value } = event.target;
    onFormChange({
      ...formData,
      [name]: value ? value : undefined,
    });

    if (!(value as ProjectFile).name) return;
    onFileAdd(
      formTree(treeStructure, value as ProjectFile, [value] as ProjectFile[])
    );
  }

  function onFileInfoChange(event: Event) {
    onFileInfoAdd({
      ...fileInfo,
      [event.target.name]: event.target.value,
    });
  }

  function onFilesUpload(event: Event) {
    if (!Array.isArray(event.target.value)) return;
    return onFileAdd(
      formTree(treeStructure, fileInfo, event.target.value as ProjectFile[])
    );
  }

  function checkOnError(): boolean {
    let flags = {
      name: !formData.name,
      title: !formData.title,
      desc: !formData.desc,
      img: !formData.img,
      link: formData.flag === "link" && !formData.link,
    };

    onError(flags);
    for (let err of Object.values(flags)) if (err) return true;
    return false;
  }

  return (
    <>
      <DefaultHead>
        <title>Admin</title>
      </DefaultHead>
      <DefaultHeader />

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-5 order-md-2 mb-4">
            <Card
              img={formData.img?.url || (placeholder.img.url ?? "")}
              title={formData.title || placeholder.title}
              size="title-lg"
              href="#"
              description={formData.desc || placeholder.desc}
            />
          </div>
          <div className="col-md-7 order-md-1">
            {/* <h4 className="mb-3">Thumbnail</h4> */}
            <InputTemplate label="Name">
              <InputName
                char="@"
                name="name"
                error={err.name}
                placeholder={placeholder.name}
                onChange={onThumbnailChange}
              />
            </InputTemplate>

            <InputTemplate label="Title">
              <InputValue
                name="title"
                error={err.title}
                placeholder={placeholder.title}
                onChange={onThumbnailChange}
              />
            </InputTemplate>

            <InputTemplate label="Description">
              <InputText
                name="desc"
                error={err.desc}
                placeholder={placeholder.desc}
                onChange={onThumbnailChange}
              />
            </InputTemplate>

            {formData.flag === "link" ? (
              <InputTemplate label="Link">
                <InputName
                  char="http://"
                  name="link"
                  error={err.link}
                  placeholder="github.com/YushchenkoAndrew/template/tree/master/JS/CodeRain"
                  onChange={onThumbnailChange}
                />
              </InputTemplate>
            ) : (
              <span />
            )}

            <div className="input-group d-flex justify-content-between">
              <InputTemplate label="Image">
                <InputFile
                  name="img"
                  role="thumbnail"
                  type="image/*"
                  error={err.img}
                  onChange={onThumbnailChange}
                />
              </InputTemplate>

              <InputTemplate label="Flag">
                <InputRadio
                  name="flag"
                  options="js c++ link"
                  label="btn-outline-secondary"
                  onChange={onThumbnailChange}
                />
              </InputTemplate>
            </div>
          </div>
        </div>
        {formData.flag === "link" ? (
          <span />
        ) : (
          <>
            <hr />
            <div className="row">
              <div className="col-md-6 order-md-1 mb-4">
                <h4 className="mb-3">Project's Files Structure</h4>
                <TreeView
                  name={formData.name || placeholder.name}
                  role={fileInfo.role}
                  dir={fileInfo.dir}
                  projectTree={formTree(treeStructure, fileInfo)}
                />
              </div>
              <div className="col-md-6 order-md-2">
                <InputTemplate label="Role">
                  <div className="input-group">
                    <InputRadio
                      name="role"
                      options="assets src styles template"
                      onChange={onFileInfoChange}
                    />
                  </div>
                </InputTemplate>

                <InputTemplate label="Directory">
                  <InputValue
                    name="dir"
                    placeholder="/lua/"
                    onChange={onFileInfoChange}
                  />
                </InputTemplate>

                <InputTemplate label="File">
                  <InputFile
                    name="img"
                    role={fileInfo.role}
                    multiple
                    onChange={onFilesUpload}
                  />
                </InputTemplate>
              </div>
            </div>
          </>
        )}
        <hr />
        <div className="d-flex justify-content-center mb-3">
          <button
            className="btn btn-success btn-lg w-75"
            onClick={() => {
              if (checkOnError()) return;
            }}
          >
            Submit
          </button>
        </div>
      </div>

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}

export const getServerSideProps = defaultServerSideHandler;
