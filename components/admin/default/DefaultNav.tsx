import React from "react";
import NavItem from "../../NavBar/NavItem";

export interface DefaultNavProps {
  home?: boolean;
  projects?: boolean;
  settings?: boolean;
  children?: React.ReactNode;
  style?: string;
}

export default function DefaultNav(props: DefaultNavProps) {
  return (
    <>
      <NavItem
        name="Home"
        href="/projects/admin"
        style={props.style}
        active={props.home}
      />
      <NavItem
        name="Projects"
        href="/projects/admin/projects"
        style={props.style}
        target="_blank"
        active={props.projects}
      />
      <NavItem
        name="Settings"
        href="/projects/admin/settings"
        style={props.style}
        active={props.settings}
      />
      <NavItem
        name="Logout"
        href="/projects/admin/logout"
        style={props.style}
      />
      {props.children}
    </>
  );
}
