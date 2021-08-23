import React from "react";

export interface GithubLink {
  href: string;
  lang?: string;
}

export interface DefaultProjectInfoProps {
  href: string;
  lang?: string;
  links?: Array<GithubLink>;
  description: string;
}

export default function DefaultProjectInfo(props: DefaultProjectInfoProps) {
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
                  `/projects/api/view/media?id=${localStorage.getItem("id")}`,
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
                href={item.href}
                key={key}
                onClick={() =>
                  localStorage.getItem("id")
                    ? fetch(
                        `/projects/api/view/media?id=${localStorage.getItem(
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
                Github{item.lang ? ` (${item.lang})` : ""}
              </a>
            ))
          : null}
      </p>
    </>
  );
}
