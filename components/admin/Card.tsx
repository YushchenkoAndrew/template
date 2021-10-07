import React from "react";
import Image from "react-bootstrap/Image";
import { FlagType } from "../../types/flag";
import styles from "./Card.module.css";
import Flag from "./Flag";

export interface CardProps {
  id: number;
  img: string;
  title: string;
  flag: FlagType;
  desc?: string;
}

export default function Card(props: CardProps) {
  const desc = (props.desc ?? "").split(" ");

  return (
    <div className="col-lg-4 col-md-6 col-sm-11 mt-4">
      <div className={`card p-2 h-100 ${styles["shadow"]}`}>
        <div className="text-right">
          <div className="d-flex justify-content-between">
            <span />
            <Flag className="mr-2" name={props.flag} />
          </div>
        </div>
        <div className="container text-center">
          <Image
            className="center-block rounded-circle"
            src={props.img}
            // FIXME: Do not change img
            width="100"
            height="100"
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
          <div className="d-flex justify-content-between mt-3 mb-2">
            <span />
            <div className="row mr-2 mb-2">
              <a
                href={`/projects/admin/projects/info/${props.id}`}
                className="btn btn-sm btn-outline-info mr-2"
              >
                Statistics
              </a>
              <a
                href={`/projects/admin/projects/edit/${props.id}`}
                className="btn btn-sm btn-outline-dark"
              >
                Modify
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
