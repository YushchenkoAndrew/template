import React from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { GetServerSidePropsContext } from "next";
import { LoadProjects } from "./api/projects/load";
import { FileData, ProjectData } from "../types/api";
import { fileServer } from "../config";
import { formPath } from "../lib/files";

export interface ProjectPageProps {
  project: string;
  title: string;
  note: string;
  jsFiles: FileData[];
  cssFiles: FileData[];
}

export default function ProjectPage(props: ProjectPageProps) {
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

        {props.jsFiles.map((file, i) => (
          <script
            defer
            key={i}
            src={`http://${fileServer}/files/${props.project}${formPath(file)}`}
          ></script>
        ))}
      </DefaultHead>

      <DefaultHeader name={props.title} projects />

      {/* TODO: Finish stuff bellow */}
      {/* <DefaultEmscContainer width={1200} height={800} /> */}
      <DefaultFooter name={props.title}>
        <DefaultProjectInfo
          href="https://github.com/YushchenkoAndrew/template/tree/master/JS/CodeRain"
          links={[
            {
              href: "https://github.com/YushchenkoAndrew/template/tree/master/CDump/CodeRain",
              lang: "C++",
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

  return {
    props: {
      project: name,
      title: project.Title,
      note: project.Note,
      jsFiles: project.Files.filter((file) => file.Type === "text/javascript"),
      cssFiles: project.Files.filter((file) => file.Type === "text/css"),
    } as ProjectPageProps,
  };
};
