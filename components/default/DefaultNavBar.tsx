import React from "react";
import NavBar from "../NavBar";
import NavItem from "../NavItem";

export interface DefaultNavBarProps {
  home?: boolean;
  api?: boolean;
  projects?: boolean;
  info?: boolean;
}

export default function DefaultNavBar(props: DefaultNavBarProps) {
  return (
    <NavBar>
      <NavItem name="Home" href="/projects" active={props.home} />
      <NavItem name="API" href="/api/doc" active={props.api} />
      <NavItem
        name="Projects"
        href="/projects/projects"
        active={props.projects}
      />
      <NavItem name="Info" href="/projects/info" active={props.info} />
    </NavBar>
  );
}
