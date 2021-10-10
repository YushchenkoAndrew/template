import React, { useReducer, useState } from "react";
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

const placeholder = {
  name: "CodeRain",
  title: "Code Rain",
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

export default function AdminHome() {
  const [formData, onFormChange] = useState(placeholder);
  const [treeStructure, onFileAdd] = useState(treePlaceholder);
  const [fileInfo, onFileInfoAdd] = useState({} as ProjectFile);

  function onChange(
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | ProjectElement
  ) {
    const { name, value } = event.target;
    onFormChange({
      ...formData,
      [name]: value ? value : placeholder[name as ProjectFields],

      // FIXME: I'll think about it
      // ...(name == "title" ? { name: value.replace(" ", "") } : {}),
    });

    if (!(value as ProjectFile).name) return;
    const file = value as ProjectFile;

    onFileAdd({
      ...treeStructure,
      [file.role]: {
        ...(treeStructure[file.role] ?? {}),
        [file.name]: file,
      },
    });
  }

  function onFileChange(
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | ProjectElement
  ) {
    const { name, value } = event.target;
    onFileInfoAdd({
      ...fileInfo,
      [name]: value,
    });
  }

  function onFilesUpload(
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | ProjectElement
  ) {
    const { name, value } = event.target;
    if (Array.isArray(value)) {
      return onFileAdd(
        (value as ProjectFile[]).reduce(
          (acc, curr) => ({
            ...acc,
            [curr.role]: {
              ...(acc[curr.role] ?? {}),
              [curr.name]: curr,
            },
          }),
          treeStructure
        )
      );
    }

    if (!(value as ProjectFile).name) return;
    const file = value as ProjectFile;

    onFileAdd({
      ...treeStructure,
      [file.role]: {
        ...(treeStructure[file.role] ?? {}),
        [file.name]: file,
      },
    });
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
              img={formData.img.url ?? ""}
              title={formData.title}
              size="title-lg"
              href="#"
              description={formData.desc}
            />
          </div>
          <div className="col-md-7 order-md-1">
            {/* <h4 className="mb-3">Thumbnail</h4> */}
            <InputTemplate label="Name">
              <InputName
                char="@"
                name="name"
                required
                placeholder="CodeRain"
                message="Please enter title"
                onChange={onChange}
              />
            </InputTemplate>

            <InputTemplate label="Title">
              <InputValue
                name="title"
                required
                placeholder={placeholder.title}
                message="Please enter title"
                onChange={onChange}
              />
            </InputTemplate>

            <InputTemplate label="Description">
              <InputText
                name="desc"
                required
                placeholder={placeholder.desc}
                message="Please enter title"
                onChange={onChange}
              />
            </InputTemplate>

            <InputTemplate label="Image">
              <InputFile
                name="img"
                role="thumbnail"
                type="image/*"
                onChange={onChange}
              />
            </InputTemplate>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-6 order-md-1 mb-4">
            <h4 className="mb-3">Project's Files Structure</h4>
            <TreeView name={formData.name} projectTree={treeStructure} />
          </div>
          <div className="col-md-6 order-md-2">
            <InputTemplate label="Role">
              <InputRadio
                name="role"
                options="assets src styles template"
                onChange={onFileChange}
              />
            </InputTemplate>
            <InputTemplate label="Directory">
              <InputValue
                name="dir"
                placeholder="/lua/"
                message="Please enter title"
                onChange={onFileChange}
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
