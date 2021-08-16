import React from "react";

export interface FooterProps {
  author: string;
  name: string;
  children: React.ReactNode;
}

export default function Footer(props: FooterProps) {
  return (
    <div className="row">
      <div className="col-xl-8 col-md-4 col-sm-4 col-12 my-auto mx-auto a">
        <h3 className="text-muted mb-md-0 mb-5 bold-text">{props.author}</h3>
      </div>
      <div className="col-xl-2 col-md-4 col-sm-4 col-12">
        <h6 className="mb-3 mb-lg-4 bold-text ">
          <b>{props.name}</b>
        </h6>
        {props.children}
      </div>
    </div>
  );
}
