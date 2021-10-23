import React from "react";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface FooterBottomProps {
  email: string;
  children: React.ReactNode;
}

export default function FooterBottom(props: FooterBottomProps) {
  return (
    <div className="row">
      <div className="col-12 col-lg-5 col-md-4 col-sm-5 pr-lg-5 mx-lg-auto pr-md-0 mx-md-auto my-2 order-sm-1 order-2 text-center">
        <p className="text-muted mb-0 pb-0">{props.children}</p>
      </div>
      <div className="col-12 col-lg-5 col-md-5 col-sm-7 mr-lg-5 my-2 order-sm-2 order-1 text-center">
        <small>
          <FontAwesomeIcon className="mx-2" icon={faEnvelope} size="lg" />
          {props.email}
        </small>
      </div>
    </div>
  );
}
