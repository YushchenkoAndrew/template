import React, { useEffect, useState } from "react";
import styles from "./NavItem.module.css";
import effect from "../styles/Glitch.module.css";

export interface NavItemProps {
  name: string;
  href: string;
  style?: string;
  target?: React.HTMLAttributeAnchorTarget;
  active?: boolean;
}

export default function NavItem(props: NavItemProps) {
  const [name, setName] = useState(props.name);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
      if (!props.active || (count > 10 && count < 20))
        return setName(props.name);
      let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let i = Math.floor(Math.random() * props.name.length);
      let j = Math.floor(Math.random() * chars.length);
      setCount((count % 20) + 1);
      setName(
        props.name.substr(0, i) + chars.charAt(j) + props.name.substr(i + 1)
      );
    }, 100);
    return () => clearInterval(interval);
  });

  return (
    <li className="nav-item">
      <a
        href={props.href}
        className={
          props.style ?? `${styles["nav-link"]} ${effect["glitch-rgb"]}`
        }
        onClick={() => fetch("/projects/api/view/click", { method: "PATCH" })}
        target={props.target ?? "_self"}
        data-glitch={name}
      >
        {name}
      </a>
    </li>
  );
}
