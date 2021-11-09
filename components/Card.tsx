import React, { CSSProperties, useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import { basePath } from "../config";
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
  let [opacityStyle, setOpacity] = useState("");
  let [animation, setAnimation] = useState("");
  let [transitionStyle, setStyle] = useState({
    top: 0,
    left: 0,
  } as CSSProperties);

  useEffect(() => {
    document.addEventListener("scroll", () =>
      setOffset({ top: -1, left: -1 } as DOMRect)
    );

    // FIXME: Kinda strange bug with resize window
    window.onresize = () => setOffset({ top: -1, left: -1 } as DOMRect);
  }, []);

  function showElement(x: number, y: number) {
    setStyle({ top: y, left: x });
    setOpacity(styles["dim"]);
    setAnimation(styles["explode-animation"]);
  }

  function hideElement(x: number, y: number) {
    setStyle({ top: y, left: x });
    setOpacity(styles["appear"]);
    setAnimation(styles["displode-animation"]);
  }

  return (
    <div
      className="card overflow-hidden mb-3"
      ref={(el) =>
        el && offset.top == -1 && offset.left == -1
          ? setOffset(el.getBoundingClientRect())
          : null
      }
      onMouseEnter={(e) =>
        showElement(
          e.pageX - offset.left - window.scrollX,
          e.pageY - offset.top - window.scrollY
        )
      }
      onMouseLeave={(e) =>
        hideElement(
          e.pageX - offset.left - window.scrollX,
          e.pageY - offset.top - window.scrollY
        )
      }
      onTouchStart={(e) => showElement(0, 0)}
      onTouchEnd={(e) => hideElement(0, 0)}
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
        onClick={() =>
          localStorage.getItem("id")
            ? fetch(
                `${basePath}/api/view/click?id=${localStorage.getItem("id")}`,
                {
                  method: "PATCH",
                }
              )
                .then((res) => null)
                .catch((err) => null)
            : null
        }
        href={props.href}
      >
        <div className={`card-body ${opacityStyle}`}>
          <h4
            className={`${styles["card-title"]} ${
              styles[props.size ?? "title-md"]
            }`}
          >
            {props.title}
          </h4>
          <p className={styles["card-text"]}>{props.description}</p>
        </div>
      </a>
    </div>
  );
}
