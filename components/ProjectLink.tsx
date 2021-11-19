import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MediaView } from "./default/DefaultLinks";
import styles from "./ProjectLink.module.css";

export interface ProjectLinkProps {
  desc: string;
  link: string;
}

export default function ProjectLink(props: ProjectLinkProps) {
  return (
    <div className="container d-flex h-100">
      <div className={`mr-auto py-2 pr-2 ${styles["text"]}`}>{props.desc}</div>
      <div className="row align-self-center">
        <a
          className={`text-muted mx-2 mx-md-3 ${styles["text"]}`}
          href={props.link}
          onClick={MediaView}
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon
            className="text-muted"
            icon={faExternalLinkAlt}
            size="1x"
            fontSize="1rem"
          />
        </a>
      </div>
    </div>
  );
}
