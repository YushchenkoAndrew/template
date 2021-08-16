import React from "react";
import NavItem from "../NavItem";

export interface DefaultNavProps {
  home?: boolean;
  api?: boolean;
  projects?: boolean;
  info?: boolean;
  children?: React.ReactNode;
  style?: string;
}

export default function DefaultNav(props: DefaultNavProps) {
  return (
    <>
      <NavItem
        name="Home"
        href="/projects"
        style={props.style}
        active={props.home}
      />
      <NavItem
        name="API"
        href="/api/doc"
        style={props.style}
        target="_blank"
        active={props.api}
      />
      <NavItem
        name="Projects"
        href="/projects/projects"
        style={props.style}
        active={props.projects}
      />
      <NavItem
        name="Info"
        href="/projects/info"
        style={props.style}
        active={props.info}
      />
      {props.children}
    </>
  );
}
