import * as React from "react";
import styles from "./NavBar.module.css";

export interface NavBarProps {
  children: React.ReactNode;
}

export default function NavBar(props: NavBarProps) {
  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-collapse"]}>
        <ul className={styles["navbar-nav"]}>{props.children}</ul>
      </div>
    </nav>
  );
}
