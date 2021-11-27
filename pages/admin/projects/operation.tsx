import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import DefaultFooter from "../../../components/default/DefaultFooter";
import DefaultHead from "../../../components/default/DefaultHead";
import DefaultNav from "../../../components/default/DefaultNav";
import { checkIfUserExist } from "../../../lib/api/session";
import { ProjectElement } from "../../../types/projects";
import { TreeObj } from "../../../types/tree";
import { basePath, voidUrl } from "../../../config";
import { DefaultRes } from "../../../types/request";
import { FileData, ProjectData } from "../../../types/api";
import { withIronSession } from "next-iron-session";
import { NextSessionArgs } from "../../../types/session";
import sessionConfig from "../../../config/session";
import {
  codeTemplate,
  formPlaceholder,
  treePlaceholder,
} from "../../../config/placeholder";
import { LoadProjects } from "../../api/projects/load";
import { formPath, getPath } from "../../../lib/public/files";
import DefaultThumbnailPreview from "../../../components/admin/default/DefaultThumbnailPreview";
import DefaultFileStructure from "../../../components/admin/default/DefaultFileStructure";
import DefaultFooterPreview from "../../../components/admin/default/DefaultFooterPreview";
import { parseHTML } from "../../../lib/public/markers";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastDefault } from "../../../config/alert";
import { CacheId } from "../../../lib/public";
import { LoadFile } from "../../api/file/load";

export type Event = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

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
  type: string;
  formData: ProjectData;
  treeStructure: TreeObj;
  template: string;
  links: { [name: string]: string };
}

export default function ProjectOperation(props: ProjectOperationProps) {
  const [code, setCode] = useState(props.template);
  const refForm = useRef<HTMLFormElement | null>(null);
  const [validated, setValidated] = useState(false);
  const [formData, onFormChange] = useState(props.formData);
  const [treeStructure, onFileAdd] = useState(props.treeStructure);
  const [fileInfo, onFileInfoAdd] = useState({ role: "assets" } as FileData);
  const [links, onLinksChange] = useState(props.links);

  function onThumbnailChange(event: Event) {
    setValidated(false);
    onFormChange({
      ...formData,
      [event.target.name]: event.target.value,
    });
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

    const html = parseHTML(code, event.target.value);
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
    fetch(`${basePath}/api/projects/cache?id=${CacheId(props.type)}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data: DefaultRes) => {
        if (data.status !== "OK") return;
        onFormChange({
          ...formData,
          ...data.result,
        });
      })
      .catch((err) => null);
  }, []);

  function onDataCache(event: Event) {
    fetch(`${basePath}/api/projects/cache?id=${CacheId(props.type)}`, {
      method: "POST",
      body: JSON.stringify(formData),
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

    const toastProjectId = toast.loading("Please wait...");
    fetch(`${basePath}/api/projects/${props.type}?id=${CacheId(props.type)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data: DefaultRes<ProjectData[]>) => {
        if (data.status !== "OK" || !data.result?.length || !data.result[0]) {
          return toast.update(toastProjectId, {
            render: `Project: ${data.message}`,
            type: "error",
            isLoading: false,
            ...ToastDefault,
          });
        }

        toast.update(toastProjectId, {
          render: "Project: Record is created",
          type: "success",
          isLoading: false,
          ...ToastDefault,
        });

        if (codeTemplate[formData.flag]) {
          (
            (treeStructure.template as TreeObj)[
              codeTemplate[formData.flag].name
            ] as FileData
          ).file = new File(
            [new Blob([code], { type: codeTemplate[formData.flag].type })],
            codeTemplate[formData.flag].name,
            { type: codeTemplate[formData.flag].type }
          );
        }

        const { id } = data.result[0];
        (function parseTree(tree: TreeObj | FileData | null) {
          if (!tree) return;
          // TODO: Think about this !!
          // console.log("FILE");
          // console.log(tree);

          if (tree.name && tree.file) {
            const toastFileId = toast.loading("Please wait...");
            const data = new FormData();
            data.append("file", tree.file as File);
            return fetch(
              `${basePath}/api/file/add?id=${id}&project=${
                formData.name
              }&role=${tree.role}${getPath(tree.path as string | undefined)}`,
              {
                method: "POST",
                body: data,
              }
            )
              .then((res) => res.json())
              .then((data: DefaultRes) => {
                toast.update(toastFileId, {
                  render: `File [${tree.name}]: ${data.message}`,
                  type: data.status === "OK" ? "success" : "error",
                  isLoading: false,
                  ...ToastDefault,
                });
              })
              .catch(() => {
                toast.update(toastFileId, {
                  render: `File [${tree.name}]: crashed at upload`,
                  type: "error",
                  isLoading: false,
                  ...ToastDefault,
                });
              });
          }

          // FIXME:
          // Object.entries(tree).forEach(([name, value]) => parseTree(value));
        })(treeStructure);

        const toastLinkId = toast.loading("Please wait...");
        fetch(`${basePath}/api/link/${props.type}?id=${id}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(links),
        })
          .then((res) => res.json())
          .then((data: DefaultRes) => {
            toast.update(toastLinkId, {
              render: `Link: ${data.message}`,
              type: data.status === "OK" ? "success" : "error",
              isLoading: false,
              ...ToastDefault,
            });
          })
          .catch(() => {
            toast.update(toastLinkId, {
              render: "Link: Server error",
              type: "error",
              isLoading: false,
              ...ToastDefault,
            });
          });
      })
      .catch(() => {
        toast.update(toastProjectId, {
          render: "Project: Server error",
          type: "error",
          isLoading: false,
          ...ToastDefault,
        });
      });

    return false;
  };

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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          transition={Bounce}
          closeOnClick
          rtl={false}
          draggable
        />
        <DefaultThumbnailPreview
          projectTree={treeStructure}
          formData={formData}
          setCode={setCode}
          onFileChange={onFileAdd}
          onChange={onThumbnailChange}
          onUpload={onFilesUpload}
          onBlur={onDataCache}
        />

        {formData.flag === "Link" ? (
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

  let type;
  const params = new URLSearchParams((req.url ?? "").split("?")[1] ?? "");
  if ((type = params.get("type")) === "edit") {
    if (!params.get("name")) return { notFound: true };

    const template = await LoadFile({
      project: params.get("name") ?? "",
      role: "template",
    });

    const { send } = await LoadProjects<ProjectData>({
      name: params.get("name") ?? "",
    });
    if (send.status === "ERR" || !send.result?.length) {
      return { notFound: true };
    }

    let treeStructure = treePlaceholder;
    const project = send.result[0];

    for (let i in project.files) {
      let file = project.files[i];
      file.url = `${voidUrl}/${project.name}${formPath(file)}`;
      treeStructure = formTree(treeStructure, file, [file]);
    }

    return {
      props: {
        type,
        formData: project,
        treeStructure,
        template: template.send.result,
        links: project.links.reduce(
          (acc, { name, link }) => ({ ...acc, [name]: link }),
          {}
        ),
      } as ProjectOperationProps,
    };
  }

  return {
    props: {
      type,
      formData: formPlaceholder,
      treeStructure: treePlaceholder,
      template: codeTemplate.JS.code,
      links: { main: "" },
    } as ProjectOperationProps,
  };
},
sessionConfig);
