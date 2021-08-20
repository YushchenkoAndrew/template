import React, { CSSProperties, useEffect, useState } from "react";
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
  let [offset, setOffset] = useState({ top: -1, left: -1 } as DOMRect);
  let [animation, setAnimation] = useState("");
  let [transitionStyle, setStyle] = useState({
    top: 0,
    left: 0,
  } as CSSProperties);

  useEffect(() => {
    document.addEventListener("scroll", () =>
      setOffset({ top: -1, left: -1 } as DOMRect)
    );
  }, []);

  // TODO: Think about mobile !!! Change OnMouseEvent for them!!
  return (
    <div
      className="card overflow-hidden"
      ref={(el) =>
        el && offset.top == -1 && offset.left == -1
          ? setOffset(el?.getBoundingClientRect())
          : null
      }
      onMouseEnter={(e) => {
        setStyle({
          top: e.pageY - offset.top - window.scrollY,
          left: e.pageX - offset.left - window.scrollX,
        });
        setAnimation(styles["explode-animation"]);
      }}
      onMouseLeave={(e) => {
        setStyle({
          top: e.pageY - offset.top - window.scrollY,
          left: e.pageX - offset.left - window.scrollX,
        });
        setAnimation(styles["displode-animation"]);
      }}
    >
      <span className={`${styles["card-middleware"]}`} />
      <span
        className={`${styles["card-hover"]} ${animation}`}
        style={transitionStyle}
      />
      <Image
        className="card-img"
        src={props.img}
        alt={`Project: ${props.title}`}
        style={{ mixBlendMode: "multiply" }}
      />
      <a
        className={`card-img-overlay d-flex flex-column ${
          props.color ?? "text-white"
        } text-decoration-none`}
        onClick={() => fetch("/projects/api/view/click", { method: "PATCH" })}
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
