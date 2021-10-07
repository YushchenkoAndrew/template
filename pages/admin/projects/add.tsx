import React, { useReducer, useState } from "react";
import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import InputValue from "../../../components/Inputs/InputValue";
import DefaultFooter from "../../../components/default/DefaultFooter";
import DefaultHead from "../../../components/default/DefaultHead";
import DefaultNav from "../../../components/default/DefaultNav";
import defaultServerSideHandler from "../../../lib/session";
import { ProjectFields, ProjectForm } from "../../../types/projects";
import InputTemplate from "../../../components/Inputs/InputTemplate";
import InputName from "../../../components/Inputs/InputName";
import InputText from "../../../components/Inputs/InputText";
import Card from "../../../components/Card";
import InputImage from "../../../components/Inputs/InputImage";
import InputFile from "../../../components/Inputs/InputImage";

const placeholder = {
  name: "CodeRain",
  title: "Code Rain",
  desc: "Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes",
} as ProjectForm;

export default function AdminHome() {
  const [formData, onFormChange] = useState(placeholder);

  function onChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    onFormChange({
      ...formData,
      [name]: value ? value : placeholder[name as ProjectFields],

      // FIXME: I'll think about it
      // ...(name == "title" ? { name: value.replace(" ", "") } : {}),
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
              img="/projects/img/CodeRain.webp"
              title={formData.title}
              size="title-lg"
              href="#"
              description={formData.desc}
            />
          </div>
          <div className="col-md-7 order-md-1">
            <InputTemplate label="Name">
              <InputName
                char="@"
                name="name"
                // required
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
              <InputFile name="img" onChange={onChange} />
            </InputTemplate>
          </div>
        </div>
        <hr />
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
