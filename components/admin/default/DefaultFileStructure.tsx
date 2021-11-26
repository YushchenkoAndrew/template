import React from "react";
import { ProjectInfo } from "../../../config/placeholder";
import { Event } from "../../../pages/admin/projects/operation";
import { TreeObj } from "../../../types/tree";
import InputFile from "../../Inputs/InputFile";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import TreeView from "../../TreeView/TreeView";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-coy.css";
import { FileData, ProjectData } from "../../../types/api";
import { ProjectElement } from "../../../types/projects";

export interface DefaultFileStructureProps {
  code: string;
  formData: ProjectData;
  fileInfo: FileData;
  projectTree: TreeObj;
  onChange: (event: Event) => void;
  onCodeChange: (code: string) => void;
  onUpload: (event: ProjectElement) => void;
  onBlur?: (event: Event) => void;
}

export default function DefaultFileStructure(props: DefaultFileStructureProps) {
  return (
    <>
      <hr />
      <div className="row">
        <div className="col-md-6 order-md-1 mb-4">
          <h4 className="font-weight-bold mb-3">Projects Files Structure</h4>
          <TreeView
            name={props.formData.name || ProjectInfo.name}
            role={props.fileInfo.role}
            dir={props.fileInfo.path}
            projectTree={props.projectTree}
          />
        </div>
        <div className="col-md-6 order-md-2">
          <InputTemplate label="Role">
            <InputRadio
              name="role"
              options={["assets", "src", "styles", "template"]}
              onChange={props.onChange}
            />
          </InputTemplate>

          <InputTemplate label="Directory">
            <InputValue
              name="path"
              className="rounded"
              value={props.fileInfo.path || ""}
              placeholder="/lua/"
              onChange={props.onChange}
            />
          </InputTemplate>

          <InputTemplate label="File">
            <InputFile
              name="file"
              role={props.fileInfo.role}
              multiple
              onChange={props.onUpload}
            />
          </InputTemplate>
        </div>
      </div>

      <hr />
      <div className="d-flex justify-content-center mb-3">
        <div className="col-md-11">
          <h4 className="font-weight-bold mb-2">Template</h4>
          <Editor
            className="form-control"
            value={props.code}
            onValueChange={props.onCodeChange}
            highlight={(code) =>
              props.formData.flag == "JS"
                ? highlight(code, languages.html, "html")
                : highlight(code, languages.markdown, "markdown")
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
    </>
  );
}
