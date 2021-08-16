import React from "react";
import styles from "./Top.module.css";

export interface FooterTopProps {
  author: string;
  name: string;
  children: React.ReactNode;
}

export default function FooterTop(props: FooterTopProps) {
  return (
    <div className="row">
      <div className="col-xl-8 col-md-4 col-sm-4 col-12 my-auto mx-auto a">
        <h3 className={`text-dark mb-md-0 mb-5 ${styles["author"]}`}>
          {props.author}
        </h3>
      </div>
      <div className="col-xl-3 col-md-5 col-sm-5 col-12">
        <h6 className="mb-3 mb-lg-4 bold-text ">
          <b>{props.name}</b>
        </h6>
        {props.children}
      </div>
    </div>
  );
}
