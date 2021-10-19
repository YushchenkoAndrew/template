import { useRouter } from "next/dist/client/router";
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
  const router = useRouter();
  const basePath = router.basePath;

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
            alt="Project image"
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
              {/* FIXME: Make on option in props to choose which href or onClick  */}
              <a
                href={`${basePath}/admin/projects/edit?id=${props.id}`}
                className="btn btn-sm btn-outline-info mr-2"
              >
                Modify
              </a>
              {/* TODO: Change this to fetch request !!!! */}
              <a
                href={`${basePath}/admin/projects/edit/${props.id}`}
                className="btn btn-sm btn-outline-danger"
              >
                Delete
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
