import React from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { GetServerSidePropsContext } from "next";
import { LoadFile, LoadProjects } from "./api/projects/load";
import { LinkData, ProjectData } from "../types/api";
import { voidUrl } from "../config";
import { parse } from "node-html-parser";
import { HtmlMarkers } from "../config/placeholder";
import { FlagType } from "../types/flag";
import { marked } from "marked";
export interface ProjectPageProps {
  project: string;
  title: string;
  flag: FlagType;
  note: string;
  template: string;
  links: {
    main: string;
    other: LinkData[];
  };
}

export default function ProjectPage(props: ProjectPageProps) {
  if (props.flag == "JS") {
    const doc = parse(
      props.template
        .replace(new RegExp(HtmlMarkers.FILE_SERVER, "g"), voidUrl)
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
              doc.querySelector("#" + HtmlMarkers.JS)?.childNodes?.join("") ??
              "",
          }}
        ></div>

        <main role="main">
          <div
            className="jumbotron mx-auto bg-white"
            id="CanvasContainer0"
            dangerouslySetInnerHTML={{
              __html:
                doc
                  .querySelector("#" + HtmlMarkers.BODY)
                  ?.childNodes?.join("") ?? "",
            }}
          ></div>
        </main>

        <div
          id={HtmlMarkers.FOOTER}
          dangerouslySetInnerHTML={{
            __html:
              doc
                .querySelector("#" + HtmlMarkers.FOOTER)
                ?.childNodes?.join("") ?? "",
          }}
        ></div>

        <DefaultFooter name={props.title}>
          <DefaultProjectInfo
            href={`http://${props.links.main}`}
            links={props.links.other.map(({ link, name }) => ({
              name: name,
              link: `http://${link}`,
            }))}
            description={props.note}
          />
        </DefaultFooter>
      </>
    );
  }

  return (
    <>
      <DefaultHead>
        <title>{props.title}</title>
      </DefaultHead>

      <DefaultHeader name={props.title} projects />
      <main role="main">
        <div
          className="jumbotron mx-auto bg-white"
          id="CanvasContainer0"
          dangerouslySetInnerHTML={{
            __html: marked.parse(props.template),
          }}
        ></div>
      </main>

      <DefaultFooter name={props.title}>
        <DefaultProjectInfo
          href={`http://${props.links.main}`}
          links={props.links.other.map(({ link, name }) => ({
            name: name,
            link: `http://${link}`,
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

  project.links.forEach((link) =>
    link.name === "main" ? (links.main = link.link) : links.other.push(link)
  );

  return {
    props: {
      project: name,
      title: project.title,
      note: project.note,
      flag: project.flag,
      template: template,
      links: links,
    } as ProjectPageProps,
  };
};
