import React from "react";
import { ProjectInfo } from "../../../config/placeholder";
import { Event } from "../../../pages/admin/projects/operation";
import { LinkData } from "../../../types/api";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";

export interface DefaultLinkPreviewProps {
  links: { [name: string]: LinkData };
  onBlur?: (event: Event) => void;
  onLinkAdd: (data: LinkData) => boolean;
}

export default function DefaultLinkPreview(props: DefaultLinkPreviewProps) {
  return (
    <div className="d-flex justify-content-center mb-3">
      <div className="col-md-11 ">
        <h4 className="font-weight-bold mb-3">Redirect</h4>
        <InputTemplate label="Link">
          <InputName
            char="http://"
            name="link"
            required
            value={props.links["main"].link || ""}
            placeholder={ProjectInfo.link}
            onChange={(event: Event) => {
              props.onLinkAdd({
                name: "main",
                link: event.target.value.replace(/http:\/\/|https:\/\//g, ""),
              });
            }}
            onBlur={props.onBlur}
          />
        </InputTemplate>
      </div>
    </div>
  );
}
