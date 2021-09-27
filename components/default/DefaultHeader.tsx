import React from "react";
import NavBar from "../NavBar/NavBar";
import NavContainer from "../NavBar/NavContainer";
import DefaultNav from "./DefaultNav";
import styles from "./Default.module.css";

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
        <NavContainer>
          <DefaultNav
            home={props.home}
            api={props.api}
            projects={props.projects}
            info={props.info}
          ></DefaultNav>
        </NavContainer>
      </NavBar>
      {props.children}
    </header>
  );
}
