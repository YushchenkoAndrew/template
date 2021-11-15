import React from "react";
import styles from "./Footer.module.css";
import DefaultLinks from "./DefaultLinks";

export interface DefaultFooterProps {
  className?: string;
  name: string;
  children: React.ReactNode;
}

export default function DefaultFooter(props: DefaultFooterProps) {
  return (
    <div className="container">
      <footer
        className={props.className ?? `pt-4 my-md-5 pt-md-5 border-top py-2`}
      >
        <div className="row justify-content-center">
          <div className="col-11">
            <div className="row">
              <div className="col col-md-5 col-sm-7 mx-sm-auto">
                <div className="d-flex flex-column h-100">
                  <h3
                    className={`text-dark row justify-content-sm-center ${styles["author"]}`}
                  >
                    Andrew Y
                  </h3>

                  <div className="d-none d-sm-block d-md-block d-lg-block d-xl-block mt-auto">
                    <div className="row justify-content-center">
                      <DefaultLinks />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-9 col-md-4 col-sm-5">
                <h6 className="mb-3 mb-lg-4 bold-text ">
                  <b>{props.name}</b>
                </h6>
                {props.children}
              </div>
            </div>

            <div className="d-sm-none row justify-content-center">
              <DefaultLinks />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
