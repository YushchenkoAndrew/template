import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

export interface NavBarProps {
  className?: string;
  children: React.ReactNode;
}

export default function NavContainer(props: NavBarProps) {
  return (
    <>
      <Navbar.Toggle className="mb-3" aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse
        className={props.className ?? ""}
        id="responsive-navbar-nav"
      >
        <Nav className="me-auto">{props.children}</Nav>
      </Navbar.Collapse>
    </>
  );
}
