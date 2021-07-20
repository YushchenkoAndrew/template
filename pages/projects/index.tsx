import * as React from "react";
import NavBar from "../../components/NavBar/NavBar";
import NavItem from "../../components/NavBar/NavItem";

interface HomeProps {}

export default function Home(props: HomeProps) {
  return (
    <>
      <NavBar>
        <NavItem name="Home" />
        <NavItem name="Home1" />
        <NavItem name="Home2" />
        <NavItem name="Home4" />
      </NavBar>
      <p>This is another paragraph.</p>
    </>
  );
}

