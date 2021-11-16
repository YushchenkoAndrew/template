import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "../components/Card";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultNav from "../components/default/DefaultNav";
import { basePath, voidUrl } from "../config";
import { formPath } from "../lib/files";
import { loadProjectsThumbnail } from "../lib/projects";
import { ProjectData } from "../types/api";
import { LoadProjects } from "./api/projects/load";

let page = 1;
export interface ProjectsListPageProps {
  hasMore: boolean;
  projects: ProjectData[][];
}

export default function ProjectsListPage(props: ProjectsListPageProps) {
  const [hasMore, onReachEnd] = useState(props.hasMore);
  const [projects, onScrollLoad] = useState(props.projects);

  function loadProjects() {
    loadProjectsThumbnail(page++)
      .then((data) => {
        const chunk = data.length / 3;
        onScrollLoad([
          [...projects[0], ...data.slice(0, chunk)],
          [...projects[1], ...data.slice(chunk, 2 * chunk)],
          [...projects[2], ...data.slice(2 * chunk)],
        ]);
      })
      .catch((err) => onReachEnd(false));
  }

  return (
    <>
      <DefaultHead>
        <title>Mortis Projects</title>
        <link
          rel="preload"
          href={`${basePath}/fonts/ABSTRACT.ttf`}
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href={`${basePath}/fonts/Roboto-Thin.ttf`}
          as="font"
          crossOrigin=""
        />
      </DefaultHead>

      <DefaultHeader projects />
      <main role="main">
        <div className="container mt-5">
          <div className="card-columns">
            <Card
              img={`${basePath}/img/ApproximatingPiValue.webp`}
              title="Find Pi with RNG"
              href={`${basePath}/ApproximatingPiValue`}
              description="Plz RNG Gods, I need to gacha the Pi value"
            />
            <Card
              img={`${basePath}/img/CodeRain.webp`}
              title="Code Rain"
              size="title-lg"
              href={`${basePath}/CodeRain`}
              description="Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes"
            />
            <Card
              img={`${basePath}/img/HammingCode.webp`}
              title="Hamming Code"
              href={`${basePath}/HammingCode`}
              description="The first algorithm for Error correction"
            />
            <Card
              img={`${basePath}/img/Minecraft.webp`}
              title="3D Engine"
              size="title-lg"
              href={`${basePath}/Minecraft`}
              description="Yet another Minecraft clone"
            />
            <Card
              img={`${basePath}/img/ReactionDiffusion.webp`}
              title="Reaction Diffusion"
              href={`${basePath}/ReactionDiffusion`}
              description="Haha, chemical elements go brrrrr "
            />
            <Card
              img={`${basePath}/img/ShadowCasting.webp`}
              title="Shadow Casting"
              href={`${basePath}/ShadowCasting`}
              description="Caveman discover shadow. Ugh, Uugh pretty shade"
            />

            {/* WARNING: Temp file */}
            <Card
              img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
              title="Some text"
              href="#"
              size="title-lg"
              description="Some small text which is no so important, but still it's good to have"
            />
          </div>
        </div>

        <div className="container mt-5">
          <InfiniteScroll
            className="row text-center"
            dataLength={projects[0].length}
            next={() => loadProjects()}
            hasMore={hasMore}
            loader={
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            }
          >
            {projects.map((chunk, i) => {
              return (
                <div key={i} className="col-12 col-lg-4 col-md-6 px-2">
                  {chunk.map((item, j) => {
                    return (
                      <Card
                        key={j}
                        title={item.Title}
                        img={`${voidUrl}/${item.Name}${formPath(
                          item.Files[0]
                        )}`}
                        href={`${basePath}/${item.Name}`}
                        description={item.Desc}
                      />
                    );
                  })}
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </main>

      <DefaultFooter name="Menu" background>
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}

export const getServerSideProps = async () => {
  const { send } = await LoadProjects({ page: 0, role: "thumbnail" });
  if (send.status === "ERR" || !send.result?.length) {
    return {
      props: {
        hasMore: false,
        projects: [[], [], []],
      } as ProjectsListPageProps,
    };
  }

  const chunk = send.result.length / 3;
  return {
    props: {
      hasMore: true,
      projects: [
        send.result.slice(0, chunk),
        send.result.slice(chunk, 2 * chunk),
        send.result.slice(2 * chunk),
      ],
    } as ProjectsListPageProps,
  };
};
