import React from "react";
import styles from "./NavItem.module.css";
import effect from "../styles/Glitch.module.css";

export interface NavItemProps {
  name: string;
  href: string;
  active?: boolean;
}

export default function NavItem(props: NavItemProps) {
  return (
    <li className="nav-item">
      <a
        href={props.href}
        // className={`${styles["nav-link"]} ${effect["glitch-rgb"]} ${
        className={`${styles["nav-link"]} ${
          props.active ? effect["glitch-judder"] : ""
        }`}
        data-glitch={props.name}
      >
        {props.name}
      </a>
    </li>
  );
}
