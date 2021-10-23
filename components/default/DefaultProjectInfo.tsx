import { useRouter } from "next/dist/client/router";
import React from "react";
import { ProjectLink } from "../../types/projects";
export interface DefaultProjectInfoProps {
  href: string;
  lang?: string;
  links?: ProjectLink[];
  description: string;
}

export default function DefaultProjectInfo(props: DefaultProjectInfoProps) {
  const router = useRouter();
  const basePath = router.basePath;
  return (
    <>
      <p className="text-dark">
        Description: <small className="text-muted">{props.description}</small>
      </p>
      <p className="text-dark">
        {"Source: "}
        <a
          className="font-weight-bold"
          href={props.href}
          onClick={() =>
            localStorage.getItem("id")
              ? fetch(
                  `${basePath}/api/view/media?id=${localStorage.getItem("id")}`,
                  { method: "PATCH" }
                )
                  .then((res) => null)
                  .catch((err) => null)
              : null
          }
          target="_blank"
          rel="noreferrer"
        >
          Github{props.lang ? ` (${props.lang})` : ""}
        </a>
        {props.links
          ? props.links.map((item, key) => (
              <a
                className="font-weight-bold ml-1"
                href={item.link}
                key={key}
                onClick={() =>
                  localStorage.getItem("id")
                    ? fetch(
                        `${basePath}/api/view/media?id=${localStorage.getItem(
                          "id"
                        )}`,
                        { method: "PATCH" }
                      )
                        .then((res) => null)
                        .catch((err) => null)
                    : null
                }
                target="_blank"
                rel="noreferrer"
              >
                {item.name}
              </a>
            ))
          : null}
      </p>
    </>
  );
}
