import React, { useEffect, useState } from "react";
import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import InputValue from "../../../components/Inputs/InputValue";
import DefaultFooter from "../../../components/default/DefaultFooter";
import DefaultHead from "../../../components/default/DefaultHead";
import DefaultNav from "../../../components/default/DefaultNav";
import { checkIfUserExist } from "../../../lib/session";
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
import md5 from "../../../lib/md5";
import { basePath } from "../../../config";
import { DefaultRes } from "../../../types/request";
import { ApiError, ApiRes, ProjectData } from "../../../types/api";
import Alert, { AlertProps } from "../../../components/Alert";
import DefaultProjectInfo from "../../../components/default/DefaultProjectInfo";
import { withIronSession } from "next-iron-session";
import { NextSessionArgs } from "../../../types/session";
import sessionConfig from "../../../config/session";
import { ProjectInfo } from "../../../config/placeholder";
import InputList from "../../../components/Inputs/InputDoubleList";
import { useRouter } from "next/dist/client/router";

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

export interface ProjectOperationProps {
  formData: ProjectForm;
  treeStructure: TreeObj;
}

export default function ProjectOperation(props: ProjectOperationProps) {
  const router = useRouter();
  const [err, onError] = useState({} as { [name: string]: boolean });
  const [formData, onFormChange] = useState(props.formData);
  const [treeStructure, onFileAdd] = useState(props.treeStructure);
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
        if (data.status === "OK") {
          return onFormChange({
            ...formData,
            ...data.result,
          });
        }

        if (router.query.operation !== "edit" || !router.query.id) return;
        fetch(`${basePath}/api/projects/load?id=${router.query.id}`)
          .then((res) => res.json())
          .then((data: ApiRes<ProjectData>) => {
            if (data.status !== "OK" || !data.result.length) return;
            console.log(data);

            return onFormChange({
              ...formData,
              name: data.result[0].Name,
              title: data.result[0].Title,
              flag: data.result[0].Flag,
              desc: data.result[0].Desc,
              note: data.result[0].Note,
            });
            // return resolve((data as ApiRes).result as ProjectData[]);
          })
          .catch((err) => null);
      })
      .catch((err) => null);
  }, []);

  function onDataCache(event: Event) {
    const cacheId = md5(
      localStorage.getItem("salt") ?? "" + localStorage.getItem("id") ?? ""
    );
    fetch(`${basePath}/api/admin/projects/cache?id=${cacheId}`, {
      method: "POST",
      body: JSON.stringify(getData()),
    })
      .then((res) => console.log(res.status))
      .catch((err) => null);
  }

  function getData() {
    return {
      name: formData.name,
      flag: formData.flag,
      title: formData.title,
      desc: formData.desc,
      note: formData.note,
      link: formData.link,
    };
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
              img={formData.img?.url || (ProjectInfo.img.url ?? "")}
              title={formData.title || ProjectInfo.title}
              size="title-lg"
              href="#"
              description={formData.desc || ProjectInfo.desc}
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
                placeholder={ProjectInfo.name}
                onChange={onThumbnailChange}
                onBlur={onDataCache}
              />
            </InputTemplate>

            <InputTemplate label="Title">
              <InputValue
                name="title"
                value={formData.title}
                error={err.title}
                placeholder={ProjectInfo.title}
                onChange={onThumbnailChange}
                onBlur={onDataCache}
              />
            </InputTemplate>

            <InputTemplate label="Description">
              <InputText
                name="desc"
                value={formData.desc}
                error={err.desc}
                placeholder={ProjectInfo.desc}
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
                  name={formData.name || ProjectInfo.name}
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
                placeholder={ProjectInfo.note}
                onChange={onThumbnailChange}
                onBlur={onDataCache}
              />
            </InputTemplate>

            <InputTemplate label="Link">
              <InputName
                char="http://"
                name="link"
                value={formData.link}
                error={err.link}
                placeholder={ProjectInfo.link}
                onChange={onThumbnailChange}
                onBlur={onDataCache}
              />
            </InputTemplate>

            {/* TODO: Use List element instead !!! */}
            <InputTemplate label="Links List">
              <InputList
                char="http://"
                name="link"
                value={formData.link}
                error={err.link}
                placeholder={ProjectInfo.link}
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
                description={formData.note || ProjectInfo.note}
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
                method: router.query.operation === "add" ? "POST" : "PUT",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(getData()),
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
                      return fetch(
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
                        });
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

export const getServerSideProps = withIronSession(async function ({
  req,
  res,
}: NextSessionArgs) {
  const sessionID = req.session.get("user");
  const isOk = await checkIfUserExist(sessionID);

  if (!sessionID || !isOk) {
    return {
      redirect: {
        basePath: false,
        destination: `${basePath}/admin/login`,
        permanent: false,
      },
    };
  }

  let url =
    "/" +
    (req.url ?? "")
      .split("?")[0]
      .split("/")
      .filter((item) => item)
      .join("/");

  switch (url) {
    case "/admin/projects/edit":
    case "/admin/projects/add": {
      return {
        props: {
          formData: {
            name: "",
            flag: "js",
            title: "",
            desc: "",
            note: "",
            link: "",
          } as ProjectForm,

          treeStructure: {
            assets: {},
            src: {},
            thumbnail: {},
            styles: {},
            templates: {},
          } as TreeObj,
        } as ProjectOperationProps,
      };
    }
  }

  return {
    notFound: true,
  };
},
sessionConfig);
