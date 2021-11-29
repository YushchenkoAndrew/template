import React from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { GetServerSidePropsContext } from "next";
import { LoadProjects } from "./api/projects/load";
import { LinkData, ProjectData } from "../types/api";
import { FlagType } from "../types/flag";
import DefaultJsProject from "../components/default/DefaultJsProject";
import DefaultMarkdownProject from "../components/default/DefaultMarkdownProject";
import { LoadFile } from "./api/file/load";
export interface ProjectPageProps {
  project: string;
  title: string;
  flag: FlagType;
  note: string;
  template: string;
  links: LinkData[];
}

export default function ProjectPage(props: ProjectPageProps) {
  return (
    <>
      <DefaultHead>
        <title>{props.title}</title>
      </DefaultHead>
      <DefaultHeader name={props.title} projects />

      {props.flag == "JS" ? (
        <DefaultJsProject project={props.project} template={props.template} />
      ) : (
        <DefaultMarkdownProject
          project={props.project}
          template={props.template}
        />
      )}

      <DefaultFooter name={props.title}>
        <DefaultProjectInfo
          links={props.links.map(({ link, name }) => ({
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
  if (project.flag === "Link") {
    return {
      redirect: {
        basePath: false,
        destination: "http://" + project.links[0].link,
        permanent: false,
      },
    };
  }

  const template = await LoadFile({
    project: name,
    project_id: project.id || 0,
    role: "template",
  });

  return {
    props: {
      project: name,
      title: project.title,
      note: project.note,
      flag: project.flag,
      template: template.send.result,
      links: project.links,
    } as ProjectPageProps,
  };
};
