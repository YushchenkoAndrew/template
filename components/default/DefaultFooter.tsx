import React from "react";
import FooterTop from "../Footer/Top";
import FooterBottom from "../Footer/Bottom";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export interface DefaultFooterProps {
  name: string;
  children: React.ReactNode;
}

export default function DefaultFooter(props: DefaultFooterProps) {
  return (
    <div className="container">
      <footer className="pt-4 my-md-5 pt-md-5 border-top py-2">
        <div className="row justify-content-center">
          <div className="col-11">
            <FooterTop author="Andrew Y" name={props.name}>
              {props.children}
            </FooterTop>
            <FooterBottom email="AndrewYushchenko@gmail.com">
              <a
                className="text-muted mx-2 mx-md-3"
                href="https://github.com/YushchenkoAndrew"
                target="_blank"
              >
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
              <a
                className="text-muted mx-2 mx-md-3"
                href="https://twitter.com/AndrewY69942173"
                target="_blank"
              >
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a
                className="text-muted mx-2 mx-md-3"
                href="https://www.linkedin.com/in/andrew-yushchenko-7447771a2/"
                target="_blank"
              >
                <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
              </a>
            </FooterBottom>
          </div>
        </div>
      </footer>
    </div>
  );
}