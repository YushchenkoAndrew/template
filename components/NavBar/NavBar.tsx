import * as React from "react";

export interface NavBarProps {
  children: React.ReactNode;
}

export default class NavBar extends React.Component<NavBarProps> {
  render() {
    return (
      <nav className="navbar">
        <ul className="navbar-nav">{this.props.children}</ul>
      </nav>
    );
  }
}
