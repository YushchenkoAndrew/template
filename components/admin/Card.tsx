import React from "react";
import Image from "react-bootstrap/Image";
import { FlagType } from "../../types/flag";
import SimpleButton from "../SimpleButton";
import styles from "./Card.module.css";
import Flag from "./Flag";

export type EventLinks = {
  modify: {
    href?: string;
    onClick?: () => void;
  };
  delete: {
    href?: string;
    onClick?: () => void;
  };
};
export interface CardProps {
  id: number;
  img: string;
  href: string;
  title: string;
  flag: FlagType;
  desc?: string;
  event: EventLinks;
}

export default function Card(props: CardProps) {
  const desc = (props.desc ?? "").split(" ");

  return (
    <div className="col-lg-4 col-md-6 col-sm-11 my-3 text-center">
      <div className={`card p-2 h-100 ${styles["shadow"]}`}>
        <div className="text-right">
          <div className="d-flex justify-content-between">
            <span />
            <Flag className="mr-2" name={props.flag} />
          </div>
        </div>
        <div className="container text-center">
          <a href={props.href} target="_blank">
            <Image
              className={`${styles["circular"]}`}
              src={props.img}
              // FIXME: Do not change img
              // width="100"
              alt="Project image"
            />
          </a>
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
              <SimpleButton
                className="btn btn-sm btn-outline-info mr-2"
                event={props.event.modify}
              >
                Modify
              </SimpleButton>
              <SimpleButton
                className="btn btn-sm btn-outline-danger a.href"
                event={props.event.delete}
              >
                Delete
              </SimpleButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
