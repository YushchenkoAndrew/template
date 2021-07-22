import * as React from "react";
import NavBar from "../../components/NavBar";
import NavItem from "../../components/NavItem";
import styles from "../../styles/Projects.module.css";
import stylesId from "../../styles/Glitch.module.css";

interface HomeProps {}

export default function Home(props: HomeProps) {
  return (
    <>
      <NavBar>
        <NavItem name="Home" />
        <NavItem name="API" />
        <NavItem name="Projects" />
        <NavItem name="Info" />
      </NavBar>
    </>
  );
}

