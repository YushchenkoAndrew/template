import { useRouter } from "next/dist/client/router";
import React, { CSSProperties, useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import styles from "./Card.module.css";

export interface AlertProps {
  state: string;
  title?: string;
  note?: string;
}

export default function Alert(props: AlertProps) {
  return (
    <div
      className={`col align-self-center text-center alert ${props.state} ${
        props.title ? "" : "d-none"
      }`}
    >
      <h4 className="alert-heading">{props.title}</h4>
      <p>{props.note}</p>
    </div>
  );
}
