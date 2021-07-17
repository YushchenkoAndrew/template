import * as React from "react";
import NavBar from "../../components/NavBar/NavBar";
import NavItem from "../../components/NavBar/NavItem";

interface HomeProps {}

export default class Home extends React.Component<HomeProps> {
  render() {
    return (
      <>
        <NavBar>
          <NavItem name="Home" />
          <NavItem name="Home1" />
          <NavItem name="Home2" />
          <NavItem name="Home4" />
        </NavBar>
        <h1>Test</h1>
      </>
    );
  }
}
