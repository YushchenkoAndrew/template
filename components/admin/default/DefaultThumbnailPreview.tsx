import React from "react";
import { ProjectInfo } from "../../../config/placeholder";
import { Event } from "../../../pages/admin/projects/operation";
import { FileData, ProjectData } from "../../../types/api";
import { ProjectElement } from "../../../types/projects";
import Card from "../../Card";
import InputFile from "../../Inputs/InputFile";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputText from "../../Inputs/InputText";
import InputValue from "../../Inputs/InputValue";

export interface DefaultThumbnailPreviewProps {
  thumbnail?: FileData;
  formData: ProjectData;
  onChange: (event: Event) => void;
  onUpload: (event: ProjectElement) => void;
  onBlur?: (event: Event) => void;
}

export default function DefaultThumbnailPreview(
  props: DefaultThumbnailPreviewProps
) {
  return (
    <div className="row">
      <div className="col-md-5 order-md-2 mb-4">
        <Card
          img={props.thumbnail?.url || (ProjectInfo.img.url ?? "")}
          title={props.formData.title || ProjectInfo.title}
          size="title-lg"
          href="#"
          description={props.formData.desc || ProjectInfo.desc}
        />
      </div>
      <div className="col-md-7 order-md-1">
        <h4 className="font-weight-bold mb-3">Thumbnail</h4>
        <InputTemplate label="Name">
          <InputName
            char="@"
            name="name"
            required
            value={props.formData.name}
            placeholder={ProjectInfo.name}
            onChange={props.onChange}
            onBlur={props.onBlur}
          />
        </InputTemplate>

        <InputTemplate label="Title">
          <div className="input-group">
            <InputValue
              name="title"
              required
              className="rounded"
              value={props.formData.title}
              placeholder={ProjectInfo.title}
              onChange={props.onChange}
              onBlur={props.onBlur}
            />
          </div>
        </InputTemplate>

        <InputTemplate label="Description">
          <InputText
            name="desc"
            required
            value={props.formData.desc}
            placeholder={ProjectInfo.desc}
            onChange={props.onChange}
            onBlur={props.onBlur}
          />
        </InputTemplate>

        <div className="input-group d-flex justify-content-between">
          <InputTemplate label="Image">
            <InputFile
              name="file"
              role="thumbnail"
              type="image/*"
              required
              onChange={(event: ProjectElement) => {
                let reader = new FileReader();

                function ReadFiles(i: number) {
                  reader.readAsDataURL(
                    event.target.value[i].file || new Blob()
                  );
                  reader.onloadend = (e) => {
                    event.target.value[i].url = String(reader.result);
                    if (++i < event.target.value.length) ReadFiles(i);
                  };
                }

                ReadFiles(0);
                props.onUpload(event);
              }}
            />
          </InputTemplate>

          <InputTemplate label="Flag">
            <InputRadio
              name="flag"
              options={["JS", "Markdown", "Link"]}
              label="btn-outline-secondary"
              onChange={props.onChange}
            />
          </InputTemplate>
        </div>
      </div>
    </div>
  );
}
