import React from "react";
import Image from "react-bootstrap/Image";
import styles from "./Card.module.css";

export interface CardProps {
  img: string;
  title: string;
  href: string;
  size?: string;
  color?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function Card(props: CardProps) {
  return (
    <div className="card">
      <Image
        className="card-img"
        src={props.img}
        alt={`Project: ${props.title}`}
      />
      <a
        className={`card-img-overlay d-flex flex-column ${
          props.color ?? "text-white"
        } text-decoration-none`}
        href={props.href}
      >
        <div className="card-body">
          <h4
            className={`${styles["card-title"]} ${
              styles[props.size ?? "title-md"]
            }`}
          >
            {props.title}
          </h4>
          <p className={styles["card-text"]}>{props.description}</p>
        </div>
        {/* TODO: Maybe add footer info such as github or other stuff 
        <div className="card-footer">
          <div className="media">
            {props.children}
          </div>
        </div> */}
      </a>
    </div>
  );
}
