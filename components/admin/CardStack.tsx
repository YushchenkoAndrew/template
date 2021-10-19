import React, { useEffect, useState } from "react";
import { basePath, fileServer } from "../../config";
import { formPath } from "../../lib/files";
import md5 from "../../lib/md5";
import { ApiError, ApiRes, ProjectData } from "../../types/api";
import { FlagType } from "../../types/flag";
import Card from "./Card";

// TODO: Add image showing
function LoadProjects() {
  return new Promise<ProjectData[]>((resolve, reject) => {
    fetch(`${basePath}/api/projects/load?page=0&role=thumbnail`)
      .then((res) => res.json())
      .then((data: ApiRes<ProjectData> | ApiError) => {
        if (data.status === "OK") {
          return resolve((data as ApiRes<ProjectData>).result);
        }

        reject();
      })
      .catch((err) => reject());
  });
}
export interface CardStackProps {
  id: number;
}

export default function CardStack(props: CardStackProps) {
  let [projects, onProjectLoad] = useState([] as ProjectData[]);

  useEffect(() => {
    LoadProjects()
      .then((data) => onProjectLoad(data))
      .catch((err) => null);
  }, []);

  return (
    <>
      {projects.map((item) => {
        return (
          <Card
            key={md5(Math.random().toString())}
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
    </>
  );
}
