import React, { useImperativeHandle, useState } from "react";
import { ProjectInfo } from "../../../config/placeholder";
import { Event } from "../../../pages/admin/projects/operation";
import { TreeObj } from "../../../types/tree";
import InputFile from "../../Inputs/InputFile";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import TreeView from "../../TreeView/TreeView";
import Editor from "react-simple-code-editor";
import { Grammar, highlight, languages } from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-docker";
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

      if (!path[index]) {
        return {
          ...(prev && !prev.name ? (prev as TreeObj)[path[index]] : prev ?? {}),
          ...combine(
            prev && !prev.name ? (prev as TreeObj)[path[index]] : prev,
            index + 1
          ),
        } as TreeObj;
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

const highlightTypes: { [name: string]: [Grammar, string] } = {
  html: [languages.html, "html"],
  css: [languages.css, "css"],
  js: [languages.js, "js"],
  markdown: [languages.markdown, "markdown"],
  dockerfile: [languages.docker, "docker"],
};

export interface CodeViewProps {
  file: FileData;
  previewRef: React.RefObject<PreviewRef>;
  treeStructure: TreeObj;
  show?: boolean;
}

export interface CodeViewRef {
  file: FileData;
  treeStructure: TreeObj;
  onUpload: (event: ProjectElement) => void;
  setFile: (value: FileData) => void;
  onFileAdd: (value: TreeObj) => void;
  onSubmit: (data: ProjectData | undefined) => Promise<boolean>;
}

export default React.forwardRef((props: CodeViewProps, ref) => {
  const [file, setFile] = useState(props.file);
  const [fileInfo, onFileInfoAdd] = useState({ role: "assets" } as FileData);
  const [treeStructure, onFileAdd] = useState(props.treeStructure);
  const [fileName, onFileSelect] = useState("template/index.html");

  function onUpload(event: ProjectElement) {
    if (!Array.isArray(event.target.value)) return;
    // setValidated(false);

    const html = parseHTML(file.content ?? "", event.target.value);
    if (html) setFile({ ...file, content: html });

    return onFileAdd(
      formTree(treeStructure, fileInfo, event.target.value as FileData[])
    );
  }

  useImperativeHandle<unknown, CodeViewRef>(ref, () => ({
    file,
    treeStructure,
    onUpload,
    onFileAdd,

    setFile: (file: FileData) => {
      setFile(file);
      onFileAdd(formTree(treeStructure, file, [file]));
    },

    onSubmit(data: ProjectData | undefined) {
      const formData = props.previewRef?.current?.formData;
      if (!formData || !data) {
        return new Promise((resolve, reject) => reject(null));
      }
      console.log(data);

      const id = data.id || formData.id;

      // FIXME: ???
      const path = [file.role, ...file.path.split("/"), file.name].filter(
        (item) => item
      );
      const template = (function GetFile(
        tree: TreeObj,
        i: number
      ): FileData | null {
        if (!tree[path[i]]) return null;
        if (path.length === i + 1) return tree[path[i]] as FileData;
        return GetFile(tree[path[i]] as TreeObj, i + 1);
      })(treeStructure, 0);

      if (template) {
        template.file = new File(
          [new Blob([file.content ?? ""], { type: file.type })],
          file.name,
          { type: file.type }
        );
      }

      return (function parseTree(tree: TreeObj | FileData | null) {
        return new Promise(async (resolve, reject) => {
          // Check if obj is FileData and if File not exist then break
          console.log(tree);
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
              setFile(
                (function GetFile(tree: TreeObj, i: number): FileData | null {
                  if (!tree[path[i]]) return null;
                  if (path.length === i + 1) return tree[path[i]] as FileData;
                  return GetFile(tree[path[i]] as TreeObj, i + 1);
                })(treeStructure, 0) ?? file
              );

              onFileSelect(path.join("/"));

              // FIXME: Load file from void Server (ON UPDATE !!!)
              // fetch(
              //   `${voidUrl}/${
              //     props.previewRef?.current?.formData?.name ?? ""
              //   }/${path}`
              // )
              //   .then((res) => console.log(res))
              //   .catch((err) => console.log(err));
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

          <div>
            <Editor
              className="form-control editor"
              value={file.content ?? ""}
              onValueChange={(content) => setFile({ ...file, content })}
              highlight={(code) => {
                return highlight(
                  code,
                  ...(highlightTypes[file.type.split("/")[1] ?? "js"] ??
                    highlightTypes.js)
                )
                  .split("\n")
                  .map(
                    (line, i) =>
                      `<span class='editor-line-number'>${i + 1}</span>${line}`
                  )
                  .join("\n");
              }}
              tabSize={2}
              textareaId="code-area"
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
    </div>
  );
});
