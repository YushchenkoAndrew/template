import React, { FormEventHandler, useRef, useState } from "react";
import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import DefaultHead from "../../../components/default/DefaultHead";
import { checkIfUserExist } from "../../../lib/api/session";
import { TreeObj } from "../../../types/tree";
import { basePath, voidUrl } from "../../../config";
import { FileData, LinkData, ProjectData } from "../../../types/api";
import { withIronSession } from "next-iron-session";
import { NextSessionArgs } from "../../../types/session";
import sessionConfig from "../../../config/session";
import {
  codeTemplate,
  formPlaceholder,
  treePlaceholder,
} from "../../../config/placeholder";
import { LoadProjects } from "../../api/projects/load";
import { formPath } from "../../../lib/public/files";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadFile } from "../../api/file/load";
import InputRadio from "../../../components/Inputs/InputRadio";
import Preview, {
  PreviewRef,
} from "../../../components/admin/operation/Preview";
import CodeView, {
  CodeViewRef,
  formTree,
} from "../../../components/admin/operation/CodeView";
import { ToastDefault } from "../../../config/alert";
import K3sConfig, {
  K3sConfigRef,
} from "../../../components/admin/operation/K3sConfig";

export type Event = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export interface ProjectOperationProps {
  type: string;
  formData: ProjectData;
  treeStructure: TreeObj;
  template: FileData;
  links: { [name: string]: LinkData };
}

export default function ProjectOperation(props: ProjectOperationProps) {
  const [config, onSetConfig] = useState("Preview");
  const [validated, setValidated] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const previewRef = useRef<PreviewRef>(null);
  const codeViewRef = useRef<CodeViewRef>(null);
  const k3sConfigRef = useRef<K3sConfigRef>(null);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event?.preventDefault();
    if (!event?.currentTarget?.checkValidity()) {
      setValidated(true);
      return;
    }

    try {
      const data = await previewRef?.current?.onSubmit?.();
      await codeViewRef?.current?.onSubmit?.(data);
      await previewRef?.current?.onLinkSubmit?.(data);
      await k3sConfigRef?.current?.onSubmit?.(data);

      // FIXME: Was commented only for debug propose
      // setTimeout(
      //   () => (window.location.href = basePath + "/admin/projects/"),
      //   2000
      // );
    } catch (err: any) {
      if (!err) return;
      toast.update(err.id, {
        render: err.message ?? "Client error",
        type: "error",
        isLoading: false,
        ...ToastDefault,
      });
    }

    return false;
  };

  return (
    <>
      <DefaultHead>
        <title>
          {props.type.charAt(0).toUpperCase() + props.type.slice(1)} Project
        </title>
      </DefaultHead>
      <DefaultHeader />

      <form
        ref={formRef}
        className={`container needs-validation ${
          validated ? "was-validated" : ""
        } mt-3`}
        noValidate
        onSubmit={onSubmit as FormEventHandler<HTMLFormElement>}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          transition={Bounce}
          closeOnClick
          rtl={false}
          draggable
        />

        <div className="container mb-1">
          <div className="row w-100 d-flex justify-content-between">
            <span></span>
            {/* FIXME: */}
            {/* <a
              className="btn btn-success"
              onClick={() =>
                k3sConfigRef?.current
                  ?.onSubmit?.()
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => console.log(err))
              }
            >
              <FontAwesomeIcon className="text-light" icon={faPlay} />
            </a> */}

            <div className="row">
              <div>
                <InputRadio
                  name="flag"
                  className="btn-group btn-group-sm btn-group-toggle mb-2"
                  placeholder={config}
                  options={["Preview", "Code", "Config"]}
                  label="btn-outline-dark"
                  onChange={(event) => onSetConfig(event.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-sm btn-outline-success mb-2 ml-4"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <Preview
          ref={previewRef}
          codeViewRef={codeViewRef}
          type={props.type}
          links={props.links}
          // FIXME:
          // tag={props.links}
          formData={props.formData}
          show={config === "Preview"}
        />

        <CodeView
          ref={codeViewRef}
          file={props.template}
          previewRef={previewRef}
          treeStructure={props.treeStructure}
          show={config === "Code"}
        />

        <K3sConfig
          ref={k3sConfigRef}
          previewRef={previewRef}
          show={config === "Config"}
        />
      </form>
    </>
  );
}

export const getServerSideProps = withIronSession(async function ({
  req,
}: NextSessionArgs) {
  const sessionID = req.session.get("user");
  const isOk = await checkIfUserExist(sessionID);

  if (!sessionID || !isOk) {
    return {
      redirect: {
        basePath: false,
        destination: `${basePath}/admin/login`,
        permanent: false,
      },
    };
  }

  let type;
  const params = new URLSearchParams((req.url ?? "").split("?")[1] ?? "");
  if ((type = params.get("type")) === "edit") {
    if (!params.get("name")) return { notFound: true };

    const { send } = await LoadProjects<ProjectData>({
      name: params.get("name") ?? "",
    });

    const template = await LoadFile({
      project_id: send.result?.[0]?.id || 0,
      project: params.get("name") ?? "",
      role: "template",
    });

    if (send.status === "ERR" || !send.result?.length) {
      return { notFound: true };
    }

    let treeStructure = treePlaceholder;
    const project = send.result[0];

    for (let i in project.files) {
      let file = project.files[i];
      file.url = `${voidUrl}/${project.name}${formPath(file)}`;
      treeStructure = formTree(treeStructure, file, [file]);
    }

    return {
      props: {
        type,
        formData: project,
        treeStructure,
        template:
          template.send.result || codeTemplate[project.flag]?.code || "",
        links: project.links.reduce(
          (acc, curr) => ({ ...acc, [curr.name]: curr }),
          {}
        ),
      } as ProjectOperationProps,
    };
  }

  return {
    props: {
      type,
      formData: formPlaceholder,
      treeStructure: treePlaceholder,
      template: codeTemplate.JS,
      links: { main: { name: "main", link: "" } },
    } as ProjectOperationProps,
  };
},
sessionConfig);
