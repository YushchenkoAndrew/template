import React, { useImperativeHandle, useState } from "react";
import { codeTemplate, ProjectInfo } from "../../../config/placeholder";
import { Event } from "../../../pages/admin/projects/operation";
import { TreeObj } from "../../../types/tree";
import InputFile from "../../Inputs/InputFile";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import TreeView from "../../TreeView/TreeView";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-coy.css";
import { FileData, ProjectData } from "../../../types/api";
import { ProjectElement } from "../../../types/projects";
import { parseHTML } from "../../../lib/public/markers";
import { PreviewRef } from "./Preview";
import { basePath, voidUrl } from "../../../config";
import { convertTypes, getPath } from "../../../lib/public/files";
import { DefaultRes } from "../../../types/request";
import { toast } from "react-toastify";
import { ToastDefault } from "../../../config/alert";

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
            [curr.name]: {
              ...curr,
              type: convertTypes[curr.type] ?? curr.type,
            },
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

export interface CodeViewProps {
  code: string;
  previewRef: React.RefObject<PreviewRef>;
  treeStructure: TreeObj;
  show?: boolean;
}

export interface CodeViewRef {
  code: string;
  treeStructure: TreeObj;
  onUpload: (event: ProjectElement) => void;
  setCode: (value: string) => void;
  onFileAdd: (value: TreeObj) => void;
  onSubmit: (data: ProjectData | undefined) => Promise<boolean>;
}

export default React.forwardRef((props: CodeViewProps, ref) => {
  const [code, setCode] = useState(props.code);
  const [fileInfo, onFileInfoAdd] = useState({ role: "assets" } as FileData);
  const [treeStructure, onFileAdd] = useState(props.treeStructure);
  const [fileName, onFileSelect] = useState("template/index.html");

  function onUpload(event: ProjectElement) {
    if (!Array.isArray(event.target.value)) return;
    // setValidated(false);

    const html = parseHTML(code, event.target.value);
    if (html) setCode(html);

    return onFileAdd(
      formTree(treeStructure, fileInfo, event.target.value as FileData[])
    );
  }

  useImperativeHandle<unknown, CodeViewRef>(ref, () => ({
    code,
    treeStructure,
    onUpload,
    onFileAdd,
    setCode,

    onSubmit(data: ProjectData | undefined) {
      const formData = props.previewRef?.current?.formData;
      if (!formData || !data) {
        return new Promise((resolve, reject) => reject(null));
      }

      const id = data.id || formData.id;
      if (codeTemplate[formData.flag ?? ""]) {
        (
          (treeStructure.template as TreeObj)[
            codeTemplate[formData.flag].name
          ] as FileData
        ).file = new File(
          [
            new Blob([code], {
              type: codeTemplate[formData.flag].type,
            }),
          ],
          codeTemplate[formData.flag].name,
          { type: codeTemplate[formData.flag].type }
        );
      }

      return (function parseTree(tree: TreeObj | FileData | null) {
        return new Promise(async (resolve, reject) => {
          // Check if obj is FileData and if File not exist then break
          if (!tree?.name || !tree.file) {
            if (tree && tree.name) return resolve(true);
            for (let [_, value] of Object.entries(tree || {})) {
              await parseTree(value);
            }
            return resolve(true);
          }

          const toastId = toast.loading("Please wait...");
          const data = new FormData();
          data.append("file", tree.file as File);

          return fetch(
            `${basePath}/api/file/add?id=${id}&project=${
              props.previewRef?.current?.formData?.name
            }&role=${tree.role}${getPath(tree.path as string | undefined)}${
              tree.id ? `&file_id=${tree.id}` : ""
            }`,
            {
              method: "POST",
              body: data,
            }
          )
            .then((res) => res.json())
            .then((data: DefaultRes) => {
              resolve(true);
              toast.update(toastId, {
                render: `File [${tree.name}]: ${data.message}`,
                type: data.status === "OK" ? "success" : "error",
                isLoading: false,
                ...ToastDefault,
              });
            })
            .catch(() => {
              reject({
                id: toastId,
                message: `File [${tree.name}]: crashed at upload`,
              });
            });
        });
      })(treeStructure);
    },
  }));

  function onFileInfoChange(event: Event) {
    // setValidated(false);
    onFileInfoAdd({
      ...fileInfo,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <div className={props.show ? "" : "d-none"}>
      <hr />
      <div className="row">
        <div className="col-md-7 order-md-1 mb-4">
          <h4 className="font-weight-bold mb-3">Projects Files Structure</h4>
          <TreeView
            name={props.previewRef?.current?.formData?.name || ProjectInfo.name}
            role={fileInfo.role}
            dir={fileInfo.path}
            projectTree={treeStructure}
            onFileSelect={(path) => {
              // FIXME: Use local voidUrl server ...
              fetch(
                `${voidUrl}/${
                  props.previewRef?.current?.formData?.name ?? ""
                }/${path}`
              )
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
              onFileSelect(path);
            }}
          />
        </div>
        <div className="col-md-5 order-md-2">
          <InputTemplate label="Role">
            <InputRadio
              name="role"
              options={["assets", "src", "styles", "kubernetes"]}
              onChange={onFileInfoChange}
            />
          </InputTemplate>

          <InputTemplate label="Directory">
            <InputValue
              name="path"
              className="rounded"
              value={fileInfo.path || ""}
              placeholder="/lua/"
              onChange={onFileInfoChange}
            />
          </InputTemplate>

          <InputTemplate label="File">
            <InputFile
              name="file"
              role={fileInfo.role}
              multiple
              onChange={onUpload}
            />
          </InputTemplate>
        </div>
      </div>

      <hr />
      <div className="d-flex justify-content-center mb-3">
        <div className="col-md-11">
          <div className="row">
            <h5 className="font-weight-bold mr-2">File:</h5>
            <p className="font-italic">{fileName}</p>
          </div>

          <Editor
            className="form-control"
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              ({
                JS: highlight(code, languages.html, "html"),
                Markdown: highlight(code, languages.markdown, "markdown"),
                Docker: highlight(code, languages.docker, "docker"),
              }[props.previewRef?.current?.formData?.flag || "JS"])
            }
            tabSize={2}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 18,
              backgroundColor: "#fafafa",
              outline: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
});
