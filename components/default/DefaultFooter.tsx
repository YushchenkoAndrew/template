import React from "react";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

export interface DefaultFooterProps {
  children?: React.ReactNode;
}

export default function DefaultFooter(props: DefaultFooterProps) {
  return (
    <div className="container">
      <footer className="pt-4 my-md-5 pt-md-5 border-top py-2">
        <div className="row justify-content-center">
          <div className="col-11">
            <div className="row">
              <div className="col-xl-8 col-md-4 col-sm-4 col-12 my-auto mx-auto a">
                <h3 className="text-muted mb-md-0 mb-5 bold-text">Andrew Y</h3>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                <h6 className="mb-3 mb-lg-4 bold-text ">
                  <b>MENU</b>
                </h6>
                <ul className="list-unstyled">
                  <li>Home</li>
                  <li>About</li>
                  <li>Blog</li>
                  <li>Portfolio</li>
                </ul>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-xl-8 col-md-4 col-sm-4 col-auto my-md-0 mt-5 order-sm-1 order-3 align-self-end">
                <p className="social text-muted mb-0 pb-0 bold-text">
                  <FontAwesomeIcon className="mx-1" icon={faGithub} />
                  <FontAwesomeIcon className="mx-1" icon={faLinkedinIn} />
                </p>
              </div>
              <div className="col-xl-3 col-md-5 col-sm-5 col-auto order-1 align-self-end">
                <small>
                  <FontAwesomeIcon
                    className="mx-2"
                    icon={faEnvelope}
                    size="sm"
                  />
                  AndrewYushchenko@gmail.com
                </small>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
