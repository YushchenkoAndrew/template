import { useRouter } from "next/dist/client/router";
import React from "react";
import NavItem from "../NavBar/NavItem";

export interface DefaultNavProps {
  home?: boolean;
  api?: boolean;
  projects?: boolean;
  info?: boolean;
  children?: React.ReactNode;
  style?: string;
}

export default function DefaultNav(props: DefaultNavProps) {
  const router = useRouter();
  const basePath = router.basePath;
  return (
    <>
      <NavItem
        name="Home"
        href={basePath}
        style={props.style}
        active={props.home}
      />
      <NavItem
        name="API"
        href="/api/swagger/index.html"
        style={props.style}
        target="_blank"
        active={props.api}
      />
      <NavItem
        name="Projects"
        href={`${basePath}/projects`}
        style={props.style}
        active={props.projects}
      />
      <NavItem
        name="Info"
        href={`${basePath}/info`}
        style={props.style}
        active={props.info}
      />
      {props.children}
    </>
  );
}
