import React from "react";
import NavItem from "../NavItem";

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
        <a className="font-weight-bold" href={props.href} target="_blank">
          Github{props.lang ? ` (${props.lang})` : ""}
        </a>
        {props.links
          ? props.links.map((item) => (
              <>
                {" "}
                <a
                  className="font-weight-bold"
                  href={item.href}
                  target="_blank"
                >
                  Github{item.lang ? ` (${item.lang})` : ""}
                </a>
              </>
            ))
          : null}
      </p>
    </>
  );
}