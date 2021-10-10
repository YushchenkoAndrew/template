import React, { useRef, useState } from "react";

export interface NodeProps {
  name: string;
  children?: React.ReactNode;
}

export default function Node(props: NodeProps) {
  return (
    <li>
      <span>{props.name}</span>
      {props.children ? <ul>{props.children}</ul> : null}
    </li>
  );
}
