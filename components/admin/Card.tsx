import React, { CSSProperties, useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import styles from "./Card.module.css";

export interface CardProps {
  img: string;
  title: string;
  // href: string;
  // size?: string;
  flag: string;
  desc?: string;
}

export default function Card(props: CardProps) {
  const desc = (props.desc ?? "").split(" ");

  return (
    <div className="col-lg-4 col-md-6 col-sm-11 mt-4">
      <div className="card p-2">
        <div className="text-right">
          <div className="d-flex justify-content-between">
            <span></span>
            <div className={styles["flag"]}>
              {/* TODO: Change marker color  */}
              <span>{props.flag}</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-1">
          <Image
            className="center-block rounded-circle"
            src={props.img}
            // FIXME: Do not change img
            width="100"
            height="100"
            alt="TEMP"
          />
          <h4 className="d-block text-dark font-weight-bold mt-3">
            {props.title}
          </h4>
          <hr />
          <p className="font-italic text-muted ml-1">
            {desc.length < 15
              ? desc.join(" ")
              : desc.slice(0, 15).join(" ") + "..."}
          </p>
          <div className="d-flex justify-content-between mt-3">
            <span></span>
            {/* TODO: Add href */}
            <a href="" className="btn btn-sm btn-outline-dark mb-2 mr-2">
              Modify
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
