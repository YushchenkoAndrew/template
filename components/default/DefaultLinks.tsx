import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { basePath } from "../../config";

export function MediaView() {
  localStorage.getItem("id")
    ? fetch(`${basePath}/api/view/media?id=${localStorage.getItem("id")}`, {
        method: "PATCH",
      })
        .then((res) => null)
        .catch((err) => null)
    : null;
}

export interface DefaultLinksProps {}

export default function DefaultLinks(props: DefaultLinksProps) {
  return (
    <>
      <a
        className="text-muted mx-2 mx-md-3"
        href="https://github.com/YushchenkoAndrew"
        onClick={MediaView}
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faGithub} size="lg" />
      </a>
      <a
        className="text-muted mx-2 mx-md-3"
        href="https://twitter.com/AndrewY69942173"
        onClick={MediaView}
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faTwitter} size="lg" />
      </a>
      <a
        className="text-muted mx-2 mx-md-3"
        href="https://www.linkedin.com/in/andrew-yushchenko-7447771a2/"
        onClick={MediaView}
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
      </a>
    </>
  );
}
