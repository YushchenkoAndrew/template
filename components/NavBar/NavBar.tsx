import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

export interface NavBarProps {
  children: React.ReactNode;
}

export default function NavBar(props: NavBarProps) {
  return (
    <Navbar collapseOnSelect bg="dark" variant="dark" expand="md">
      <Container>{props.children}</Container>
    </Navbar>
  );
}
