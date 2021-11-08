import React, { useEffect, useState } from "react";
import AddCard from "../../components/admin/AddCard";
import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultNav from "../../components/default/DefaultNav";
import defaultServerSideHandler, { checkIfUserExist } from "../../lib/session";
import { ProjectData } from "../../types/api";
import { basePath, voidUrl } from "../../config";
import { FlagType } from "../../types/flag";
import Card from "../../components/admin/Card";
import { formPath } from "../../lib/files";
import InfiniteScroll from "react-infinite-scroll-component";
import { loadProjectsThumbnail } from "../../lib/projects";
import { withIronSession } from "next-iron-session";
import { NextSessionArgs } from "../../types/session";
import sessionConfig from "../../config/session";
import { LoadProjects } from "../api/projects/load";

let page = 1;

export interface AdminProjectsProps {
  hasMore: boolean;
  projects: ProjectData[];
}

export default function AdminProjects(props: AdminProjectsProps) {
  const [hasMore, onReachEnd] = useState(props.hasMore);
  const [projects, onScrollLoad] = useState(props.projects);

  return (
    <>
      <DefaultHead>
        <title>Projects</title>
        <link
          rel="preload"
          href={`${basePath}/fonts/pixel-bit-advanced.ttf`}
          as="font"
          crossOrigin=""
        />
      </DefaultHead>
      <DefaultHeader />

      <div className="container mt-4">
        <InfiniteScroll
          className="row"
          dataLength={projects.length}
          next={() =>
            loadProjectsThumbnail(page++)
              .then((data) => onScrollLoad([...projects, ...data]))
              .catch((err) => onReachEnd(false))
          }
          hasMore={hasMore}
          loader={
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          }
        >
          <AddCard href={`${basePath}/admin/projects/operation?type=add`} />
          {projects.map((item, i) => {
            return (
              <Card
                key={i}
                id={item.ID}
                title={item.Title}
                img={`${voidUrl}/${item.Name}${formPath(item.Files[0])}`}
                event={{
                  modify: {
                    href: `${basePath}/admin/projects/operation?type=edit&name=${item.Name}`,
                  },
                  delete: {
                    onClick: () => {
                      console.log("DELETE");
                    },
                  },
                }}
                flag={item.Flag as FlagType}
                desc={item.Desc}
              />
            );
          })}
        </InfiniteScroll>
      </div>

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}

export const getServerSideProps = withIronSession(async function ({
  req,
  res,
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

  const { send } = await LoadProjects({ page: 0, role: "thumbnail" });
  if (send.status === "ERR" || !send.result?.length) {
    return {
      props: {
        hasMore: false,
        projects: [],
      } as AdminProjectsProps,
    };
  }

  return {
    props: {
      hasMore: true,
      projects: send.result,
    } as AdminProjectsProps,
  };
},
sessionConfig);
