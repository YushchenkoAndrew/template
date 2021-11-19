import { faPlusCircle, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./AddCard.module.css";

export interface AddCardProps {
  href: string;
}

export default function AddCard(props: AddCardProps) {
  return (
    // <div className="col-lg-4 col-md-6 mt-4">
    <div className="col col-lg-4 col-md-6 col-sm-11 my-3 text-center">
      <a
        href={props.href}
        className={`card border-info text-decoration-none p-2 h-100 ${styles["add-card"]}`}
      >
        <div className="container d-flex h-100 w-80">
          <div className="col align-self-center text-center">
            <FontAwesomeIcon
              className="text-info mt-4"
              icon={faPlusCircle}
              size="6x"
              fontSize="2rem"
            />
            <p className={`text-info ${styles["add-title"]}`}>Project</p>
          </div>
        </div>
      </a>
    </div>
  );
}
