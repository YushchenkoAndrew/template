import React, { useState } from "react";

export interface NavItemProps {
  name: string;
}

export default function NavItem(props: NavItemProps) {
  const [click, setClick] = useState(0);

  return (
    <li className="nav-item">
      <a href="#" className="nav-link" onClick={() => setClick(click + 1)}>
        {props.name + " " + click}
      </a>
    </li>
  );
}
