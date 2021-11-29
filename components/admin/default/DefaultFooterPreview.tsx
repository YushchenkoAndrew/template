import React from "react";
import { ProjectInfo } from "../../../config/placeholder";
import { Event } from "../../../pages/admin/projects/operation";
import { LinkData, ProjectData } from "../../../types/api";
import DefaultFooter from "../../default/DefaultFooter";
import DefaultProjectInfo from "../../default/DefaultProjectInfo";
import InputList from "../../Inputs/InputDoubleList";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";
import InputText from "../../Inputs/InputText";
import ListEntity from "../../Inputs/ListEntity";

export interface DefaultFooterPreviewProps {
  links: { [name: string]: LinkData };
  formData: ProjectData;
  onChange: (event: Event) => void;
  onBlur?: (event: Event) => void;
  onLinkAdd: (data: LinkData) => boolean;
  onLinkChange: (data: { [name: string]: LinkData }) => void;
}

export default function DefaultFooterPreview(props: DefaultFooterPreviewProps) {
  return (
    <div className="d-flex justify-content-center mb-3">
      <div className="col-md-11 ">
        <h4 className="font-weight-bold mb-3">Footer</h4>
        <InputTemplate label="Note">
          <InputText
            name="note"
            required
            value={props.formData.note}
            placeholder={ProjectInfo.note}
            onChange={props.onChange}
            onBlur={props.onBlur}
          />
        </InputTemplate>

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

        <InputTemplate label="Additional Links">
          <InputList
            char={["http://", "@"]}
            name={["link", "name"]}
            placeholder={[ProjectInfo.link, ProjectInfo.name]}
            onChange={props.onLinkAdd}
          />
          <ul className="list-group">
            {Object.entries(props.links).map(([name, { link }], i) =>
              name != "main" ? (
                <div key={i} className="row">
                  <ListEntity
                    char={["http://", "@"]}
                    value={[link, name]}
                    onChange={() => delete props.links[name]}
                  />
                </div>
              ) : null
            )}
          </ul>
        </InputTemplate>

        <DefaultFooter name={props.formData.name}>
          <DefaultProjectInfo
            links={Object.entries(props.links).map(([name, { link }]) => ({
              name,
              link: link && `http://${link}`,
            }))}
            description={props.formData.note || ProjectInfo.note}
          />
        </DefaultFooter>
      </div>
    </div>
  );
}
