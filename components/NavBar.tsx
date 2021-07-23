import React from "react";
import { Navbar, Container } from "react-bootstrap";

export interface NavBarProps {
  children: React.ReactNode;
}

export default function NavBar(props: NavBarProps) {
  return (
  <Navbar collapseOnSelect fixed="top" bg="dark" variant="dark" expand="md">
    <Container>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        {props.children}
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
}
