import React from "react";
import { basePath } from "../../../config";
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
        href={`${basePath}/admin`}
        style={props.style}
        active={props.home}
      />
      <NavItem
        name="Projects"
        href={`${basePath}/admin/projects`}
        style={props.style}
        active={props.projects}
      />
      <NavItem
        name="Settings"
        href={`${basePath}/admin/settings`}
        style={props.style}
        active={props.settings}
      />
      <NavItem
        name="Logout"
        href={`${basePath}/admin/logout`}
        style={props.style}
      />
      {props.children}
    </>
  );
}
