import React, { useState } from "react";
import { basePath } from "../../config";
import md5 from "../../lib/md5";
import { ApiError, ApiRes, ProjectData } from "../../types/api";
import { FlagType } from "../../types/flag";
import Card from "./Card";

// TODO: Add image showing
function LoadProjects() {
  return new Promise<ProjectData[]>((resolve, reject) => {
    fetch(`${basePath}/api/admin/projects/load`)
      .then((res) => res.json())
      .then((data: ApiRes | ApiError) => {
        console.log(data);

        data.status === "OK"
          ? resolve((data as ApiRes).result as ProjectData[])
          : reject();
      })
      .catch((err) => reject());
  });
}
export interface CardStackProps {
  id: number;
}

export default function CardStack(props: CardStackProps) {
  let [projects, onProjectLoad] = useState([] as ProjectData[]);

  // FIXME: Maybe change to something else ...
  if (!projects.length) {
    LoadProjects()
      .then((data) => onProjectLoad(data))
      .catch((err) => null);
  }

  return (
    <>
      {projects.map((item) => {
        return (
          <Card
            key={md5(Math.random().toString())}
            id={item.ID}
            title={item.Title}
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            flag={item.Flag as FlagType}
            desc={item.Desc}
          />
        );
      })}
    </>
  );
}
