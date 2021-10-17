import React, { useEffect, useState } from "react";
import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import InputValue from "../../../components/Inputs/InputValue";
import DefaultFooter from "../../../components/default/DefaultFooter";
import DefaultHead from "../../../components/default/DefaultHead";
import DefaultNav from "../../../components/default/DefaultNav";
import defaultServerSideHandler from "../../../lib/session";
import {
  ProjectElement,
  ProjectFields,
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
import md5 from "../../../lib/md5";
import { basePath } from "../../../config";
import { DefaultRes } from "../../../types/request";
import { ProjectData } from "../../../types/api";
import Alert, { AlertProps } from "../../../components/Alert";
import DefaultProjectInfo from "../../../components/default/DefaultProjectInfo";

const placeholder = {
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
} as ProjectForm;

const formPlaceholder = {
  name: "",
  flag: "js",
  title: "",
  desc: "",
  note: "",
  link: "",
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

// TODO: Add another description for the footer !!!
export default function AdminHome() {
  const [err, onError] = useState({} as { [name: string]: boolean });
  const [formData, onFormChange] = useState(formPlaceholder);
  const [treeStructure, onFileAdd] = useState(treePlaceholder);
  const [fileInfo, onFileInfoAdd] = useState({ role: "assets" } as ProjectFile);
  const [alert, onAlert] = useState({ state: "alert-success" } as AlertProps);

  function onThumbnailChange(event: Event) {
    const { name, value } = event.target;
    onFormChange({
      ...formData,
      [name]: value
        ? name === "name"
          ? (value as string).replace(" ", "")
          : value
        : undefined,
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

  function checkOnError(update: boolean = true): boolean {
    let flags = {
      name: !formData.name,
      title: !formData.title,
      desc: !formData.desc,
      note: !formData.desc,
      img: !formData.img,
      link: !formData.link,
    };

    if (update) onError(flags);
    for (let err of Object.values(flags)) if (err) return true;
    return false;
  }

  //
  //  Cache part
  //
  useEffect(() => {
    const cacheId = md5(
      localStorage.getItem("salt") ?? "" + localStorage.getItem("id") ?? ""
    );
    fetch(`${basePath}/api/admin/projects/cache?id=${cacheId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data: DefaultRes) => {
        if (data.status === "ERR") return;
        onFormChange({
          ...formData,
          name: data.result.name || formData.name,
          flag: data.result.flag || formData.flag,
          title: data.result.title || formData.title,
          desc: data.result.desc || formData.desc,
          note: data.result.note || formData.note,
          link: data.result.link || formData.link,
        });
      })
      .catch((err) => null);
  }, []);

  function onDataCache(event: Event) {
    const cacheId = md5(
      localStorage.getItem("salt") ?? "" + localStorage.getItem("id") ?? ""
    );
    fetch(`${basePath}/api/admin/projects/cache?id=${cacheId}`, {
      method: "POST",
      body: JSON.stringify({
        name: formData.name,
        flag: formData.flag,
        title: formData.title,
        desc: formData.desc,
        note: formData.note,
        link: formData.link,
      }),
    })
      .then((res) => console.log(res.status))
      .catch((err) => null);
  }

  return (
    <>
      <DefaultHead>
        <title>Admin</title>
      </DefaultHead>
      <DefaultHeader />
      <Alert state={alert.state} title={alert.title} note={alert.note} />

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
            <h4 className="font-weight-bold mb-3">Thumbnail</h4>
            <InputTemplate label="Name">
              <InputName
                char="@"
                name="name"
                value={formData.name}
                error={err.name}
                placeholder={placeholder.name}
                onChange={onThumbnailChange}
                onBlur={onDataCache}
              />
            </InputTemplate>

            <InputTemplate label="Title">
              <InputValue
                name="title"
                value={formData.title}
                error={err.title}
                placeholder={placeholder.title}
                onChange={onThumbnailChange}
                onBlur={onDataCache}
              />
            </InputTemplate>

            <InputTemplate label="Description">
              <InputText
                name="desc"
                value={formData.desc}
                error={err.desc}
                placeholder={placeholder.desc}
                onChange={onThumbnailChange}
                onBlur={onDataCache}
              />
            </InputTemplate>

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
                <h4 className="font-weight-bold mb-3">
                  Projects Files Structure
                </h4>
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
                    value={fileInfo.dir ?? ""}
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
          <div className="col-md-11 ">
            <h4 className="font-weight-bold mb-3">Footer</h4>
            <InputTemplate label="Note">
              <InputText
                name="note"
                value={formData.note}
                error={err.note}
                placeholder={placeholder.note}
                onChange={onThumbnailChange}
                onBlur={onDataCache}
              />
            </InputTemplate>

            {/* TODO: Use List element instead !!! */}
            <InputTemplate label="Link">
              <InputName
                char="http://"
                name="link"
                value={formData.link}
                error={err.link}
                placeholder={placeholder.link}
                onChange={onThumbnailChange}
                onBlur={onDataCache}
              />
            </InputTemplate>

            <DefaultFooter name={formData.name}>
              <DefaultProjectInfo
                href={formData.link || "#"}
                links={[
                  {
                    href: "https://github.com/YushchenkoAndrew/template/tree/master/CDump/CodeRain",
                    lang: "C++",
                  },
                ]}
                description={formData.note || placeholder.note}
              />
            </DefaultFooter>
          </div>
        </div>

        {/* <hr /> */}
        <div className="d-flex justify-content-center mb-3">
          <button
            className={`btn btn-lg w-75 ${
              checkOnError(false) ? "btn-outline-success" : "btn-success"
            }`}
            onClick={() => {
              if (checkOnError()) return;

              const cacheId = md5(
                localStorage.getItem("salt") ??
                  "" + localStorage.getItem("id") ??
                  ""
              );
              fetch(`${basePath}/api/admin/projects?id=${cacheId}`, {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  name: formData.name,
                  flag: formData.flag,
                  title: formData.title,
                  desc: formData.desc,
                  note: formData.note,
                  link: formData.link,
                }),
              })
                .then((res) => res.json())
                .then((data: DefaultRes) => {
                  if (
                    data.status !== "OK" ||
                    !(data.result as ProjectData[]).length ||
                    !(data.result as ProjectData[])[0]
                  ) {
                    onAlert({
                      state: "alert-danger",
                      title: "Error",
                      note: data.message ?? "Backend error",
                    });
                    return;
                  }

                  const { ID } = (data.result as ProjectData[])[0];
                  (function parseTree(tree: TreeObj | ProjectFile | null) {
                    if (!tree) return;
                    if (tree.name) {
                      const data = new FormData();
                      data.append("file", (tree as ProjectFile).file);
                      return (
                        fetch(
                          `${basePath}/api/admin/file?id=${ID}&project=${
                            formData.name
                          }&role=${tree.role}${
                            tree.dir
                              ? "&dir=" +
                                ((tree as ProjectFile).dir?.[0] !== "/"
                                  ? "/" + tree.dir
                                  : tree.dir)
                              : ""
                          }`,
                          {
                            method: "POST",
                            body: data,
                          }
                        )
                          // TODO: Show something on Success !!!!
                          .then((res) => res.json())
                          .then((data: DefaultRes) => {
                            onAlert({
                              state:
                                data.status === "OK"
                                  ? "alert-success"
                                  : "alert-danger",
                              title: data.status === "OK" ? "Success" : "Error",
                              note: data.message ?? "Backend error",
                            });
                          })
                          .catch((err) => {
                            onAlert({
                              state: "alert-danger",
                              title: "Backend error",
                              note: "Something wrong happened on backend side. You should check server logs",
                            });
                          })
                      );
                    }

                    Object.entries(tree).forEach(([name, value]) =>
                      parseTree(value)
                    );
                  })(treeStructure);
                })
                .catch((err) => {
                  onAlert({
                    state: "alert-danger",
                    title: "Backend error",
                    note: "Something wrong happened on backend side. You should check server logs",
                  });
                });
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
