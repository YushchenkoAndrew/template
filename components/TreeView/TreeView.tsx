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
} from "@fortawesome/free-solid-svg-icons";
import {
  faCss3Alt,
  faDocker,
  faHtml5,
  faJs,
  faMarkdown,
} from "@fortawesome/free-brands-svg-icons";
import { FileData } from "../../types/api";

const fileType = {
  "image/gif": { icon: faImage, color: "text-primary" },
  "image/jpg": { icon: faImage, color: "text-primary" },
  "image/jpeg": { icon: faImage, color: "text-primary" },
  "image/webp": { icon: faImage, color: "text-primary" },
  "image/png": { icon: faImage, color: "text-primary" },

  "text/markdown": { icon: faMarkdown, color: "text-dark" },
  "text/html": { icon: faHtml5, color: styles["text-orange"] },
  "text/css": { icon: faCss3Alt, color: "text-primary" },
  "text/javascript": { icon: faJs, color: "text-warning" },
  "text/dockerfile": { icon: faDocker, color: "text-primary" },
  "text/yaml": { icon: faFileCode, color: "text-danger" },

  "font/ttf": { icon: faFont, color: "text-muted" },

  "application/json": { icon: faFileCode, color: "text-success" },
  undefined: { icon: faFolder, color: "text-info" },
};
export interface TreeViewProps {
  name: string;
  role: string;
  dir?: string;
  projectTree: TreeObj;
  onFileSelect: (key: string[]) => void;
}

//
// TODO: Add functionality to delete file/folder
//
export default function TreeView(props: TreeViewProps) {
  const [showNode, onNodeChange] = useState({} as { [name: string]: boolean });

  function ParseTree(
    obj: TreeObj | FileData | null,
    forced?: boolean,
    path: string = "",
    index: number = 0
  ): React.ReactNode | undefined {
    if (!obj) return;
    return Object.entries(obj).map(([name, value], i) => {
      const key = md5(name + index.toString());
      const { icon, color } = fileType[value.type] ?? {
        icon: faFile,
        color: "text-muted",
      };

      return (
        <Node
          name={name}
          open={name === props.role || forced || showNode[key]}
          key={key}
          index={key}
          icon={icon}
          iconClass={color}
          href={value.url}
          onChange={(key: string) => {
            onNodeChange({
              ...showNode,
              [key]: !showNode[key],
            });
          }}
          onSelect={() =>
            props.onFileSelect(
              [...path.split("/"), name].filter((item) => item)
            )
          }
        >
          {value.name
            ? null
            : ParseTree(
                value,
                name === props.role || forced,
                path + "/" + name,
                i
              )}
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
