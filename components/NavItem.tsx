import React from "react";
import styles from "./NavItem.module.css";

export interface NavItemProps {
  name: string;
}

export default function NavItem(props: NavItemProps) {
  return (
    <li className={styles["nav-item"]}>
      <a href="#" className={styles["nav-link"]}>{props.name}</a>
    </li>
  );
}
