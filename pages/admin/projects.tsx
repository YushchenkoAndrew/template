import React, { useState } from "react";
import AddCard from "../../components/admin/AddCard";
import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultNav from "../../components/default/DefaultNav";
import { checkIfUserExist } from "../../lib/api/session";
import { ProjectData } from "../../types/api";
import { basePath, voidUrl } from "../../config";
import { FlagType } from "../../types/flag";
import Card from "../../components/admin/Card";
import { formPath } from "../../lib/public/files";
import InfiniteScroll from "react-infinite-scroll-component";
import { loadProjectsThumbnail } from "../../lib/public/projects";
import { withIronSession } from "next-iron-session";
import { NextSessionArgs } from "../../types/session";
import sessionConfig from "../../config/session";
import { LoadProjects } from "../api/projects/load";
import { DefaultRes } from "../../types/request";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastDefault } from "../../config/alert";

let page = 1;

export interface AdminProjectsProps {
  hasMore: boolean;
  projects: ProjectData[];
}

function FetchHandler(url: string, type: string = "Project") {
  return new Promise((resolve, reject) => {
    const toastId = toast.loading("Please wait...");
    fetch(url, { method: "POST" })
      .then((res) => res.json())
      .then((data: DefaultRes) => {
        if (data.status !== "OK") {
          resolve(false);
          return toast.update(toastId, {
            render: `${type}: ${data.message}`,
            type: "error",
            isLoading: false,
            ...ToastDefault,
          });
        }

        resolve(true);
        toast.update(toastId, {
          render: `${type}: Success`,
          type: "success",
          isLoading: false,
          ...ToastDefault,
        });
      })
      .catch((err) => {
        resolve(false);
        return toast.update(toastId, {
          render: `${type}: ${err.message}`,
          type: "error",
          isLoading: false,
          ...ToastDefault,
        });
      });
  });
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        transition={Bounce}
        closeOnClick
        theme="colored"
        rtl={false}
        draggable
      />

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
                id={item.id || 0}
                title={item.title}
                flag={item.flag as FlagType}
                href={`/projects/${item.name}`}
                img={`${voidUrl}/${item.name}${formPath(item.files[0])}`}
                desc={item.desc}
                event={{
                  metrics: {
                    href: `${basePath}/admin/projects/metrics?id=${item.id}`,
                  },
                  modify: {
                    href: `${basePath}/admin/projects/operation?type=edit&name=${item.name}`,
                  },
                  delete: {
                    onClick: () => {
                      FetchHandler(
                        `${basePath}/api/link/del?project_id=${item.id}&project=${item.name}`,
                        "Link"
                      ).then((ok) => {
                        if (!ok) return;

                        FetchHandler(
                          `${basePath}/api/file/del?project_id=${item.id}&project=${item.name}`,
                          "Files"
                        ).then((ok) => {
                          if (!ok) return;

                          FetchHandler(
                            `${basePath}/api/projects/del?project=${item.name}&flag=${item.flag}`
                          ).then((ok) => {
                            if (!ok) return;
                            setTimeout(() => window.location.reload(), 1000);
                          });
                        });
                      });
                    },
                  },
                }}
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
