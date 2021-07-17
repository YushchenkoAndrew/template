import * as React from "react";

export interface NavItemProps {
  name: string;
}

export default class NavItem extends React.Component<NavItemProps> {
  state = { click: 0 };

  render() {
    return (
      <li className="nav-item">
        <a
          href="#"
          className="nav-link"
          onClick={() => this.setState({ click: this.state.click + 1 })}
        >
          {this.props.name + " " + this.state.click}
        </a>
      </li>
    );
  }
}
