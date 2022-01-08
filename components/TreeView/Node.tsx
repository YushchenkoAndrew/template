import {
  faExternalLinkAlt,
  faFolder,
  faFolderOpen,
  faPencilAlt,
  faTrashAlt,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./Node.module.css";
export interface NodeProps {
  name: string;
  index?: string;
  href?: string;
  open?: boolean;
  className?: string;
  icon?: IconDefinition;
  iconClass?: string;
  children?: React.ReactNode;
  onChange?: (key: string) => void;
  onSelect?: (key: string) => void;
}

function Node(props: NodeProps) {
  return (
    <li>
      <span
        className={`${
          props.className ?? ""
        } row text-dark text-decoration-none`}
        onClick={() => {
          if (props.icon !== faFolder) return props.onSelect?.(props.name);
          props.onChange?.(props.index || "");
        }}
      >
        {props.icon ? (
          <FontAwesomeIcon
            className={`ml-1 mr-2 ${props.iconClass ?? ""}`}
            icon={
              props.icon === faFolder && props.open ? faFolderOpen : props.icon
            }
            size="lg"
            fontSize="1rem"
          />
        ) : (
          <span />
        )}
        {props.name}

        {/* TODO: Maybe to do some node editing */}
        <a>
          <FontAwesomeIcon
            className={`ml-4 mr-1 ${styles["el-prop"]} text-primary `}
            icon={faPencilAlt}
            size="lg"
            fontSize="1rem"
          />
        </a>
        <a
          href={props.href ?? "#"}
          target={props.href ? "_blank" : "_self"}
          download={
            props.href && props.href.startsWith("data:")
              ? props.name
              : undefined
          }
        >
          <FontAwesomeIcon
            className={`ml-1 mr-1 ${styles["el-prop"]} text-primary`}
            icon={faExternalLinkAlt}
            size="lg"
            fontSize="1rem"
          />
        </a>
        <a>
          <FontAwesomeIcon
            className={`ml-1 mr-2 ${styles["el-prop"]} text-danger `}
            icon={faTrashAlt}
            size="lg"
            fontSize="1rem"
          />
        </a>
      </span>
      {props.children && props.open ? <ul>{props.children}</ul> : null}
    </li>
  );
}

export default React.memo(Node);
