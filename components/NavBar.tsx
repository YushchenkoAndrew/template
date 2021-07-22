import * as React from "react";
// import styles from "./NavBar.module.css";

export interface NavBarProps {
  children: React.ReactNode;
}

export default function NavBar(props: NavBarProps) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">{props.children}</ul>
      </div>
    </nav>
  );
}
