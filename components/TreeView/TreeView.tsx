import React, { useState } from "react";
import md5 from "../../lib/md5";
import { TreeObj } from "../../types/tree";
import styles from "./TreeView.module.css";
import Node from "./Node";
import {
  faFile,
  faFileCode,
  faFolder,
  faFolderOpen,
  faFont,
  faImage,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCss3Alt,
  faHtml5,
  faJs,
  faMarkdown,
} from "@fortawesome/free-brands-svg-icons";
import { FileData } from "../../types/api";

function getIcons(type: string | undefined): {
  icon: IconDefinition;
  color: string;
} {
  switch (type) {
    case "image/gif":
    case "image/jpg":
    case "image/jpeg":
    case "image/webp":
    case "image/png":
      return {
        icon: faImage,
        color: "text-primary",
      };

    case "font/ttf":
      return {
        icon: faFont,
        color: "text-muted",
      };

    case "text/markdown":
      return {
        icon: faMarkdown,
        color: "text-dark",
      };

    case "text/html":
      return {
        icon: faHtml5,
        color: styles["text-orange"],
      };

    case "text/css":
      return {
        icon: faCss3Alt,
        color: "text-primary",
      };

    case "application/json":
      return {
        icon: faFileCode,
        color: "text-success",
      };

    case "text/javascript":
      return {
        icon: faJs,
        color: "text-warning",
      };

    case undefined:
      return {
        icon: faFolder,
        color: "text-info",
      };
  }
  return {
    icon: faFile,
    color: "text-muted",
  };
}
export interface TreeViewProps {
  name: string;
  role: string;
  dir?: string;
  projectTree: TreeObj;
}

//
// TODO: Add functionality to delete file/folder
//
export default function TreeView(props: TreeViewProps) {
  const [showNode, onNodeChange] = useState({} as { [name: string]: boolean });

  function onStateChange(key: string) {
    onNodeChange({
      ...showNode,
      [key]: !showNode[key],
    });
  }

  function ParseTree(
    obj: TreeObj | FileData | null,
    forced?: boolean,
    index: number = 0
  ): React.ReactNode | undefined {
    if (!obj) return;
    return Object.entries(obj).map(([name, value], i) => {
      const key = md5(name + index.toString());
      const { icon, color } = getIcons(value.type);

      return (
        <Node
          name={name}
          open={name === props.role || forced || showNode[key]}
          key={key}
          index={key}
          icon={icon}
          iconClass={color}
          href={value.url}
          onChange={onStateChange}
        >
          {value.name
            ? null
            : ParseTree(value, name === props.role || forced, i)}
        </Node>
      );
    });
  }

  return (
    <ul className={styles["directory-list"]}>
      <Node
        className="font-weight-bold"
        name={props.name}
        icon={faFolderOpen}
        iconClass="text-info"
        open
      >
        {ParseTree(props.projectTree)}
      </Node>
    </ul>
  );
}
