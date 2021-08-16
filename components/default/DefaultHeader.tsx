import React from "react";
import NavBar from "../NavBar";
import NavItem from "../NavItem";
import DefaultNav from "./DefaultNav";

export interface DefaultHeaderProps {
  home?: boolean;
  api?: boolean;
  projects?: boolean;
  info?: boolean;
  children?: React.ReactNode;
}

export default function DefaultHeader(props: DefaultHeaderProps) {
  return (
    <header className="masthead">
      <NavBar>
        <DefaultNav
          home={props.home}
          api={props.api}
          projects={props.projects}
          info={props.info}
        ></DefaultNav>
      </NavBar>
      {props.children}
    </header>
  );
}
