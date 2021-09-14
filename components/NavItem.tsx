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
  const [nameProp, setNameProp] = useState(
    props.name.split("").map((item) => ({ char: item, color: "#fff" }))
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
      if (!props.active || (count > 10 && count < 20))
        // return setName(props.name);
        return setNameProp(
          props.name.split("").map((item) => ({ char: item, color: "#fff" }))
        );
      let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let i = Math.floor(Math.random() * props.name.length);
      let j = Math.floor(Math.random() * chars.length);
      setCount((count % 20) + 1);
      setNameProp(
        (props.name.substr(0, i) + chars.charAt(j) + props.name.substr(i + 1))
          .split("")
          .map((item, k) => ({ char: item, color: i !== k ? "#fff" : "#999" }))
      );
    }, 150);
    return () => clearInterval(interval);
  });

  return (
    <li className="nav-item">
      <a
        href={props.href}
        className={
          props.style ?? `${styles["nav-link"]} ${effect["glitch-rgb"]}`
        }
        onClick={() =>
          localStorage.getItem("id")
            ? fetch(
                `/projects/api/view/click?id=${localStorage.getItem("id")}`,
                {
                  method: "PATCH",
                }
              )
                .then((res) => null)
                .catch((err) => null)
            : null
        }
        target={props.target ?? "_self"}
        data-glitch={nameProp.map(({ char }) => char).join("")}
      >
        {nameProp.map(({ char, color }) => (
          <div style={{ color }}>{char}</div>
        ))}
      </a>
    </li>
  );
}
