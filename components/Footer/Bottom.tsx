import React from "react";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface FooterBottomProps {
  email: string;
  children: React.ReactNode;
}

export default function FooterBottom(props: FooterBottomProps) {
  return (
    <div className="row justify-content-center">
      <div className="col-xl-8 col-md-4 col-sm-4 col-auto my-md-0 mt-5 order-sm-1 order-3 align-self-end">
        <p className="text-muted mb-0 pb-0">{props.children}</p>
      </div>
      <div className="col-xl-3 col-md-5 col-sm-7 col-auto order-1 align-self-end">
        <small>
          <FontAwesomeIcon className="mx-2" icon={faEnvelope} size="lg" />
          {props.email}
        </small>
      </div>
    </div>
  );
}
