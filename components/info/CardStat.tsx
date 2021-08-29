import React from "react";
import styles from "./CardStat.module.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { animated, SpringValue } from "react-spring";

export interface CardStatProps {
  value: SpringValue<number>;
  gain?: SpringValue<number>;
  goal: number;
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
              <animated.h2 className="text-dark mb-1 font-weight-medium">
                {props.value.to((n) => n.toFixed(0))}
              </animated.h2>
              {props.gain ? (
                <animated.span
                  className={`badge ${
                    props.goal > 0
                      ? "bg-primary"
                      : props.goal < 0
                      ? "bg-danger"
                      : 0
                  } font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none`}
                >
                  {props.gain.to((n) =>
                    n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`
                  )}
                </animated.span>
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
