import React from "react";
import { ProjectInfo } from "../../../config/placeholder";
import { Event } from "../../../pages/admin/projects/operation";
import { ProjectForm, ProjectLink } from "../../../types/projects";
import DefaultFooter from "../../default/DefaultFooter";
import DefaultProjectInfo from "../../default/DefaultProjectInfo";
import InputList from "../../Inputs/InputDoubleList";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";
import InputText from "../../Inputs/InputText";
import ListEntity from "../../Inputs/ListEntity";

export interface DefaultFooterPreviewProps {
  links: { [name: string]: string };
  formData: ProjectForm;
  onChange: (event: Event) => void;
  onBlur?: (event: Event) => void;
  onLinkAdd: (data: { [name: string]: string }) => boolean;
  onLinkChange: (data: { [name: string]: string }) => void;
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
            value={props.formData.link}
            placeholder={ProjectInfo.link}
            onChange={props.onChange}
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
            {Object.entries(props.links).map(([name, link], i) => (
              <div key={i} className="row">
                <ListEntity
                  char={["http://", "@"]}
                  value={[link, name]}
                  onChange={() => delete props.links[name]}
                />
              </div>
            ))}
          </ul>
        </InputTemplate>

        <DefaultFooter name={props.formData.name}>
          <DefaultProjectInfo
            href={props.formData.link ? `http://${props.formData.link}` : "#"}
            links={Object.entries(props.links).map(([name, link]) => ({
              name,
              link: `http://${link}`,
            }))}
            description={props.formData.note || ProjectInfo.note}
          />
        </DefaultFooter>
      </div>
    </div>
  );
}
