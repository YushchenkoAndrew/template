import React, { useEffect, useRef, useState } from "react";
import { useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { basePath } from "../../../config";
import { ToastDefault } from "../../../config/alert";
import { codeTemplate, ProjectInfo } from "../../../config/placeholder";
import { CacheId } from "../../../lib/public";
import { Event } from "../../../pages/admin/projects/operation";
import { FileData, LinkData, ProjectData } from "../../../types/api";
import { DefaultRes } from "../../../types/request";
import Card from "../../Card";
import DefaultFooter from "../../default/DefaultFooter";
import DefaultProjectInfo from "../../default/DefaultProjectInfo";
import InputList from "../../Inputs/InputDoubleList";
import InputFile from "../../Inputs/InputFile";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputText from "../../Inputs/InputText";
import InputValue from "../../Inputs/InputValue";
import ListEntity from "../../Inputs/ListEntity";
import { CodeViewRef } from "./CodeView";

export interface PreviewProps {
  type: string;
  codeViewRef: React.RefObject<CodeViewRef>;
  formData: ProjectData;
  links: { [name: string]: LinkData };
  show?: boolean;
}

export interface PreviewRef {
  formData: ProjectData;
  links: { [name: string]: LinkData };
  onSubmit: () => Promise<ProjectData>;
  onLinkSubmit: (data: ProjectData | undefined) => Promise<boolean>;
}

export default React.forwardRef((props: PreviewProps, ref) => {
  const [img, setImg] = useState(ProjectInfo.img.url);
  const [links, onLinksChange] = useState(props.links);
  const [formData, onFormChange] = useState(props.formData);

  useImperativeHandle<unknown, PreviewRef>(ref, () => ({
    formData,
    links,
    onSubmit() {
      const toastId = toast.loading("Please wait...");
      return new Promise<ProjectData>((resolve, reject) => {
        fetch(
          `${basePath}/api/projects/${props.type}?id=${CacheId(props.type)}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(formData),
          }
        )
          .then((res) => res.json())
          .then((data: DefaultRes<ProjectData[]>) => {
            if (data.status !== "OK" || !data.result?.[0]) {
              return reject({ id: toastId, message: data.message });
            }

            resolve(data.result[0]);
            toast.update(toastId, {
              render: "Project: Record is created",
              type: "success",
              isLoading: false,
              ...ToastDefault,
            });
          })
          .catch(() =>
            reject({ id: toastId, message: "Project: Server error" })
          );
      });
    },

    onLinkSubmit(data: ProjectData | undefined) {
      if (!data) return new Promise((resolve, reject) => reject(null));

      const id = data.id || formData.id;
      return new Promise((resolve, reject) => {
        const toastId = toast.loading("Please wait...");
        fetch(`${basePath}/api/link/add?id=${id}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(links),
        })
          .then((res) => res.json())
          .then((data: DefaultRes) => {
            toast.update(toastId, {
              render: `Link: ${data.message}`,
              type: data.status === "OK" ? "success" : "error",
              isLoading: false,
              ...ToastDefault,
            });
          })
          .catch(() => reject({ id: toastId, message: "Link: Server error" }));
      });
    },
  }));

  useEffect(() => {
    fetch(`${basePath}/api/projects/cache?id=${CacheId(props.type)}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data: DefaultRes) => {
        if (data.status !== "OK") return;
        onFormChange({
          ...formData,
          ...data.result,
        });
      })
      .catch((err) => null);
  }, []);

  function onThumbnailChange(event: Event) {
    // setValidated(false);
    onFormChange({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function onNewLinkAdd(data: LinkData): boolean {
    if (!data["name"] || data["link"] === undefined) return false;
    onLinksChange({ ...links, [data["name"]]: data });
    return true;
  }

  function onDataCache(event: Event) {
    fetch(`${basePath}/api/projects/cache?id=${CacheId(props.type)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => console.log(res.status))
      .catch((err) => null);
  }

  return (
    <div className={props.show ? "" : "d-none"}>
      <hr />
      <div className="row">
        <div className="col-md-5 order-md-2 mb-4">
          <Card
            img={
              props.codeViewRef?.current?.treeStructure?.thumbnail?.[
                Object.keys(
                  props.codeViewRef?.current?.treeStructure?.thumbnail
                )[0]
              ]?.url || img
            }
            title={formData.title || ProjectInfo.title}
            size="title-lg"
            href="#"
            description={formData.desc || ProjectInfo.desc}
          />
        </div>
        <div className="col-md-7 order-md-1">
          <h4 className="font-weight-bold mb-3">Thumbnail</h4>
          <InputTemplate label="Name">
            <InputName
              char="@"
              name="name"
              required
              value={formData.name}
              placeholder={ProjectInfo.name}
              onChange={(event) => {
                event.target.value = event.target.value.replace(" ", "");
                onThumbnailChange(event);
              }}
              onBlur={onDataCache}
            />
          </InputTemplate>

          <InputTemplate label="Title">
            <div className="input-group">
              <InputValue
                name="title"
                required
                className="rounded"
                value={formData.title}
                placeholder={ProjectInfo.title}
                onChange={onThumbnailChange}
                onBlur={onDataCache}
              />
            </div>
          </InputTemplate>

          <InputTemplate label="Description">
            <InputText
              name="desc"
              required
              value={formData.desc}
              placeholder={ProjectInfo.desc}
              onChange={onThumbnailChange}
              onBlur={onDataCache}
            />
          </InputTemplate>

          <div className="input-group d-flex justify-content-between">
            <InputTemplate label="Image">
              <InputFile
                name="file"
                role="thumbnail"
                type="image/*"
                onChange={(e) => {
                  setImg(e.target.value[0]?.url ?? img);
                  props.codeViewRef?.current?.onUpload(e);
                }}
              />
            </InputTemplate>

            <InputTemplate label="Flag">
              <InputRadio
                name="flag"
                placeholder={formData.flag}
                options={["JS", "Markdown", "Link", "Docker"]}
                label="btn-outline-secondary"
                onChange={(event) => {
                  onThumbnailChange(event);
                  if (!props.codeViewRef?.current?.treeStructure) return;
                  if (!codeTemplate[event.target.value]) {
                    return props.codeViewRef.current.onFileAdd({
                      ...props.codeViewRef.current.treeStructure,
                      template: {},
                    });
                  }

                  props.codeViewRef.current.onFileAdd({
                    ...props.codeViewRef.current.treeStructure,
                    template: {
                      [codeTemplate[event.target.value].name]: {
                        ...(Object.values(
                          props.codeViewRef.current.treeStructure.template ?? {}
                        )[0] ?? {}),
                        name: codeTemplate[event.target.value].name,
                        type: codeTemplate[event.target.value].type,
                        role: "template",
                      } as FileData,
                    },
                  });

                  props.codeViewRef.current.setCode(
                    codeTemplate[event.target.value].code
                  );
                }}
              />
            </InputTemplate>
          </div>
        </div>
      </div>

      <hr />
      {formData.flag === "Link" || formData.flag === "Docker" ? (
        <div className="d-flex justify-content-center mb-3">
          <div className="w-100">
            <h4 className="font-weight-bold mb-3">Redirect</h4>
            <InputTemplate label="Link">
              <InputName
                char="http://"
                name="link"
                required
                value={links["main"].link || ""}
                placeholder={ProjectInfo.link}
                onChange={(event: Event) => {
                  onNewLinkAdd({
                    name: "main",
                    link: event.target.value.replace(
                      /http:\/\/|https:\/\//g,
                      ""
                    ),
                  });
                }}
                onBlur={onDataCache}
              />
            </InputTemplate>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center mb-3">
          <div className="w-100">
            <h4 className="font-weight-bold mb-3">Footer</h4>
            <InputTemplate label="Note">
              <InputText
                name="note"
                required
                value={formData.note}
                placeholder={ProjectInfo.note}
                onChange={onThumbnailChange}
                onBlur={onDataCache}
              />
            </InputTemplate>

            <InputTemplate label="Link">
              <InputName
                char="http://"
                name="link"
                required
                value={links["main"].link || ""}
                placeholder={ProjectInfo.link}
                onChange={(event: Event) => {
                  onNewLinkAdd({
                    name: "main",
                    link: event.target.value.replace(
                      /http:\/\/|https:\/\//g,
                      ""
                    ),
                  });
                }}
                onBlur={onDataCache}
              />
            </InputTemplate>

            <InputTemplate label="Additional Links">
              <InputList
                char={["http://", "@"]}
                name={["link", "name"]}
                placeholder={[ProjectInfo.link, ProjectInfo.name]}
                onChange={onNewLinkAdd}
              />
              <ul className="list-group">
                {Object.entries(links).map(([name, { link }], i) =>
                  name != "main" ? (
                    <div key={i} className="row">
                      <ListEntity
                        char={["http://", "@"]}
                        value={[link, name]}
                        onChange={() => delete links[name]}
                      />
                    </div>
                  ) : null
                )}
              </ul>
            </InputTemplate>

            <DefaultFooter name={formData.name}>
              <DefaultProjectInfo
                links={Object.entries(links).map(([name, { link }]) => ({
                  name,
                  link: link && `http://${link}`,
                }))}
                description={formData.note || ProjectInfo.note}
              />
            </DefaultFooter>
          </div>
        </div>
      )}
    </div>
  );
});
