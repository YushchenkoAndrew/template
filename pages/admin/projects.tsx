import React, { useEffect, useState } from "react";
import AddCard from "../../components/admin/AddCard";
import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultNav from "../../components/default/DefaultNav";
import defaultServerSideHandler from "../../lib/session";
import { ProjectData } from "../../types/api";
import { fileServer } from "../../config";
import { FlagType } from "../../types/flag";
import Card from "../../components/admin/Card";
import { formPath } from "../../lib/files";
import InfiniteScroll from "react-infinite-scroll-component";
import { loadProjectsThumbnail } from "../../lib/projects";

let page = 0;

export default function AdminProjects() {
  const [hasMore, onReachEnd] = useState(true);
  const [projects, onScrollLoad] = useState([] as ProjectData[]);

  useEffect(() => {
    loadProjectsThumbnail(page++)
      .then((data) => onScrollLoad([...projects, ...data]))
      .catch((err) => onReachEnd(false));
  }, []);

  return (
    <>
      <DefaultHead>
        <title>Projects</title>
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
          <AddCard />
          {projects.map((item, i) => {
            return (
              <Card
                key={i}
                id={item.ID}
                title={item.Title}
                img={`http://${fileServer}/files/${item.Name}${formPath(
                  item.Files[0]
                )}`}
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

export const getServerSideProps = defaultServerSideHandler;
