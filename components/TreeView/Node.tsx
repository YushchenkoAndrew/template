import {
  faFolder,
  faFolderOpen,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import styles from "./TreeView.module.css";
export interface NodeProps {
  name: string;
  index?: string;
  open?: boolean;
  className?: string;
  icon?: IconDefinition;
  iconClass?: string;
  children?: React.ReactNode;
  onChange?: (key: string) => void;
}

function Node(props: NodeProps) {
  return (
    <li>
      <span
        className={`${
          props.className ?? ""
        } row text-dark text-decoration-none`}
        onClick={() => props.onChange?.(props.index || "")}
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
      </span>
      {props.children && props.open ? <ul>{props.children}</ul> : null}
    </li>
  );
}

export default React.memo(Node);
