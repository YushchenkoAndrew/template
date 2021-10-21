import React from "react";
import DefaultNav from "./DefaultNav";
import NavBar from "../../NavBar/NavBar";
import NavContainer from "../../NavBar/NavContainer";
import RunningLine from "../../RunningLine";

export interface DefaultHeaderProps {
  home?: boolean;
  projects?: boolean;
  settings?: boolean;
  children?: React.ReactNode;
}

export default function DefaultHeader(props: DefaultHeaderProps) {
  return (
    <header className="masthead">
      <NavBar>
        <NavContainer className="mx-auto">
          <DefaultNav
            home={props.home}
            projects={props.projects}
            settings={props.settings}
          ></DefaultNav>
        </NavContainer>

        <RunningLine text={process.env.ADMIN_USER ?? "admin"} size={7} />
      </NavBar>
      {props.children}
    </header>
  );
}
