import React from "react";
import { ProjectInfo } from "../../../config/placeholder";
import { Event } from "../../../pages/admin/projects/operation";
import { TreeObj } from "../../../types/tree";
import { ProjectFile, ProjectForm } from "../../../types/projects";
import InputFile from "../../Inputs/InputFile";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import TreeView from "../../TreeView/TreeView";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-coy.css";

export interface DefaultFileStructureProps {
  code: string;
  formData: ProjectForm;
  fileInfo: ProjectFile;
  projectTree: TreeObj;
  onChange: (event: Event) => void;
  onCodeChange: (code: string) => void;
  onUpload: (event: Event) => void;
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
            dir={props.fileInfo.dir}
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
              name="dir"
              value={props.fileInfo.dir ?? ""}
              placeholder="/lua/"
              onChange={props.onChange}
            />
          </InputTemplate>

          <InputTemplate label="File">
            <InputFile
              name="img"
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
            highlight={(code) => highlight(code, languages.html, "html")}
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
