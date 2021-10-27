import React, { useEffect } from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { GetServerSidePropsContext } from "next";
import { LoadFile, LoadProjects } from "./api/projects/load";
import { FileData, ProjectData } from "../types/api";
import { basePath, fileServer } from "../config";
import { formPath } from "../lib/files";
import DefaultEmscContainer from "../components/default/DefaultEmscContainer";
import DefaultP5Container from "../components/default/DefaultP5Container";
import { parse } from "node-html-parser";

export interface ProjectPageProps {
  project: string;
  title: string;
  note: string;
  template: string;
  cssFiles: FileData[];
}

export default function ProjectPage(props: ProjectPageProps) {
  let doc = parse(props.template);

  console.log(props.template);
  console.log(doc.toString());

  console.log(
    doc.querySelector("head")?.childNodes?.map((item) => item.toString())
  );
  console.log(doc.querySelector("head")?.toString());

  return (
    <>
      <DefaultHead>
        <title>{props.title}</title>
        {props.cssFiles.map((file, i) => (
          <link
            key={i}
            rel="preload"
            as="style"
            href={`http://${fileServer}/files/${props.project}${formPath(
              file
            )}`}
          />
        ))}

        <div
          dangerouslySetInnerHTML={{
            __html: doc.querySelector("head")?.childNodes?.join("") ?? "",
          }}
        ></div>
      </DefaultHead>

      <DefaultHeader name={props.title} projects />

      {/* <main role="main">
        <div className="jumbotron mx-auto bg-white" id="CanvasContainer0">
          <div
            dangerouslySetInnerHTML={{
              __html: doc.querySelector("body")?.childNodes?.join("") ?? "",
            }}
          ></div>
        </div>
      </main> */}

      {/* TODO: Finish stuff bellow */}
      <DefaultEmscContainer width={1200} height={800} />
      {/* <DefaultP5Container /> */}
      <DefaultFooter name={props.title}>
        <DefaultProjectInfo
          href="https://github.com/YushchenkoAndrew/template/tree/master/JS/CodeRain"
          links={[
            {
              link: "https://github.com/YushchenkoAndrew/template/tree/master/CDump/CodeRain",
              name: "C++",
            },
          ]}
          description={props.note}
        />
      </DefaultFooter>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const name = context.params?.project as string | undefined;
  if (!name) return { notFound: true };

  const { send } = await LoadProjects({ name });
  if (send.status === "ERR" || !send.result?.length) return { notFound: true };
  const project = send.result[0] as ProjectData;
  const template = await LoadFile({ project: name, role: "template" });

  return {
    props: {
      project: name,
      title: project.Title,
      note: project.Note,
      template: template,
      cssFiles: project.Files.filter((file) => file.Type === "text/css"),
    } as ProjectPageProps,
  };
};
