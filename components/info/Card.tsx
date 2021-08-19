import React from "react";
import styles from "./CardStat.module.css";

export interface CardProps {
  title: string;
  children: React.ReactNode;
}

export default function Card(props: CardProps) {
  return (
    <div className={`card ${styles["card-shadow"]}`}>
      <div className="card-body">
        <h4 className="card-title">{props.title}</h4>
        <div className="mt-2">{props.children}</div>
      </div>
    </div>
  );
}
