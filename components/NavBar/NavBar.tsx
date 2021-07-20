import * as React from "react";
import styles from "./NavBar.module.css";

export interface NavBarProps {
  children: React.ReactNode;
}

export default function NavBar(props: NavBarProps) {
  return (
    <nav className={styles.navbar}>
      <ul className={styles["navbar-container"]}>{props.children}</ul>
    </nav>
  );
}
