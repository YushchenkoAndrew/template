import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import DefaultFooter from "../../../components/default/DefaultFooter";
import DefaultHead from "../../../components/default/DefaultHead";
import DefaultNav from "../../../components/default/DefaultNav";
import { checkIfUserExist } from "../../../lib/api/session";
import { ProjectElement } from "../../../types/projects";
import { TreeObj } from "../../../types/tree";
import md5 from "../../../lib/md5";
import { basePath, voidUrl } from "../../../config";
import { DefaultRes } from "../../../types/request";
import { ApiRes, FileData, ProjectData } from "../../../types/api";
import Alert, { AlertProps } from "../../../components/Alert";
import { withIronSession } from "next-iron-session";
import { NextSessionArgs } from "../../../types/session";
import sessionConfig from "../../../config/session";
import {
  codeTemplate,
  formPlaceholder,
  treePlaceholder,
} from "../../../config/placeholder";
import { useRouter } from "next/dist/client/router";
import { LoadProjects } from "../../api/projects/load";
import { formPath, getPath } from "../../../lib/public/files";
import DefaultThumbnailPreview from "../../../components/admin/default/DefaultThumbnailPreview";
import DefaultFileStructure from "../../../components/admin/default/DefaultFileStructure";
import DefaultFooterPreview from "../../../components/admin/default/DefaultFooterPreview";
import { parseHTML } from "../../../lib/public/markers";

export type Event = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
// | ProjectElement;

export function formTree(
  tree: TreeObj,
  info: FileData,
  files?: FileData[]
): TreeObj {
  const path = [
    files?.[0]?.role || info.role,
    ...(info.path ?? "").split("/").filter((item) => item),
  ];
  return {
    ...tree,
    ...(function combine(
      prev: TreeObj | FileData | null,
      index: number = 0
    ): TreeObj {
      if (index === path.length) {
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
        [path[index]]: {
          ...(prev && !prev.name ? (prev as TreeObj)[path[index]] : prev ?? {}),
          ...combine(
            prev && !prev.name ? (prev as TreeObj)[path[index]] : prev,
            index + 1
          ),
        },
      };
    })(tree),
  };
}

export interface ProjectOperationProps {
  formData: ProjectData;
  treeStructure: TreeObj;
}

export default function ProjectOperation(props: ProjectOperationProps) {
  const router = useRouter();
  const [code, setCode] = useState(codeTemplate.JS);
  const refForm = useRef<HTMLFormElement | null>(null);
  const [validated, setValidated] = useState(false);
  const [formData, onFormChange] = useState(props.formData);
  const [treeStructure, onFileAdd] = useState(props.treeStructure);
  const [fileInfo, onFileInfoAdd] = useState({ role: "assets" } as FileData);
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

    if (name !== "flag") return;
    setCode(codeTemplate[value] || code);
  }

  function onFileInfoChange(event: Event) {
    setValidated(false);
    onFileInfoAdd({
      ...fileInfo,
      [event.target.name]: event.target.value,
    });
  }

  function onFilesUpload(event: ProjectElement) {
    if (!Array.isArray(event.target.value)) return;
    setValidated(false);

    let html = parseHTML(code, event.target.value);
    if (html) setCode(html);

    return onFileAdd(
      formTree(treeStructure, fileInfo, event.target.value as FileData[])
    );
  }

  function onNewLinkAdd(data: { [name: string]: string }): boolean {
    if (!data["name"] || data["link"] === undefined) return false;
    onLinksChange({ ...links, [data["name"]]: data["link"] });
    return true;
  }

  //
  //  Cache part
  //
  useEffect(() => {
    const cacheId = md5(
      (localStorage.getItem("salt") ?? "") + (localStorage.getItem("id") ?? "")
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
          .then((data: ApiRes<ProjectData[]>) => {
            if (data.status !== "OK" || !data.result.length) return;
            console.log(data);

            return onFormChange({
              ...formData,
              ...data.result[0],
            });
          })
          .catch((err) => null);
      })
      .catch((err) => null);
  }, []);

  function onDataCache(event: Event) {
    const cacheId = md5(
      (localStorage.getItem("salt") ?? "") + (localStorage.getItem("id") ?? "")
    );
    fetch(`${basePath}/api/admin/projects/cache?id=${cacheId}`, {
      method: "POST",
      body: JSON.stringify(getData()),
    })
      .then((res) => console.log(res.status))
      .catch((err) => null);
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    //  Test if file
    const templateFile = new File(
      [
        new Blob([code], {
          type: formData.flag === "JS" ? "text/html" : "text/markdown",
        }),
      ],
      formData.flag === "JS" ? "index.html" : "index.md",
      {
        type: formData.flag === "JS" ? "text/html" : "text/markdown",
      }
    );

    let reader = new FileReader();
    reader.readAsText(templateFile);

    reader.onload = () => console.log(reader.result);
    reader.onerror = () => console.log(reader.error);

    event?.preventDefault();
    if (!event?.currentTarget?.checkValidity()) {
      setValidated(true);
      return;
    }

    const cacheId = md5(
      (localStorage.getItem("salt") ?? "") + (localStorage.getItem("id") ?? "")
    );
    fetch(`${basePath}/api/admin/projects?id=${cacheId}`, {
      method: router.query.operation === "add" ? "POST" : "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(getData()),
    })
      .then((res) => res.json())
      .then((data: DefaultRes<ProjectData[]>) => {
        if (data.status !== "OK" || !data.result?.length || !data.result[0]) {
          return resHandler(data);
        }

        // TODO: Add Markdown file
        // TODO: To add Template file !!!
        ((treeStructure.template as TreeObj)["index.html"] as FileData).file =
          new File([new Blob([code], { type: "text/html" })], "index.html", {
            type: "text/html",
          });

        const { id } = data.result[0];
        (function parseTree(tree: TreeObj | FileData | null) {
          if (!tree) return;
          if (tree.name && tree.file) {
            const data = new FormData();
            data.append("file", tree.file as File);
            return fetch(
              `${basePath}/api/admin/file?id=${id}&project=${
                formData.name
              }&role=${tree.role}${getPath(tree.path as string | undefined)}`,
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

        fetch(`${basePath}/api/admin/link?id=${id}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(links),
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
    refForm.current?.scrollIntoView({ behavior: "smooth" });
    onAlert({
      state: data.status === "OK" ? "alert-success" : "alert-danger",
      title: data.status === "OK" ? "Success" : "Error",
      note: data.message ?? "Backend error",
    });
  }

  function resErrHandler() {
    refForm.current?.scrollIntoView({ behavior: "smooth" });
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
      <form
        ref={refForm}
        className={`container needs-validation ${
          validated ? "was-validated" : ""
        } mt-4`}
        noValidate
        onSubmit={onSubmit as FormEventHandler<HTMLFormElement>}
      >
        <Alert
          state={alert.state}
          title={alert.title}
          note={alert.note}
          onClose={() => onAlert({} as AlertProps)}
        />
        <DefaultThumbnailPreview
          thumbnail={
            treeStructure.thumbnail?.[Object.keys(treeStructure.thumbnail)[0]]
          }
          formData={formData}
          onChange={onThumbnailChange}
          onUpload={onFilesUpload}
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
            onCodeChange={(code: string) => setCode(code)}
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

  const params = new URLSearchParams((req.url ?? "").split("?")[1] ?? "");
  if (params.get("type") === "edit") {
    if (!params.get("name")) return { notFound: true };

    const { send } = await LoadProjects<ProjectData>({
      name: params.get("name") ?? "",
    });
    if (send.status === "ERR" || !send.result?.length) {
      return { notFound: true };
    }

    let thumbnail = {} as FileData;
    let treeStructure = treePlaceholder;
    const project = send.result[0];

    for (let i in project.files) {
      const file = project.files[i];
      if (project.files[i].role === "thumbnail") thumbnail = project.files[i];
      treeStructure = formTree(treeStructure, file, [file]);
    }

    return {
      props: {
        formData: {
          ...project,
          img: {
            ...thumbnail,
            url: `${voidUrl}/${project.name}${formPath(thumbnail)}`,
          },
        },

        treeStructure,
      } as ProjectOperationProps,
    };
  }

  return {
    props: {
      formData: formPlaceholder,
      treeStructure: treePlaceholder,
    } as ProjectOperationProps,
  };
},
sessionConfig);
