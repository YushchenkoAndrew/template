import React from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { GetServerSidePropsContext } from "next";
import { LoadFile, LoadProjects } from "./api/projects/load";
import { LinkData, ProjectData } from "../types/api";
import { fileServer } from "../config";
import { parse } from "node-html-parser";
import { HtmlMarkers } from "../config/placeholder";

export interface ProjectPageProps {
  project: string;
  title: string;
  note: string;
  template: string;
  links: {
    main: string;
    other: LinkData[];
  };
}

export default function ProjectPage(props: ProjectPageProps) {
  const doc = parse(
    props.template
      .replace(new RegExp(HtmlMarkers.FILE_SERVER, "g"), fileServer)
      .replace(new RegExp(HtmlMarkers.PROJECT_NAME, "g"), props.project)
  );
  return (
    <>
      <DefaultHead>
        <title>{props.title}</title>
      </DefaultHead>

      <DefaultHeader name={props.title} projects />

      <div
        id={HtmlMarkers.CSS}
        dangerouslySetInnerHTML={{
          __html:
            doc.querySelector("#" + HtmlMarkers.CSS)?.childNodes?.join("") ??
            "",
        }}
      ></div>
      <div
        id={HtmlMarkers.JS}
        dangerouslySetInnerHTML={{
          __html:
            doc.querySelector("#" + HtmlMarkers.JS)?.childNodes?.join("") ?? "",
        }}
      ></div>

      <main role="main">
        <div
          className="jumbotron mx-auto bg-white"
          id="CanvasContainer0"
          dangerouslySetInnerHTML={{
            __html:
              doc.querySelector("#" + HtmlMarkers.BODY)?.childNodes?.join("") ??
              "",
          }}
        ></div>
      </main>

      <div
        id={HtmlMarkers.FOOTER}
        dangerouslySetInnerHTML={{
          __html:
            doc.querySelector("#" + HtmlMarkers.FOOTER)?.childNodes?.join("") ??
            "",
        }}
      ></div>

      <DefaultFooter name={props.title}>
        <DefaultProjectInfo
          href={`http://${props.links.main}`}
          links={props.links.other.map(({ Link, Name }) => ({
            name: Name,
            link: `http://${Link}`,
          }))}
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

  let links = {
    main: "",
    other: [] as LinkData[],
  };

  project.Links.forEach((link) =>
    link.Name === "main" ? (links.main = link.Link) : links.other.push(link)
  );

  return {
    props: {
      project: name,
      title: project.Title,
      note: project.Note,
      template: template,
      links: links,
    } as ProjectPageProps,
  };
};
