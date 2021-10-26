import React, { FormEventHandler, useEffect, useState } from "react";
import DefaultHeader from "../../../components/admin/default/DefaultHeader";
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
import md5 from "../../../lib/md5";
import { basePath, fileServer } from "../../../config";
import { DefaultRes } from "../../../types/request";
import { ApiRes, FileData, ProjectData } from "../../../types/api";
import Alert, { AlertProps } from "../../../components/Alert";
import { withIronSession } from "next-iron-session";
import { NextSessionArgs } from "../../../types/session";
import sessionConfig from "../../../config/session";
import {
  ProjectInfo,
  codeTemplate,
  formPlaceholder,
  treePlaceholder,
} from "../../../config/placeholder";
import { useRouter } from "next/dist/client/router";
import { LoadProjects } from "../../api/projects/load";
import {
  formPath,
  getDir,
  convertProject,
  convertFile,
} from "../../../lib/files";
import {
  addCssHtml,
  addJsHtml,
  restoreHtmlMarkers,
} from "../../../lib/markers";
import DefaultThumbnailPreview from "../../../components/admin/default/DefaultThumbnailPreview";
import DefaultFileStructure from "../../../components/admin/default/DefaultFileStructure";
import DefaultFooterPreview from "../../../components/admin/default/DefaultFooterPreview";

export type Event =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | ProjectElement;

export function formTree(
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
  const [code, setCode] = useState(codeTemplate);
  const [validated, setValidated] = useState(false);
  const [formData, onFormChange] = useState(props.formData);
  const [treeStructure, onFileAdd] = useState(props.treeStructure);
  const [fileInfo, onFileInfoAdd] = useState({ role: "assets" } as ProjectFile);
  const [alert, onAlert] = useState({ state: "alert-success" } as AlertProps);
  const [links, onLinksChange] = useState({} as { [name: string]: string });

  function onThumbnailChange(event: Event) {
    setValidated(false);

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
    setValidated(false);
    onFileInfoAdd({
      ...fileInfo,
      [event.target.name]: event.target.value,
    });
  }

  function onFilesUpload(event: Event) {
    if (!Array.isArray(event.target.value)) return;
    setValidated(false);

    for (let i in event.target.value) {
      switch (event.target.value[i].type) {
        case "text/javascript":
          setCode(
            addJsHtml(
              code,
              formData.name || ProjectInfo.name,
              event.target.value[i]
            )
          );
          break;

        case "text/css":
          setCode(
            addCssHtml(
              code,
              formData.name || ProjectInfo.name,
              event.target.value[i]
            )
          );
          break;
      }
    }

    return onFileAdd(
      formTree(treeStructure, fileInfo, event.target.value as ProjectFile[])
    );
  }

  function onNewLinkAdd(data: { [name: string]: string }): boolean {
    if (!data["name"] || !data["link"]) return false;
    onLinksChange({ ...links, [data["name"]]: data["link"] });
    return true;
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
              ...convertProject(data.result[0]),
            });
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

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault();
    if (!event?.currentTarget?.checkValidity()) {
      setValidated(true);
      return;
    }

    const cacheId = md5(
      localStorage.getItem("salt") ?? "" + localStorage.getItem("id") ?? ""
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
          return resHandler(data);
        }

        // TODO: To add Template file !!!
        const { ID } = (data.result as ProjectData[])[0];
        (function parseTree(tree: TreeObj | ProjectFile | null) {
          if (!tree) return;
          if (tree.name) {
            const data = new FormData();
            data.append("file", (tree as ProjectFile).file);
            return fetch(
              `${basePath}/api/admin/file?id=${ID}&project=${
                formData.name
              }&role=${tree.role}${getDir(tree.dir as string | undefined)}`,
              {
                method: "POST",
                body: data,
              }
            )
              .then((res) => res.json())
              .then(resHandler)
              .catch(resErrHandler);
          }

          Object.entries(tree).forEach(([name, value]) => parseTree(value));
        })(treeStructure);

        fetch(`${basePath}/api/admin/link?id=${ID}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...links, main: formData.link }),
        })
          .then((res) => res.json())
          .then(resHandler)
          .catch(resErrHandler);
      })
      .catch(resErrHandler);

    return false;
  };

  function getData() {
    return {
      name: formData.name,
      flag: formData.flag,
      title: formData.title,
      desc: formData.desc,
      note: formData.note,
    };
  }

  function resHandler(data: DefaultRes) {
    onAlert({
      state: data.status === "OK" ? "alert-success" : "alert-danger",
      title: data.status === "OK" ? "Success" : "Error",
      note: data.message ?? "Backend error",
    });
  }

  function resErrHandler() {
    onAlert({
      state: "alert-danger",
      title: "Backend error",
      note: "Something wrong happened on backend side. You should check server logs",
    });
  }

  return (
    <>
      <DefaultHead>
        <title>Admin</title>
      </DefaultHead>
      <DefaultHeader />
      <Alert state={alert.state} title={alert.title} note={alert.note} />
      <form
        className={`container needs-validation ${
          validated ? "was-validated" : ""
        } mt-4`}
        noValidate
        onSubmit={onSubmit as FormEventHandler<HTMLFormElement>}
      >
        <DefaultThumbnailPreview
          formData={formData}
          onChange={onThumbnailChange}
          onBlur={onDataCache}
        />

        {formData.flag === "link" ? (
          <span />
        ) : (
          <DefaultFileStructure
            code={code}
            formData={formData}
            fileInfo={fileInfo}
            projectTree={formTree(treeStructure, fileInfo)}
            onChange={onFileInfoChange}
            onCodeChange={(code: string) => setCode(restoreHtmlMarkers(code))}
            onUpload={onFilesUpload}
            onBlur={onDataCache}
          />
        )}

        <hr />
        <DefaultFooterPreview
          links={links}
          formData={formData}
          onChange={onThumbnailChange}
          onBlur={onDataCache}
          onLinkAdd={onNewLinkAdd}
          onLinkChange={onLinksChange}
        />

        <hr className="mb-5" />
        <div className="d-flex justify-content-center mb-3">
          <div className="col-md-9">
            <button
              type="submit"
              className="btn btn-lg w-100 btn-outline-success"
            >
              Submit
            </button>
          </div>
        </div>
      </form>

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

  const url =
    "/" +
    (req.url ?? "")
      .split("?")[0]
      .split("/")
      .filter((item) => item)
      .join("/");

  let treeStructure = treePlaceholder;

  switch (url) {
    case "/admin/projects/add": {
      return {
        props: {
          formData: formPlaceholder,
          treeStructure,
        } as ProjectOperationProps,
      };
    }

    case "/admin/projects/edit": {
      const params = new URLSearchParams((req.url ?? "").split("?")[1] ?? "");
      if (!params.get("name")) return { notFound: true };

      const { send } = await LoadProjects({ name: params.get("name") ?? "" });
      if (send.status === "ERR" || !send.result?.length) {
        return { notFound: true };
      }

      const project = send.result[0] as ProjectData;
      let thumbnail = {} as FileData;

      for (let i in project.Files) {
        const file = convertFile(project.Files[i]);
        if (project.Files[i].Role === "thumbnail") thumbnail = project.Files[i];
        treeStructure = formTree(treeStructure, file, [file]);
      }

      return {
        props: {
          formData: {
            ...convertProject(project),
            img: {
              ...convertFile(thumbnail),
              url: `http://${fileServer}/files/${project.Name}${formPath(
                thumbnail
              )}`,
            },
          },

          treeStructure,
        } as ProjectOperationProps,
      };
    }
  }

  return { notFound: true };
},
sessionConfig);
