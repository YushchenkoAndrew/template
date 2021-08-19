import React from "react";
import styles from "./CardStat.module.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface CardStatProps {
  value: number;
  gain?: number;
  title: string;
  icon: IconProp;
}

export default function CardStat(props: CardStatProps) {
  return (
    <div className={`card border-right ${styles["card-shadow"]} mb-4`}>
      <div className="card-body text-center">
        <div className="d-flex d-lg-flex d-md-block align-items-center">
          <div>
            <div className="d-inline-flex align-items-center">
              <h2 className="text-dark mb-1 font-weight-medium">
                {props.value}
              </h2>
              {props.gain ? (
                <span
                  className={`badge ${
                    props.gain > 0 ? "bg-primary" : "bg-danger"
                  } font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none`}
                >
                  {props.gain > 0
                    ? `+${props.gain.toFixed(2)}%`
                    : `${props.gain.toFixed(2)}%`}
                </span>
              ) : null}
            </div>

            <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate">
              {props.title}
            </h6>
          </div>
          <div className="ml-auto mt-md-3 mt-lg-0">
            <span className="opacity-7 text-muted">
              <FontAwesomeIcon icon={props.icon} size="2x" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
