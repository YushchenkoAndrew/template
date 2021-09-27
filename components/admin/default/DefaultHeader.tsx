import React from "react";
import DefaultNav from "./DefaultNav";
import NavBar from "../../NavBar/NavBar";
import NavContainer from "../../NavBar/NavContainer";
import styles from "./Default.module.css";

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

        <h3 className={`text-white ${styles["admin-name"]}`}>
          {process.env.ADMIN_USER ?? "admin"}
        </h3>
      </NavBar>
      {props.children}
    </header>
  );
}
