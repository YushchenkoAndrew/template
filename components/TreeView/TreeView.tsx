import React, { useRef, useState } from "react";
import md5 from "../../lib/md5";
import { ProjectFile } from "../../types/projects";
import { TreeObj } from "../../types/tree";
import Node from "./Node";

export interface TreeViewProps {
  name: string;
  projectTree: TreeObj;
}

function ParseTree(
  obj: TreeObj | ProjectFile | null
): React.ReactNode | undefined {
  if (!obj) return;
  return Object.entries(obj).map(([name, value]) => (
    <Node key={md5(name + Math.random().toString())} name={name}>
      {value.name ? null : ParseTree(value)}
    </Node>
  ));
}

export default function TreeView(props: TreeViewProps) {
  return (
    <ul>
      <Node name={props.name}>{ParseTree(props.projectTree)}</Node>
    </ul>
  );
}
