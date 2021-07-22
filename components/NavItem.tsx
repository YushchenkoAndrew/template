import React from "react";
import styles from "./NavItem.module.css";
import effect from "../styles/Glitch.module.css";

export interface NavItemProps {
  name: string;
}

export default function NavItem(props: NavItemProps) {
  return (
    <li className="nav-item">
      <a href="#" className={[styles["nav-link"], effect["glitch-rgb"]].join(" ")} data-glitch={props.name}>{props.name}</a>
    </li>
  );
}
